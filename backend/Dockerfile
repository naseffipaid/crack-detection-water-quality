# Use Python 3.11 slim
FROM python:3.11-slim

# Set working directory inside container
WORKDIR /app

# Copy requirements first for caching
COPY requirements.txt .

# Upgrade pip and install dependencies
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Copy all backend files, including saved_models and app/
COPY . .

# Expose the port FastAPI will run on (Render uses $PORT)
EXPOSE 10000

# Run uvicorn with the correct path to main.py
CMD uvicorn app.app.main:app --host 0.0.0.0 --port $PORT
