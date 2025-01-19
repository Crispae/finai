from neo4j_graphrag.embeddings.openai import OpenAIEmbeddings
from neo4j_graphrag.embeddings.mistral import MistralAIEmbeddings
from neo4j_graphrag.llm import OpenAILLM
from neo4j_graphrag.llm import MistralAILLM
from .enums import Models


def get_embedder(type: str = Models.MISTRAL_AI):
    embedder = None
    if type == Models.MISTRAL_AI:
        embedder = MistralAIEmbeddings()
    else:
        embedder = OpenAIEmbeddings()
    return embedder   


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