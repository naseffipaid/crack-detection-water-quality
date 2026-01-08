# # Use Python 3.11 slim
# FROM python:3.11-slim

# # Set working directory inside container
# WORKDIR /app

# # Copy requirements first for caching
# COPY requirements.txt .

# # Upgrade pip and install dependencies
# RUN pip install --upgrade pip
# RUN pip install -r requirements.txt

# # Copy all backend files, including saved_models and app/
# COPY . .

# # Expose the port FastAPI will run on (Render uses $PORT)
# EXPOSE 10000

# # Run uvicorn with the correct path to main.py
# CMD uvicorn app.main:app --host 0.0.0.0 --port $PORT

# Use Python 3.11 slim
FROM python:3.11-slim

# Set working directory inside container
WORKDIR /app

# Copy requirements first for caching
COPY requirements.txt .

# Upgrade pip and install dependencies
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Copy all backend files (from your local backend/ folder to /app in container)
COPY . .

# Debug: Check if models are copied correctly
RUN echo "=== Checking directory structure ===" && \
    echo "Current directory: $(pwd)" && \
    echo "Listing root:" && ls -la && \
    echo "Listing /app:" && ls -la /app && \
    echo "Listing /app/app:" && ls -la /app/app && \
    echo "Listing /app/app/saved_models:" && ls -la /app/app/saved_models && \
    echo "=== Checking crack_classifier ===" && \
    if [ -d "/app/app/saved_models/crack_classifier" ]; then \
        echo "crack_classifier exists, contents:" && \
        ls -la /app/app/saved_models/crack_classifier/; \
    else \
        echo "crack_classifier NOT FOUND!"; \
    fi

# Expose the port FastAPI will run on
EXPOSE 10000

# IMPORTANT: For Render, use 8000 or let Render set the PORT
CMD uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-10000}