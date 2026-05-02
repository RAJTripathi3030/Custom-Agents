import os
from pathlib import Path

from dotenv import load_dotenv
from pydantic import SecretStr

from langgraph.graph import MessagesState, START, StateGraph
from langgraph.prebuilt import ToolNode, tools_condition
from langchain_core.messages import SystemMessage, HumanMessage
from langchain.tools import tool
from tavily import TavilyClient
from langchain_groq import ChatGroq

# Load API keys from .env in the project root
load_dotenv(Path(__file__).resolve().parent.parent / ".env")

os.environ["LANGSMITH_TRACING"] = "true"
os.environ["LANGSMITH_PROJECT"] = "web-scraper-agent"
"""
Defining the state of agent:
I use the MessagesState class provided by langgraph itself, it
automatically keeps appending the messages in the state.
"""

class AgentState(MessagesState):
    pass

"""
This tool scrapes the content of the URLs it is given.
"""
@tool 
def web_scraper_tool(urls: list[str]) -> str:
    """
    Scrapes the content of the URLs it is given.
    Args:
        urls: A list of URLs to scrape.
    Returns:
        The scraped content as a string.
    """
    API_KEY = os.environ.get("TAVILY_API_KEY")

    client = TavilyClient(API_KEY)

    response = client.extract(
        urls = urls,
        format = "text"
    )
    
    truncated_response = []
    for result in response.get("results", []):
        url = result.get("url", "")
        raw_content = result.get("raw_content", "")[:3000]
        truncated_response.append({"url": url, "raw_content": raw_content})
    return str(truncated_response)

tools = [web_scraper_tool]

sys_msg = SystemMessage(content="You are a helpful assistant that scrapes URLs and returns the full extracted content. Always return the complete scraped text, never just confirm that scraping was done. If the text is too long to display then display most of the content and mention that the full content is too long to display.")   

def run_agent(tavily_api_key: str, groq_api_key: str, scrape_url: str):
    os.environ["TAVILY_API_KEY"] = tavily_api_key
    os.environ["GROQ_API_KEY"] = groq_api_key
    
    model = ChatGroq(model="llama-3.1-8b-instant", api_key=SecretStr(groq_api_key))
    model_with_tool = model.bind_tools(tools)
    
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
    
    message = HumanMessage(content=f"Scrape this URL and return all the extracted content: {scrape_url}. And if the content is too long then just show the important parts while mentioning that the full content is too long to display.")
    graph_response = graph.invoke({"messages": [message]})
    
    return graph_response["messages"][-1].content