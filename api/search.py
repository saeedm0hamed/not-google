from db.supabase_client import get_supabase
from indexer.preprocess import preprocess

def rank_search(query: str, k: int = 10):
    supabase = get_supabase()
    query_terms = preprocess(query)
    
    if not query_terms:
        return []

    # Join inverted_index with term_stats to get TF and IDF
    # We want to aggregate sum(tf * idf) per doc_id
    
    # Since supabase-py doesn't support complex joins/aggregations easily via the builder,
    # we can use a stored procedure (RPC) or do it in Python if the dataset is small.
    # For a project setting, fetching the terms and aggregating in Python is acceptable,
    # but a single SQL query is better.
    
    # Let's try to fetch all matching rows and aggregate
    response = supabase.table("inverted_index") \
        .select("doc_id, tf, term_stats(idf), documents(url, title)") \
        .in_("term", query_terms) \
        .execute()
    
    if not response.data:
        return []

    scores = {}
    doc_info = {}
    
    for row in response.data:
        doc_id = row['doc_id']
        tf = row['tf']
        idf = row['term_stats']['idf'] if row['term_stats'] else 0
        
        score = tf * idf
        scores[doc_id] = scores.get(doc_id, 0) + score
        
        if doc_id not in doc_info:
            doc_info[doc_id] = {
                "url": row['documents']['url'],
                "title": row['documents']['title']
            }
    
    # Sort by score descending
    sorted_results = sorted(scores.items(), key=lambda x: x[1], reverse=True)[:k]
    
    results = []
    for rank, (doc_id, score) in enumerate(sorted_results, 1):
        results.append({
            "rank": rank,
            "doc_id": doc_id,
            "url": doc_info[doc_id]["url"],
            "title": doc_info[doc_id]["title"],
            "score": round(score, 4)
        })
        
    return results

def wildcard_search(query: str, k: int = 10):
    supabase = get_supabase()
    
    # Map * to % and ? to _
    sql_pattern = query.replace('*', '%').replace('?', '_')
    
    # 1. Find matching terms in inverted_index using LIKE
    # This hits the GIN trigram index
    terms_response = supabase.table("inverted_index") \
        .select("term") \
        .like("term", sql_pattern) \
        .execute()
    
    matching_terms = list(set(t['term'] for t in terms_response.data))
    
    if not matching_terms:
        return []
        
    # 2. Perform regular ranking with these matching terms
    # We can reuse the logic from rank_search but with the explicit terms
    response = supabase.table("inverted_index") \
        .select("doc_id, tf, term_stats(idf), documents(url, title)") \
        .in_("term", matching_terms) \
        .execute()
    
    if not response.data:
        return []

    scores = {}
    doc_info = {}
    
    for row in response.data:
        doc_id = row['doc_id']
        tf = row['tf']
        idf = row['term_stats']['idf'] if row['term_stats'] else 0
        
        score = tf * idf
        scores[doc_id] = scores.get(doc_id, 0) + score
        
        if doc_id not in doc_info:
            doc_info[doc_id] = {
                "url": row['documents']['url'],
                "title": row['documents']['title']
            }
    
    sorted_results = sorted(scores.items(), key=lambda x: x[1], reverse=True)[:k]
    
    results = []
    for rank, (doc_id, score) in enumerate(sorted_results, 1):
        results.append({
            "rank": rank,
            "doc_id": doc_id,
            "url": doc_info[doc_id]["url"],
            "title": doc_info[doc_id]["title"],
            "score": round(score, 4)
        })
        
    return results
