import os
import time
from neo4j import GraphDatabase

# Read environment variables
NEO4J_URI = os.environ.get("NEO4J_URI", "bolt://localhost:7687")
NEO4J_USER = os.environ.get("NEO4J_USER", "neo4j")
NEO4J_PASS = os.environ.get("NEO4J_PASS", "secret")

print("Connecting to:", NEO4J_URI)
print("Using credentials user:", NEO4J_USER, "password:", NEO4J_PASS)

# Retry logic to wait for Neo4j to be ready
retries = 0
while True:
    try:
        driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASS))
        # Attempt a test connection
        with driver.session() as test_session:
            test_session.run("RETURN 1")
        print("Connection is established.")
        break
    except Exception as e:
        print(f"Received error: {e}")
        retries += 1
        pause = 2 * 2 ** retries  # exponential backoff
        print(f"Trying again in {pause} seconds...")
        time.sleep(pause)

# List of sample cypher commands
cypher_commands = [

]

# Run the seeding commands
while True:
    try:
        with driver.session() as session:
            for command in cypher_commands:
                session.run(command)
        print("Seeding complete!")
        break
    except Exception as e:
        print(f"Received error: {e}")
        retries += 1
        pause = 2 * 2 ** retries
        print(f"Trying again in {pause} seconds...")
        time.sleep(pause)
