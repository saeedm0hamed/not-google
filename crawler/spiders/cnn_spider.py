import os
import scrapy
from scrapy.spiders import CrawlSpider, Rule
from scrapy.linkextractors import LinkExtractor

class GeneralSpider(CrawlSpider):
    name = 'general_spider'
    
    def __init__(self, *a, **kw):
        super(GeneralSpider, self).__init__(*a, **kw)
        domain = os.getenv("TARGET_DOMAIN", "en.wikipedia.org")
        if not domain.startswith('http'):
            self.allowed_domains = [domain]
            self.start_urls = [f'https://{domain}/wiki/Main_Page']
        else:
            self.allowed_domains = [domain.split('//')[-1].split('/')[0]]
            self.start_urls = [domain]

    rules = (
        Rule(LinkExtractor(allow=r'/wiki/'), callback='parse_item', follow=True),
    )

    def parse_item(self, response):
        if not hasattr(response, 'text'):
            return None

        return {
            'url': response.url,
            'title': response.css('title::text').get(),
            'raw_html': response.text,
        }
