from pydantic import BaseModel
from typing import List, Optional

class SearchResult(BaseModel):
    rank: int
    doc_id: int
    url: str
    title: Optional[str]
    image_url: Optional[str]
    score: float

class DDGSResult(BaseModel):
    title: str
    href: str
    body: str

class DDGSImage(BaseModel):
    title: str
    image: str
    thumbnail: str
    url: str

class SearchResponse(BaseModel):
    query: str
    total_results: int
    results: List[SearchResult]
    ddgs_results: Optional[List[DDGSResult]] = []
    ddgs_images: Optional[List[DDGSImage]] = []

class CrawlRequest(BaseModel):
    url: Optional[str] = None

class StatsResponse(BaseModel):
    total_docs: int
    total_terms: int
    index_size: int

class DocumentResponse(BaseModel):
    id: int
    url: str
    title: Optional[str]
    image_url: Optional[str]
    plain_text: str
    crawled_at: str
