from fastapi import APIRouter, HTTPException
from datetime import datetime
from models.ai_models import (
    MessageRequest, 
    ConversationResponse, 
    SkillGenerationRequest,
    SkillGenerationResponse,
    ConversationState,
    Message
)
from ai.agent import skill_agent
from ai.conversation import conversation_manager

router = APIRouter()

@router.post("/start-conversation", response_model=ConversationResponse)
async def start_conversation():
    """Start a new AI skill generation conversation"""
    try:
        # Create new conversation
        conversation = conversation_manager.create_conversation()
        
        # Generate initial greeting
        initial_message = """Hallo! 👋 Ich bin dein AI Skill-Generator! 

Ich helfe dir dabei, einen personalisierten Lernplan zu erstellen. Lass uns gemeinsam herausfinden, welchen Skill du lernen möchtest und wie wir das am besten angehen.

Welchen Skill möchtest du gerne lernen? Das kann alles sein - von Musik über Sport bis hin zu beruflichen Fähigkeiten! 🚀"""
        
        # Add initial message to conversation
        ai_msg = Message(
            role="assistant",
            content=initial_message,
            timestamp=datetime.now()
        )
        conversation_manager.add_message(conversation.id, ai_msg)
        
        return ConversationResponse(
            conversation_id=conversation.id,
            message=initial_message,
            state=conversation.state,
            is_complete=False,
            progress_percentage=conversation_manager.get_progress_percentage(conversation.state)
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to start conversation: {str(e)}")

@router.post("/send-message", response_model=ConversationResponse)
async def send_message(request: MessageRequest):
    """Send a message in the conversation"""
    try:
        # Get conversation
        conversation = conversation_manager.get_conversation(request.conversation_id)
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")
        
        if conversation.is_complete:
            raise HTTPException(status_code=400, detail="Conversation is already complete")
        
        # Process message with AI agent
        ai_response, should_advance = skill_agent.process_message(
            request.conversation_id, 
            request.message
        )
        
        # Advance state if needed
        if should_advance:
            conversation_manager.advance_state(request.conversation_id)
            conversation = conversation_manager.get_conversation(request.conversation_id)
        
        # Check if ready for generation
        next_question = None
        if conversation_manager.is_ready_for_generation(request.conversation_id):
            if conversation.state == "collecting_preferences":
                # This was the last question, mark as ready for generation
                conversation_manager.advance_state(request.conversation_id)
                conversation = conversation_manager.get_conversation(request.conversation_id)
        
        return ConversationResponse(
            conversation_id=conversation.id,
            message=ai_response,
            state=conversation.state,
            is_complete=conversation.is_complete,
            next_question=next_question,
            progress_percentage=conversation_manager.get_progress_percentage(conversation.state)
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process message: {str(e)}")

@router.post("/generate-skill", response_model=SkillGenerationResponse)
async def generate_skill(request: SkillGenerationRequest):
    """Generate the final skill based on conversation"""
    try:
        # Check if conversation exists and is ready
        conversation = conversation_manager.get_conversation(request.conversation_id)
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")
        
        if not conversation_manager.is_ready_for_generation(request.conversation_id):
            raise HTTPException(status_code=400, detail="Conversation is not ready for skill generation")
        
        # Generate skill
        generated_skill = skill_agent.generate_skill(request.conversation_id)
        if not generated_skill:
            raise HTTPException(status_code=500, detail="Failed to generate skill")
        
        # Mark conversation as complete
        conversation_manager.update_conversation(
            request.conversation_id,
            state="complete",
            is_complete=True
        )
        
        return SkillGenerationResponse(
            success=True,
            skill=generated_skill,
            error=None
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate skill: {str(e)}")

@router.get("/conversation/{conversation_id}", response_model=ConversationState)
async def get_conversation(conversation_id: str):
    """Get conversation state"""
    try:
        conversation = conversation_manager.get_conversation(conversation_id)
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")
        
        return conversation
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get conversation: {str(e)}")

@router.delete("/conversation/{conversation_id}")
async def delete_conversation(conversation_id: str):
    """Delete a conversation"""
    try:
        conversation = conversation_manager.get_conversation(conversation_id)
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")
        
        # Remove from manager
        del conversation_manager.conversations[conversation_id]
        
        return {"message": "Conversation deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete conversation: {str(e)}")

@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "AI Skill Generator",
        "active_conversations": len(conversation_manager.conversations)
    }
