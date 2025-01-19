import time 
from neo4j import GraphDatabase

def get_driver(neo4j_uri, neo4j_user, neo4j_pass):
    # Retry logic to wait for Neo4j to be ready
    retries = 0
    while True:
        try:
            driver = GraphDatabase.driver(neo4j_uri, auth=(neo4j_user, neo4j_pass))
            # Attempt a test connection
            with driver.session() as test_session:
                test_session.run("RETURN 1")
            print("Connection is established.")
            return driver
        except Exception as e:
            print(f"Received error: {e}")
            retries += 1
            pause = 2 * 2 ** retries  # exponential backoff
            print(f"Trying again in {pause} seconds...")
            time.sleep(pause)