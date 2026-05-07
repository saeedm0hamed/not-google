FROM python:3.11-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libssl-dev \
    libffi-dev \
    python3-dev \
    supervisor \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Set environment variables
ENV PYTHONPATH=.
ENV PYTHONUNBUFFERED=1

# Hugging Face Spaces and other free tiers often use port 7860
EXPOSE 7860

# Run supervisor to manage multiple processes (API + Worker)
CMD ["/usr/bin/supervisord", "-c", "/app/supervisord.conf"]
