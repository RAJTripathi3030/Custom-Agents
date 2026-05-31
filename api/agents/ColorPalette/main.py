import os
from pydantic import SecretStr
from langchain_core.messages import SystemMessage, HumanMessage
from langchain_groq import ChatGroq

sys_msg = SystemMessage(content="You are an expert UI/UX designer. Generate a curated, harmonious color palette with hex codes (primary, secondary, accent, neutral) based on the brand personality/mood. Explain the choices and how to use them.")

def run_agent(groq_api_key: str, input1: str, input2: str = ""):
    os.environ["GROQ_API_KEY"] = groq_api_key
    model = ChatGroq(model="llama-3.1-8b-instant", api_key=SecretStr(groq_api_key))
    
    user_content = f"""Brand Personality / Mood: {input1}"""
    
    message = HumanMessage(content=user_content)
    response = model.invoke([sys_msg, message])
    
    return response.content
