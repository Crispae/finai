# Use a lightweight Python base image
FROM python:3.11-slim

# Set a working directory
WORKDIR /app

# Copy your requirements file to the container
COPY requirements.txt ./

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of your application's code
COPY ./ ./

# Expose the port FastAPI will run on (default 80 or 8000)
EXPOSE 8000

# Run uvicorn server on container startup
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

