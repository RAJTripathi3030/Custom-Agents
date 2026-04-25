import os
from pathlib import Path

import httpx
from dotenv import load_dotenv
from langchain_core.messages import AIMessage, HumanMessage, SystemMessage, ToolMessage
from langchain_core.runnables.config import RunnableConfig
from langchain_groq import ChatGroq
from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import START, MessagesState, StateGraph
from langgraph.prebuilt import ToolNode
from langgraph.types import Command, interrupt
from pydantic import SecretStr

# API Key load
load_dotenv(Path(__file__).resolve().parent.parent / ".env")

class AgentState(MessagesState):
    asked_for_download: bool

# ---TOOLS-------------------------------------------------------------------

def fetch_iso(distro_name: str) -> str:
    """Linux distro ka ISO download link nikalne ke liye use karo."""
    response = httpx.get("https://raw.githubusercontent.com/RAJTripathi3030/distro-db/master/db.json")
    data = response.json()
    distro = data.get(distro_name.lower())
    if not distro:
        return f"{distro_name}'s ISO link is not available."
    urls = distro["urls"]
    return "\n".join([f"{i + 1}. {url}" for i, url in enumerate(urls)])

def download_iso(download_url: str) -> str:
    """Direct HTTP URL se ISO file download karne ke liye."""
    filename = download_url.split("/")[-1] or "download.iso"
    print(f"\nStarting download: {filename}")
    with httpx.stream("GET", download_url, follow_redirects=True) as response:
        total = int(response.headers.get("content-length", 0))
        downloaded = 0
        with open(filename, "wb") as f:
            for chunk in response.iter_bytes(chunk_size=8192):
                f.write(chunk)
                downloaded += len(chunk)
                if total:
                    pct = downloaded / total * 100
                    print(f"\rProgress: {pct:.1f}%", end="", flush=True)
    return f"Download complete! Saved as {filename}"

tools = [fetch_iso, download_iso]

# ---MODEL-------------------------------------------------------------------

model = ChatGroq(model="llama-3.3-70b-versatile", api_key=SecretStr(os.environ["GROQ_API_KEY"]))
model_with_tool = model.bind_tools(tools)
sys_msg = SystemMessage(
    content="You are a helpful assistant that finds Linux ISO download links."
            "You first ask the user that which distro they want, then you go fetch it's links and display those links."
            "After that you make an interrupt and ask the user whether they want to download it here or just be left alone with the links."
            "Also if the user enters some input that does not provide any clue to any Linux Distributions then simply do not move forward and tell them to tell clearly and also don't ask for downloading."
)

# ---NODES-------------------------------------------------------------------

def assistant(state: AgentState):
    response = model_with_tool.invoke([sys_msg] + state["messages"])
    return {"messages": [response]}

def ask_user_node(state: AgentState):
    user_choice = interrupt("Do you want to download automatically? (yes/no): ")
    if user_choice.strip().lower() in ("yes", "y"):
        msg = HumanMessage(content="Yes, please download it for me.")
    else:
        msg = HumanMessage(content="No, I will do it manually. Goodbye!")
    return {"messages": [msg], "asked_for_download": True}

# ---STRICT ROUTING-----------------------------------------------------------

def route_after_assistant(state: AgentState):
    messages = state["messages"]
    last_message = messages[-1]
    
    tool_calls = getattr(last_message, "tool_calls", [])
    
    if tool_calls:
        # Check if LLM is trying to download
        is_download_call = any(tc["name"] == "download_iso" for tc in tool_calls)
        
        # Agar download call hai aur abhi tak pucha nahi, toh interrupt pe bhejo
        if is_download_call and not state.get("asked_for_download"):
            return "ask_user"
        
        return "tools"

    # Agar fetch_iso ka output aa gaya hai aur abhi tak pucha nahi hai
    has_links = any(isinstance(m, ToolMessage) and m.name == "fetch_iso" for m in messages)
    if has_links and not state.get("asked_for_download"):
        return "ask_user"
    
    return "__end__"

# ---GRAPH---------------------------------------------------------------------

builder = StateGraph(AgentState)
builder.add_node("assistant", assistant)
builder.add_node("tools", ToolNode(tools))
builder.add_node("ask_user", ask_user_node)

builder.add_edge(START, "assistant")
builder.add_conditional_edges("assistant", route_after_assistant)
builder.add_edge("tools", "assistant")
builder.add_edge("ask_user", "assistant")

checkpointer = MemorySaver()
graph = builder.compile(checkpointer=checkpointer)

# ---RUNNER-------------------------------------------------------------------

if __name__ == "__main__":
    distro = input("Tell me which distro ISO you need: ")
    config: RunnableConfig = {"configurable": {"thread_id": "iso_session_1"}}

    # Initial invoke - initial state pass karna zaroori hai
    result = graph.invoke(
        {"messages": [HumanMessage(content=distro)], "asked_for_download": False}, 
        config=config
    )
    
    # Assistant ki baatein print karo
    print(f"\nAssistant: {result['messages'][-1].content}\n")

    # Agar graph interrupt par ruka hai (i.e. links mil gaye hain)
    user_choice = input("Do you want to download automatically? (yes/no): ")
    
    # Resume with user's choice
    final_result = graph.invoke(Command(resume=user_choice), config=config)
    print(f"\nAssistant: {final_result['messages'][-1].content}")