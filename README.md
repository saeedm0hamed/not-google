[!(./frontend/public/og.jpg)]

Not Google is a full-stack, retro-themed search engine inspired by the web of the late 1990s. It is a complete information retrieval system, featuring a web crawler, an asynchronous indexer, a search API, and a nostalgic frontend. The system is designed to crawl a target domain, process and index the content, and serve ranked search results, including support for wildcard queries.

## Architecture

The system is composed of several interconnected services orchestrated with Docker:

1.  **Crawler (`Scrapy`):** A web spider that crawls a specified domain (e.g., `en.wikipedia.org`). It extracts the raw HTML, title, and URL of each page.
2.  **Pipeline (`crawler/pipelines.py`):** The Scrapy pipeline processes each crawled item. It uses `BeautifulSoup` to extract plain text, `langdetect` to filter for English content, and then stores the page data in the `documents` table in a Supabase (PostgreSQL) database.
3.  **Task Queue (`Celery` & `Redis`):** Once a document is saved, its ID is pushed onto a Redis queue.
4.  **Indexer (`Celery Worker`):** A Celery worker consumes document IDs from the queue. For each document, it performs text preprocessing (tokenization, stemming, stop-word removal), calculates Term Frequency (TF), and builds an inverted index, storing the results in the `inverted_index` table. It also updates document frequencies and calculates Inverse Document Frequency (IDF) in the `term_stats` table.
5.  **API (`FastAPI`):** A Python backend that exposes endpoints for searching. When a query is received, it preprocesses the query terms, retrieves TF and IDF values from the database, calculates TF-IDF scores for relevant documents, and returns a ranked list of results. It supports both standard and wildcard searches.
6.  **Frontend (`Next.js`):** A React-based user interface styled with Tailwind CSS to emulate a late-90s web application. It interacts with the FastAPI backend to fetch and display search results with a retro aesthetic, complete with animations powered by Framer Motion.

## Features

-   **Web Crawling:** Customizable Scrapy spider to crawl specified domains.
-   **Text Processing:** Comprehensive preprocessing pipeline including case folding, punctuation removal, stop-word removal (NLTK), and Porter stemming.
-   **TF-IDF Indexing:** Asynchronous indexing using Celery workers to build an inverted index with Term Frequency (TF) and Inverse Document Frequency (IDF) statistics.
-   **Ranked Search:** FastAPI endpoint that ranks documents based on TF-IDF cosine similarity for a given query.
-   **Wildcard Search:** Support for wildcard characters (`*` and `?`) in search queries, accelerated by a `pg_trgm` index in PostgreSQL.
-   **Scalable Backend:** Utilizes Supabase (PostgreSQL) for robust data storage and Redis for message broking.
-   **Containerized:** Fully containerized with Docker and `docker-compose` for easy setup and deployment.
-   **Retro UI:** A nostalgic and fully interactive frontend built with Next.js and styled to look like a Windows 9x application.

## Technology Stack

-   **Backend:** Python, FastAPI, Scrapy, Celery, NLTK, PyStemmer
-   **Frontend:** Next.js, React, TypeScript, Tailwind CSS, Framer Motion
-   **Database:** Supabase (PostgreSQL)
-   **Infrastructure:** Docker, Docker Compose, Redis, Supervisor

## Local Development

### Prerequisites

-   Docker and Docker Compose
-   A Supabase project for the database.
-   A `.env` file in the root directory.

### Configuration

1.  Create a `.env` file in the project root. You can copy the example below.
2.  Add your Supabase project URL and an `anon` or `service_role` key.
3.  Specify the domain you wish to crawl.

```sh
# .env file

# Supabase Credentials
SUPABASE_URL="YOUR_SUPABASE_URL"
SUPABASE_KEY="YOUR_SUPABASE_KEY"

# Crawler Settings
TARGET_DOMAIN="en.wikipedia.org" # The domain for the crawler to target
MAX_PAGES=3000                   # Max number of pages to crawl

# Celery Configuration
CELERY_BROKER_URL="redis://redis:6379/0"
```

### Database Schema

Before running the application, you must set up your Supabase database schema. Execute the contents of `db/schema.sql` in the Supabase SQL Editor to create the necessary tables (`documents`, `inverted_index`, `term_stats`) and enable the `pg_trgm` extension for wildcard search support.

### Running the System

You can run the entire system using Docker Compose. This will build the container image and start the API, Celery worker, crawler, and Redis services.

```bash
docker-compose up --build
```

-   **`api` service:** The FastAPI server will be available at `http://localhost:8000`.
-   **`worker` service:** The Celery worker starts automatically and begins processing any documents queued by the crawler.
-   **`crawler` service:** The Scrapy spider starts crawling the `TARGET_DOMAIN`. It will stop automatically once it reaches `MAX_PAGES`.
-   **`redis` service:** The Redis message broker for Celery.

The frontend is a separate Next.js application located in the `frontend/` directory. Refer to `frontend/README.md` for instructions on running it.

## API Endpoints

The FastAPI server provides the following endpoints:

| Method | Endpoint                    | Description                                                                          |
| ------ | --------------------------- | ------------------------------------------------------------------------------------ |
| `GET`  | `/search`                   | Performs a ranked search. <br/>**Params:** `q` (query), `k` (number of results, default 10). |
| `GET`  | `/search/wildcard`          | Performs a wildcard search. <br/>**Params:** `q` (query with `*` or `?`), `k` (limit).     |
| `GET`  | `/stats`                    | Returns statistics about the indexed data (total documents, terms, etc.).            |
| `GET`  | `/document/{doc_id}`        | Retrieves the details of a specific document by its ID.                              |
| `POST` | `/crawl`                    | Placeholder endpoint to demonstrate where a crawl trigger could be implemented.        |

## Deployment

The `Dockerfile` is configured for deployment on platforms like Hugging Face Spaces. It uses `supervisord` to manage multiple processes (the Uvicorn API server and the Celery worker) within a single container. This allows the API to be live while also enabling background indexing tasks to run concurrently.