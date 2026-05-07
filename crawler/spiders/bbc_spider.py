import os
import scrapy
from scrapy.spiders import CrawlSpider, Rule
from scrapy.linkextractors import LinkExtractor

class GeneralSpider(CrawlSpider):
    name = 'general_spider'
    
    def __init__(self, *a, **kw):
        super(GeneralSpider, self).__init__(*a, **kw)
        self.allowed_domains = ['bbc.com', 'www.bbc.com', 'bbcearth.com', 'www.bbcearth.com']
        # User requested specific sections
        sections = ['News', 'Sport', 'Business', 'Technology', 'Health', 'Culture', 'Arts', 'Travel', 'Earth']
        self.start_urls = [f'https://www.bbc.com/{s.lower()}' for s in sections]

    # Rule to follow links ONLY within the specified sections
    rules = (
        Rule(
            LinkExtractor(
                allow=[
                    r'(?i)/news.*',
                    r'(?i)/sport.*',
                    r'(?i)/business.*',
                    r'(?i)/technology.*',
                    r'(?i)/health.*',
                    r'(?i)/culture.*',
                    r'(?i)/arts.*',
                    r'(?i)/travel.*',
                    r'(?i)/earth.*'
                ],
                deny_domains=['facebook.com', 'twitter.com', 'instagram.com']
            ), 
            callback='parse_item', 
            follow=True
        ),
    )

    def parse_item(self, response):
        self.logger.info(f"Parsing item: {response.url}")
        if not hasattr(response, 'text'):
            self.logger.warning(f"Response has no text: {response.url}")
            return None

        return {
            'url': response.url,
            'title': response.css('title::text').get(),
            'image_url': response.css('meta[property="og:image"]::attr(content)').get(),
            'raw_html': response.text,
        }
