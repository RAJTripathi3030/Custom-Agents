import os
import httpx
from pathlib import Path

from dotenv import load_dotenv
from pydantic import SecretStr

from langgraph.graph import MessagesState, START, StateGraph
from langgraph.prebuilt import ToolNode, tools_condition
from langchain_core.messages import HumanMessage, SystemMessage
from langchain.tools import tool
from langchain_groq import ChatGroq

# Load API keys from .env in the project root
load_dotenv(Path(__file__).resolve().parent.parent / ".env")

os.environ["LANGSMITH_TRACING"] = "true"
os.environ["LANGSMITH_PROJECT"] = "ISO Agent"



class AgentState(MessagesState):
    """
        This function sets the session state for the LLM.
        Input is MessageState object.
        It outputs nothing.
    """
    pass
    
@tool
def fetch_iso(distro_name: str)->str :
    """
        Use this tool to get the ISO download URL for a Linux distribution.
        Input should be just the distro name (e.g. 'ubuntu', 'arch', 'fedora').
        Returns the direct download link as a string.
    """
    response = httpx.get("https://raw.githubusercontent.com/RAJTripathi3030/distro-db/master/db.json")
    # print(response.status_code)
    # print(response.text[:200])
    data = response.json()
    
    distro = data.get(distro_name.lower())
    if not distro:
        return(f"{distro_name}'s ISO link is not available.")
    
    urls = distro["urls"]
    if len(urls) == 1:
        return urls[0]
    
    return "\n".join([f"{i+1}. {url}" for i, url in enumerate(urls)])
    
tools = [fetch_iso]

model = ChatGroq(
    model="llama-3.3-70b-versatile", 
    api_key=SecretStr(os.environ["GROQ_API_KEY"])
)
model_with_tool = model.bind_tools(tools)

sys_msg = SystemMessage(content = "You are a helpful assistant that downloads the Linux Distribution which the user requires.")

def assistant(state: AgentState):
    response = model_with_tool.invoke([sys_msg] + state["messages"])
    return {"messages" : [response]}
    
builder = StateGraph(AgentState)

builder.add_node("assistant", assistant)
builder.add_node("tools", ToolNode(tools))

builder.add_edge(START, "assistant")
builder.add_conditional_edges("assistant", tools_condition)
builder.add_edge("tools", "assistant")

graph = builder.compile()

message = HumanMessage(content="Get me the ISO Download link of Kubuntu")
graph_response = graph.invoke({"messages": [message]})
print(graph_response["messages"][-1].content)