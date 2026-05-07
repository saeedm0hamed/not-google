import os
from fastapi import FastAPI, HTTPException, Query
from api.schemas import SearchResponse, StatsResponse, DocumentResponse, CrawlRequest
from api.search import rank_search, wildcard_search, fetch_ddgs_results
from db.supabase_client import get_supabase
from indexer.tasks import celery_app
from typing import Optional

app = FastAPI(title="Information Retrieval System API")

@app.get("/search", response_model=SearchResponse)
async def search(q: str, k: int = Query(10, gt=0)):
    results = rank_search(q, k)
    ddgs_results, ddgs_images = fetch_ddgs_results(q, 5)
    return {
        "query": q,
        "total_results": len(results),
        "results": results,
        "ddgs_results": ddgs_results,
        "ddgs_images": ddgs_images
    }

@app.get("/search/wildcard", response_model=SearchResponse)
async def search_wildcard(q: str, k: int = Query(10, gt=0)):
    # Basic validation for wildcard characters
    if '*' not in q and '?' not in q:
        # Fallback to normal search if no wildcards
        return await search(q, k)
        
    results = wildcard_search(q, k)
    ddgs_results, ddgs_images = fetch_ddgs_results(q, 5)
    return {
        "query": q,
        "total_results": len(results),
        "results": results,
        "ddgs_results": ddgs_results,
        "ddgs_images": ddgs_images
    }

@app.post("/crawl")
async def trigger_crawl(request: Optional[CrawlRequest] = None):
    # In a real Scrapy setup, we'd trigger the spider via Scrapyd or a Celery task
    # For this implementation, we'll assume a Celery task handles starting the crawler
    # Or just return a message that it's triggered (since the crawler usually runs standalone)
    return {"message": "Crawl job triggered", "target": os.getenv("TARGET_DOMAIN")}

@app.get("/stats", response_model=StatsResponse)
async def get_stats():
    supabase = get_supabase()
    
    docs_count = supabase.table("documents").select("id", count="exact").execute().count
    terms_count = supabase.table("term_stats").select("term", count="exact").execute().count
    index_size = supabase.table("inverted_index").select("id", count="exact").execute().count
    
    return {
        "total_docs": docs_count or 0,
        "total_terms": terms_count or 0,
        "index_size": index_size or 0
    }

@app.get("/document/{doc_id}", response_model=DocumentResponse)
async def get_document(doc_id: int):
    supabase = get_supabase()
    response = supabase.table("documents").select("*").eq("id", doc_id).single().execute()
    
    if not response.data:
        raise HTTPException(status_code=404, detail="Document not found")
        
    doc = response.data
    return {
        "id": doc["id"],
        "url": doc["url"],
        "title": doc.get("title"),
        "image_url": doc.get("image_url"),
        "plain_text": doc.get("plain_text", ""),
        "crawled_at": str(doc["crawled_at"])
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
