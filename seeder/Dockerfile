FROM python:3.11-slim

# Create and set the working directory
WORKDIR /app

# Copy requirements.txt into the image
COPY requirements.txt /app/

# Install Python dependencies with pip3.11
RUN pip3.11 install --no-cache-dir -r requirements.txt

# Copy your seeding script
COPY seed.py /app/
COPY data /app/data

# Run the seed script using Python 3.11
CMD ["python3.11", "seed.py"]
