import os
from bs4 import BeautifulSoup
from langdetect import detect, DetectorFactory
from db.supabase_client import get_supabase
from indexer.tasks import celery_app

# Set seed for langdetect for consistent results
DetectorFactory.seed = 0

class SupabasePipeline:
    def __init__(self):
        self.supabase = get_supabase()
        self.max_pages = int(os.getenv("MAX_PAGES", 3000))
        self.pages_count = 0

    def process_item(self, item, spider):
        spider.logger.info(f"Processing item in pipeline: {item.get('url')}")
        if self.pages_count >= self.max_pages:
            spider.crawler.engine.close_spider(spider, 'max_pages_reached')
            return item

        raw_html = item.get('raw_html')
        url = item.get('url')
        title = item.get('title')
        image_url = item.get('image_url')

        # 1. Extract plain text via BeautifulSoup4
        soup = BeautifulSoup(raw_html, 'lxml')
        # Remove script and style elements
        for script in soup(["script", "style"]):
            script.extract()
        
        plain_text = soup.get_text(separator=' ', strip=True)

        # 2. Detect language
        try:
            lang = detect(plain_text)
        except:
            lang = 'unknown'

        if lang != 'en':
            return None # Discard non-English pages

        # 3. Upsert into Supabase documents table
        try:
            data = {
                "url": url,
                "title": title,
                "raw_html": raw_html,
                "plain_text": plain_text,
                "language": lang,
                "image_url": image_url,
                "indexed": False
            }
            
            # Use upsert to handle duplicates by URL
            result = self.supabase.table("documents").upsert(data, on_conflict="url").execute()
            
            if result.data:
                doc_id = result.data[0]['id']
                self.pages_count += 1
                
                # 4. Push doc_id to Celery indexer queue
                celery_app.send_task("indexer.tasks.index_document", args=[doc_id])
                spider.logger.info(f"Successfully saved and queued doc_id: {doc_id}")
                
        except Exception as e:
            spider.logger.error(f"Error upserting to Supabase: {e}")

        return item
