FROM python:3.11-slim

WORKDIR /app

# Install neo4j-driver for Python, or any dependencies you need
RUN pip install neo4j==5.5.0

# Copy your seeding script
COPY seed.py .

CMD ["python", "seed.py"]
