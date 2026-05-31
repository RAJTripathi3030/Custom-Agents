import os
from pydantic import SecretStr
from langchain_core.messages import SystemMessage, HumanMessage
from langchain_groq import ChatGroq

sys_msg = SystemMessage(content="You are an API design expert. Generate a complete OpenAPI 3.0 specification in YAML format, including realistic mock response data, based on the described API.")

def run_agent(groq_api_key: str, input1: str, input2: str = ""):
    os.environ["GROQ_API_KEY"] = groq_api_key
    model = ChatGroq(model="llama-3.1-8b-instant", api_key=SecretStr(groq_api_key))
    
    user_content = f"""API Description: {input1}"""
    
    message = HumanMessage(content=user_content)
    response = model.invoke([sys_msg, message])
    
    return response.content
