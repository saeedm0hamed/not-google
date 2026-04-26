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
    
    # 1. Fetch inverted index entries and document info
    # inverted_index has a FK to documents, so this join works
    response = supabase.table("inverted_index") \
        .select("term, doc_id, tf, documents(url, title)") \
        .in_("term", query_terms) \
        .execute()
    
    if not response.data:
        return []

    # 2. Fetch IDF values from term_stats separately to avoid join errors
    stats_response = supabase.table("term_stats") \
        .select("term, idf") \
        .in_("term", query_terms) \
        .execute()
    
    term_to_idf = {row['term']: row['idf'] for row in stats_response.data}

    scores = {}
    doc_info = {}
    
    for row in response.data:
        doc_id = row['doc_id']
        term = row['term']
        tf = row['tf']
        idf = term_to_idf.get(term, 0)
        
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
    # Fetch inverted index entries and document info
    response = supabase.table("inverted_index") \
        .select("term, doc_id, tf, documents(url, title)") \
        .in_("term", matching_terms) \
        .execute()
    
    if not response.data:
        return []

    # 3. Fetch IDF values from term_stats separately
    stats_response = supabase.table("term_stats") \
        .select("term, idf") \
        .in_("term", matching_terms) \
        .execute()
    
    term_to_idf = {row['term']: row['idf'] for row in stats_response.data}

    scores = {}
    doc_info = {}
    
    for row in response.data:
        doc_id = row['doc_id']
        term = row['term']
        tf = row['tf']
        idf = term_to_idf.get(term, 0)
        
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
