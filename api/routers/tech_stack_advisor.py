from fastapi import APIRouter
from pydantic import BaseModel
from api.core.security import validate_api_key
from api.core.responses import success_response, error_response
from api.agents.TechStackAdvisor.main import run_agent

router = APIRouter()

class TechStackAdvisorRequest(BaseModel):
    groq_api_key: str
    input1: str
    input2: str = ""

@router.post("/agents/tech-stack-advisor/run")
async def run_tech_stack_advisor(body: TechStackAdvisorRequest):
    groq_key = validate_api_key(body.groq_api_key, "Groq API key")
    
    try:
        result = run_agent(
            groq_api_key=groq_key,
            input1=body.input1,
            input2=body.input2,
        )
        return success_response({"result": result})

    except Exception as e:
        print(f"[TechStackAdvisor ERROR] {e}")
        from fastapi.responses import JSONResponse
        return JSONResponse(
            status_code=422,
            content=error_response(
                title="Agent Error",
                detail=str(e),
                status=422,
            ),
        )
