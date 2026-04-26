from pydantic import BaseModel
from typing import List, Optional

class SearchResult(BaseModel):
    rank: int
    doc_id: int
    url: str
    title: Optional[str]
    score: float

class SearchResponse(BaseModel):
    query: str
    total_results: int
    results: List[SearchResult]

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
    plain_text: str
    crawled_at: str
