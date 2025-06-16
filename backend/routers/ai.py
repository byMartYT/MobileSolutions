from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, Dict, List
from ai.collector import start_skill_collection, continue_skill_collection, CollectorResponse, SkillData


class ChatMessage(BaseModel):
    message: str = Field(..., description="User message for skill information collection")


class ContinueCollectionRequest(BaseModel):
    current_data: Dict = Field(..., description="Currently collected skill data")
    message: str = Field(..., description="New user message")


class SkillCollectionSession(BaseModel):
    session_id: Optional[str] = Field(None, description="Session ID für Konversations-Tracking")
    current_data: Optional[Dict] = Field(None, description="Aktuelle Skill-Daten")
    message: str = Field(..., description="User message")


router = APIRouter()


@router.post("/collect-start", response_model=Dict)
async def start_collection(request: ChatMessage):
    """
    Startet den Informationssammlungsprozess für Skill-Entwicklung
    """
    try:
        response = start_skill_collection(request.message)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error starting collection: {str(e)}")


@router.post("/collect-continue", response_model=Dict)
async def continue_collection(request: ContinueCollectionRequest):
    """
    Setzt den Informationssammlungsprozess mit bereits vorhandenen Daten fort
    """
    try:
        response = continue_skill_collection(request.current_data, request.message)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error continuing collection: {str(e)}")


@router.post("/collect", response_model=Dict)
async def collect_skill_info(request: ChatMessage):
    """
    Universelle Route für Informationssammlung - startet automatisch oder setzt fort
    Basiert auf dem Kontext in der Nachricht
    """
    try:
        # Für Einfachheit starten wir immer neu - in einer echten App würden Sie 
        # Session-Management implementieren
        response = start_skill_collection(request.message)
        
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error collecting information: {str(e)}")


@router.post("/collect-session", response_model=Dict)
async def collect_with_session(request: SkillCollectionSession):
    """
    Intelligente Informationssammlung mit Session-Support
    - Erkennt automatisch ob neue Session oder Fortsetzung
    - Verwaltet den Sammlungsfortschritt
    """
    try:
        if request.current_data and any(request.current_data.values()):
            # Fortsetzung einer bestehenden Session
            response = continue_skill_collection(request.current_data, request.message)
        else:
            # Neue Session starten
            response = start_skill_collection(request.message)
        
        # Füge Session-Tracking hinzu
        if request.session_id:
            response["session_id"] = request.session_id

        print(f"Session response: {response}")

        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error in session collection: {str(e)}")


@router.post("/generate-skill", response_model=Dict)
async def generate_skill_plan(request: Dict):
    """
    Generiert einen SkillItem-Plan aus vollständigen Collector-Daten
    """
    try:
        from ai.generator import generate_skill_plan as generator_function
        response = generator_function(request)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating skill plan: {str(e)}")
