import os
from pydantic import SecretStr
from langchain_core.messages import SystemMessage, HumanMessage
from langchain_groq import ChatGroq

sys_msg = SystemMessage(content="You are an expert technical recruiter and resume writer. Analyze the provided resume and optional job description. Identify gaps, rewrite weak bullet points using action verbs and metrics, and provide a tailored improved version.")

def run_agent(groq_api_key: str, input1: str, input2: str = ""):
    os.environ["GROQ_API_KEY"] = groq_api_key
    model = ChatGroq(model="llama-3.1-8b-instant", api_key=SecretStr(groq_api_key))
    
    user_content = f"""Resume: {input1}
Job Description: {input2}"""
    
    message = HumanMessage(content=user_content)
    response = model.invoke([sys_msg, message])
    
    return response.content
