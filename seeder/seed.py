import os
import time
from neo4j import GraphDatabase
from neo4j_graphrag.indexes import create_vector_index

from neo4j_graphrag.llm import OpenAILLM
from neo4j_graphrag.llm import MistralAILLM
from neo4j_graphrag.embeddings.openai import OpenAIEmbeddings
from neo4j_graphrag.embeddings.mistral import MistralAIEmbeddings

from neo4j_graphrag.experimental.components.text_splitters.fixed_size_splitter import FixedSizeSplitter
from neo4j_graphrag.experimental.pipeline.kg_builder import SimpleKGPipeline
import asyncio

print("Hi")
# Read environment variables
NEO4J_URI = os.environ.get("NEO4J_URI", "bolt://localhost:7687")
NEO4J_USER = os.environ.get("NEO4J_USER", "neo4j")
NEO4J_PASS = os.environ.get("NEO4J_PASS", "secret")

NEO4J_DATABASE_PORT_2 = os.environ.get("NEO4J_DATABASE_PORT_2")
NEO4J_URI = f"bolt://neo4j:{NEO4J_DATABASE_PORT_2}"
NEO4J_USERNAME = os.environ.get("NEO4J_USERNAME")
NEO4J_PASSWORD = os.environ.get("NEO4J_PASSWROD")
LLM_MODEL_TYPE = os.environ.get("LLM_MODEL_TYPE")
EMBEDDING_MODEL_TYPE = os.environ.get("EMBEDDING_MODEL_TYPE")
SEED = os.environ.get("SEED") == "true"


# In[3]:


ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
print("Root directory:", ROOT_DIR)
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

class Models:
    OPEN_AI = "OPEN_AI"
    MISTRAL_AI = "MISTRAL_AI"

def get_llm(type: str = Models.MISTRAL_AI, **params):
    llm = None
    if type == Models.MISTRAL_AI:
        llm = MistralAILLM(
            # mistral-large-latest
            model_name="mistral-large-latest",
        )
    else:
        model_params={
                "temperature": 0 # turning temperature down for more deterministic results
            }
        if params.get("OPENAI_RESPONSE_FORMAT") == "json":
            model_params["response_format"] = {"type": "json_object"}
        
        llm = OpenAILLM(
            model_name="gpt-4o",
            model_params=model_params
          
    )
    return llm   

def get_embedder(type: str = Models.MISTRAL_AI):
    embedder = None
    if type == Models.MISTRAL_AI:
        embedder = MistralAIEmbeddings()
    else:
        embedder = OpenAIEmbeddings()
    return embedder   



# Basic node labels used in your current domain (politics, etc.)
basic_node_labels = [
    "Person",
    "Position",
    "PoliticalParty",
    "Direction",
    "Value",
    "Goal",
    "Consequence"
]

node_labels = basic_node_labels

# define relationship types
rel_types = ["belongs_to", "had_role", "wanted_role", "has_direction", "has_value",
   "has_influence_to", "introduces_consequences"]


prompt_template = '''
You are a policical, financial, societal, geopolictical researcher tasks with extracting information from papers 
and structuring it in a property graph to inform further political, societal, geopolicitcal, financial and research Q&A.

Extract the entities (nodes) and specify their type from the following Input text.
Also extract the relationships between these nodes. the relationship direction goes from the start node to the end node. 


Return result as JSON using the following format:
{{"nodes": [ {{"id": "0", "label": "the type of entity", "properties": {{"name": "name of entity" }} }}],
  "relationships": [{{"type": "TYPE_OF_RELATIONSHIP", "start_node_id": "0", "end_node_id": "1", "properties": {{"details": "Description of the relationship"}} }}] }}

- Use only the information from the Input text. Do not add any additional information.  
- If the input text is empty, return empty Json. 
- Make sure to create as many nodes and relationships as needed to offer rich medical context for further research.
- An AI knowledge assistant must be able to read this graph and immediately understand the context to inform detailed research questions. 
- Multiple documents will be ingested from different sources and we are using this property graph to connect information, so make sure entity types are fairly general. 

Use only fhe following nodes and relationships (if provided):
{schema}

Assign a unique ID (string) to each node, and reuse it to define relationships.
Do respect the source and target node types for relationship and
the relationship direction.

Do not return any additional information other than the JSON in it.

Examples:
{examples}

Input text:

{text}
'''

async def build_kg_and_embed_documents():
    print("Get embedder with Model Type: ", EMBEDDING_MODEL_TYPE)
    #create text embedder
    embedder = get_embedder(type=EMBEDDING_MODEL_TYPE)

    print("Build KG Builder PDF.")
    kg_builder_pdf = SimpleKGPipeline(
    llm=get_llm(type=Models.OPEN_AI, OPENAI_RESPONSE_FORMAT = "json"),
    driver=driver,
    text_splitter=FixedSizeSplitter(chunk_size=500, chunk_overlap=100),
    embedder=embedder,
    entities=node_labels,
    relations=rel_types,
    prompt_template=prompt_template,
    from_pdf=True
    )

    pdf_file_paths = ['graph-dag-1.pdf']

    for path in pdf_file_paths:
        print(f"Processing : {path}")
        pdf_result = await kg_builder_pdf.run_async(file_path=os.path.join(ROOT_DIR, "data", path))
        print(f"Result: {pdf_result}")

    print("Create Vector Index for embeddings.")
    create_vector_index(driver, name="text_embeddings", label="Chunk",
                    embedding_property="embedding", dimensions=1536, similarity_fn="cosine")



if SEED:
    asyncio.run(build_kg_and_embed_documents())
else: 
    print("Skip seeding.")