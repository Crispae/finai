from fastapi import FastAPI
from neo4j_graphrag.retrievers import VectorRetriever
from utils.neo4j import get_driver
from utils.graph_rag import get_embedder, get_llm
import os

from neo4j_graphrag.generation import RagTemplate
from neo4j_graphrag.generation.graphrag import GraphRAG
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict



app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

NEO4J_URI = os.environ.get("NEO4J_URI")
NEO4J_USER = os.environ.get("NEO4J_USER")
NEO4J_PASS = os.environ.get("NEO4J_PASS")
EMBEDDING_MODEL_TYPE = os.environ.get("EMBEDDING_MODEL_TYPE")
LLM_MODEL_TYPE = os.environ.get("LLM_MODEL_TYPE")

@app.get("/status")
async def get_status():
    """
    Returns a JSON object indicating the application's status.
    """
    return {
        "status": "ok",
        "message": "Service is running smoothly!",
        "version": "1.0.0"
    }


# 1. Define a Pydantic model for the incoming request
class QueryRequest(BaseModel):
    query: str

@app.post("/api/query")
async def get_query(query_request: QueryRequest):
    # 2. Initialize your Neo4j driver and the retriever
    driver = get_driver(NEO4J_URI, NEO4J_USER, NEO4J_PASS)
    vector_retriever = VectorRetriever(
        driver,
        index_name="text_embeddings",
        embedder=get_embedder(EMBEDDING_MODEL_TYPE),
        return_properties=["text"]
    )

    # 3. Get your LLM
    llm = get_llm(type=LLM_MODEL_TYPE)

    # 4. Create your RAG template
    rag_template = RagTemplate(
        template='''Answer the Question using the following Context. Only respond with information mentioned in the Context. Do not inject any speculative information not mentioned.

    # Question:
    {query_text}

    # Context:
    {context}

    # Answer:
    ''',
        expected_inputs=['query_text', 'context']
    )

    # 5. Create your GraphRAG object
    v_rag = GraphRAG(llm=llm, retriever=vector_retriever, prompt_template=rag_template)

    # 6. Extract the query from the request model and get the answer
    user_query = query_request.query
    print("Got user query: ", user_query)
    rag_response = v_rag.search(user_query, retriever_config={'top_k': 5})
    print("Got response to user query: ", rag_response.answer)
    # 7. Return the answer in JSON
    return {"response": rag_response.answer}