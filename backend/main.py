from fastapi import FastAPI
from neo4j_graphrag.retrievers import VectorRetriever
from utils.neo4j import get_driver
from utils.graph_rag import get_embedder, get_llm
from sse_starlette.sse import EventSourceResponse

import os

from neo4j_graphrag.generation import RagTemplate
from neo4j_graphrag.generation.graphrag import GraphRAG
from pydantic import BaseModel
from typing import Dict


app = FastAPI()

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
        embedder=get_embedder(LLM_MODEL_TYPE),
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
    

     # 3. Build a generator that yields tokens or partial results
    async def event_generator():
        """
        This function yields token-by-token (or chunk-by-chunk) partial responses.
        The exact mechanics depend on whether your LLM (or v_rag) supports a streaming API.
        """
        # You might have a method like `v_rag.stream_search` or something similar. 
        # If not, you’ll need to implement your own streaming approach in the LLM wrapper.
        #
        # Below is a pseudo-code snippet. Adjust it to match your actual streaming method.
        
        # 1. Retrieve relevant docs
        retrieved_docs = vector_retriever.get_relevant_documents(user_query, top_k=5)

        # 2. Stream from LLM
        #    Example of a "pseudo" streaming method that returns chunks/tokens:
        async for partial_answer in llm.stream_complete(
            prompt=rag_template.format(
                query_text=user_query,
                context="\n".join([doc["text"] for doc in retrieved_docs])
            )
        ):
            # Each chunk is appended/concatenated on the client side
            yield partial_answer

    print("Starting to stream response for user query...")

    # 4. Return an SSE event stream
    #
    #    By default, `sse-starlette` will take any dict or string you yield and 
    #    transform it into a proper SSE event (`event: message\ndata: ...\n\n`).
    #
    #    If you yield raw strings, it sets `data: your_string`.
    #    If you yield dictionaries, you can set `event`, `retry`, etc. as well.
    #
    #    For instance, to yield SSE JSON events, do: yield {"data": json.dumps(...)}
    return EventSourceResponse(event_generator())