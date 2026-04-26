import os
from celery import Celery
from dotenv import load_dotenv

load_dotenv()

broker_url = os.getenv("CELERY_BROKER_URL", "redis://localhost:6379/0")
celery_app = Celery("indexer", broker=broker_url, backend=broker_url)

@celery_app.task(name="indexer.tasks.index_document")
def index_document(doc_id: int):
    # This will be implemented in the indexer module
    from indexer.index_builder import build_index_for_doc
    return build_index_for_doc(doc_id)
