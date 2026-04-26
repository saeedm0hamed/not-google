import math
from db.supabase_client import get_supabase
from indexer.preprocess import preprocess, get_token_positions

def build_index_for_doc(doc_id: int):
    supabase = get_supabase()
    
    # 1. Fetch document
    response = supabase.table("documents").select("*").eq("id", doc_id).single().execute()
    if not response.data:
        return {"status": "error", "message": f"Document {doc_id} not found"}
    
    doc = response.data
    text = doc.get("plain_text", "")
    
    # 2. Preprocess
    tokens = preprocess(text)
    if not tokens:
        # Mark as indexed anyway to avoid re-processing
        supabase.table("documents").update({"indexed": True}).eq("id", doc_id).execute()
        return {"status": "success", "message": f"Document {doc_id} was empty after preprocessing"}
    
    total_tokens = len(tokens)
    token_positions = get_token_positions(tokens)
    
    # 3. Compute stats and upsert into inverted_index
    inverted_index_data = []
    affected_terms = list(token_positions.keys())
    
    for term, positions in token_positions.items():
        frequency = len(positions)
        tf = frequency / total_tokens
        
        inverted_index_data.append({
            "term": term,
            "doc_id": doc_id,
            "frequency": frequency,
            "positions": positions,
            "tf": tf
        })
    
    # Batch upsert into inverted_index
    # We use upsert on (term, doc_id) conflict
    supabase.table("inverted_index").upsert(inverted_index_data, on_conflict="term,doc_id").execute()
    
    # 4. Update term_stats (IDF)
    update_term_stats(affected_terms)
    
    # 5. Mark document as indexed
    supabase.table("documents").update({"indexed": True}).eq("id", doc_id).execute()
    
    return {"status": "success", "message": f"Indexed document {doc_id}"}

def update_term_stats(terms: list[str]):
    supabase = get_supabase()
    
    # Get total document count (N)
    n_response = supabase.table("documents").select("id", count="exact").execute()
    N = n_response.count if n_response.count else 1
    
    for term in terms:
        # Get document frequency (df) for this term
        df_response = supabase.table("inverted_index").select("doc_id", count="exact").eq("term", term).execute()
        df = df_response.count if df_response.count else 0
        
        if df > 0:
            # IDF = log(N / (df + 1)) - using +1 to avoid division by zero or log(0)
            # Actually PRD says log(N / df(t) + 1) or log(N / (df+1))? 
            # PRD: IDF(t) = log(N / df(t) + 1)
            idf = math.log(N / (df + 1) + 1) # Adding 1 to N/df as per PRD's formula or common variant
            
            supabase.table("term_stats").upsert({
                "term": term,
                "doc_freq": df,
                "idf": idf
            }, on_conflict="term").execute()
