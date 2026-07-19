from langgraph.graph import StateGraph, END
from app.agents.state import AgentState
from app.agents.ingestion import ingestion_agent
from app.agents.classification import classification_agent
from app.agents.item_master import item_master_agent
from app.agents.allocation import allocation_agent
from app.agents.invoicing import invoicing_agent
from app.agents.bom_generation import bom_generation_agent
from app.agents.planning import planning_agent
from app.agents.work_order import work_order_agent
from app.agents.exception import exception_agent
import uuid
from datetime import datetime

# Initialize the state graph
graph = StateGraph(AgentState)

# Add all agent nodes
graph.add_node("ingestion", ingestion_agent)
graph.add_node("classification", classification_agent)
graph.add_node("item_master", item_master_agent)
graph.add_node("allocation", allocation_agent)
graph.add_node("invoicing", invoicing_agent)
graph.add_node("bom_generation", bom_generation_agent)
graph.add_node("planning", planning_agent)
graph.add_node("work_order", work_order_agent)
graph.add_node("exception", exception_agent)

# Define edges (linear sequence)
graph.add_edge("ingestion", "classification")
graph.add_edge("classification", "item_master")
graph.add_edge("item_master", "allocation")
graph.add_edge("allocation", "invoicing")
graph.add_edge("invoicing", "bom_generation")
graph.add_edge("bom_generation", "planning")
graph.add_edge("planning", "work_order")
graph.add_edge("work_order", "exception")
graph.add_edge("exception", END)

# Set entry point
graph.set_entry_point("ingestion")

# Compile graph
orchestrator = graph.compile()

async def run_pipeline(raw_orders: list = None, date_from=None, date_to=None):
    """
    Helper function to trigger the manufacturing pipeline.
    """
    initial_state = {
        "run_id": str(uuid.uuid4()),
        "planning_date": datetime.utcnow().date(),
        "date_from": date_from,
        "date_to": date_to,
        "raw_orders": raw_orders or [],
        "staged_order_ids": [],
        "classified_skus": [],
        "exceptions": []
    }
    
    # We use ainvoke for asynchronous execution
    final_state = await orchestrator.ainvoke(initial_state)
    return final_state
