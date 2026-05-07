from db.supabase_client import get_supabase
from indexer.preprocess import preprocess
from ddgs import DDGS

def fetch_ddgs_results(query: str, max_results: int = 5):
    """Fetch results and images from DuckDuckGo using ddgs."""
    results = []
    images = []
    
    # Handle wildcard expansion for DDGS
    ddg_query = query
    if '*' in query or '?' in query:
        try:
            from db.supabase_client import get_supabase
            supabase = get_supabase()
            sql_pattern = query.replace('*', '%').replace('?', '_')
            terms_resp = supabase.table("inverted_index") \
                .select("term") \
                .like("term", sql_pattern) \
                .limit(5) \
                .execute()
            
            matching_terms = list(set(t['term'] for t in terms_resp.data))
            if matching_terms:
                # Use OR to search for matching terms
                ddg_query = " OR ".join(matching_terms)
        except Exception as e:
            print(f"Error expanding wildcard for DDGS: {e}")

    try:
        with DDGS() as ddgs:
            # Fetch text results
            ddgs_gen = ddgs.text(ddg_query, max_results=max_results, safesearch='on')
            results = list(ddgs_gen)
            
            # Fetch image results
            ddgs_images_gen = ddgs.images(ddg_query, max_results=max_results, safesearch='on')
            images = list(ddgs_images_gen)
    except Exception as e:
        print(f"Error fetching DDGS results: {e}")
        
    return results, images

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
        .select("term, doc_id, tf, documents(url, title, image_url)") \
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
            # Handle both dict and list response from Supabase join
            docs = row.get('documents')
            if isinstance(docs, list):
                docs = docs[0] if docs else None
            
            if docs:
                doc_info[doc_id] = {
                    "url": docs.get('url', ''),
                    "title": docs.get('title', 'Untitled'),
                    "image_url": docs.get('image_url')
                }
            else:
                doc_info[doc_id] = {
                    "url": "#",
                    "title": "Missing Document Info",
                    "image_url": None
                }
    
    # Sort by score descending
    sorted_results = sorted(scores.items(), key=lambda x: x[1], reverse=True)[:k*2] # Fetch more to allow for filtering
    
    results = []
    for rank, (doc_id, score) in enumerate(sorted_results, 1):
        if score < 0.01:
            continue
        results.append({
            "rank": rank,
            "doc_id": doc_id,
            "url": doc_info[doc_id]["url"],
            "title": doc_info[doc_id]["title"],
            "image_url": doc_info[doc_id]["image_url"],
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
        .select("term, doc_id, tf, documents(url, title, image_url)") \
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
            # Handle both dict and list response from Supabase join
            docs = row.get('documents')
            if isinstance(docs, list):
                docs = docs[0] if docs else None
                
            if docs:
                doc_info[doc_id] = {
                    "url": docs.get('url', ''),
                    "title": docs.get('title', 'Untitled'),
                    "image_url": docs.get('image_url')
                }
            else:
                doc_info[doc_id] = {
                    "url": "#",
                    "title": "Missing Document Info",
                    "image_url": None
                }
    
    sorted_results = sorted(scores.items(), key=lambda x: x[1], reverse=True)[:k*2] # Fetch more to allow for filtering
    
    results = []
    for rank, (doc_id, score) in enumerate(sorted_results, 1):
        if score < 0.01:
            continue
        results.append({
            "rank": rank,
            "doc_id": doc_id,
            "url": doc_info[doc_id]["url"],
            "title": doc_info[doc_id]["title"],
            "image_url": doc_info[doc_id]["image_url"],
            "score": round(score, 4)
        })
        
    return results
