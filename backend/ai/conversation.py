import uuid
from datetime import datetime
from typing import Dict, Optional
from models.ai_models import ConversationState, ConversationContext, Message

class ConversationManager:
    """Manages conversation state and flow"""
    
    def __init__(self):
        self.conversations: Dict[str, ConversationState] = {}
    
    def create_conversation(self) -> ConversationState:
        """Create a new conversation"""
        conversation_id = str(uuid.uuid4())
        now = datetime.now()
        
        conversation = ConversationState(
            id=conversation_id,
            state="collecting_domain",
            context=ConversationContext(),
            messages=[],
            is_complete=False,
            created_at=now,
            updated_at=now
        )
        
        self.conversations[conversation_id] = conversation
        return conversation
    
    def get_conversation(self, conversation_id: str) -> Optional[ConversationState]:
        """Get conversation by ID"""
        return self.conversations.get(conversation_id)
    
    def update_conversation(self, conversation_id: str, **updates) -> Optional[ConversationState]:
        """Update conversation state"""
        conversation = self.conversations.get(conversation_id)
        if not conversation:
            return None
        
        for key, value in updates.items():
            if hasattr(conversation, key):
                setattr(conversation, key, value)
        
        conversation.updated_at = datetime.now()
        return conversation
    
    def add_message(self, conversation_id: str, message: Message) -> bool:
        """Add message to conversation"""
        conversation = self.conversations.get(conversation_id)
        if not conversation:
            return False
        
        conversation.messages.append(message)
        conversation.updated_at = datetime.now()
        return True
    
    def advance_state(self, conversation_id: str) -> bool:
        """Advance conversation to next state"""
        conversation = self.conversations.get(conversation_id)
        if not conversation:
            return False
        
        state_transitions = {
            "collecting_domain": "collecting_goals",
            "collecting_goals": "collecting_difficulty", 
            "collecting_difficulty": "collecting_timeframe",
            "collecting_timeframe": "collecting_preferences",
            "collecting_preferences": "generating",
            "generating": "complete"
        }
        
        next_state = state_transitions.get(conversation.state)
        if next_state:
            conversation.state = next_state
            conversation.updated_at = datetime.now()
            
            if next_state == "complete":
                conversation.is_complete = True
                
            return True
        return False
    
    def get_progress_percentage(self, state: str) -> int:
        """Calculate conversation progress percentage"""
        progress_map = {
            "collecting_domain": 20,
            "collecting_goals": 40,
            "collecting_difficulty": 60,
            "collecting_timeframe": 80,
            "collecting_preferences": 90,
            "generating": 95,
            "complete": 100
        }
        return progress_map.get(state, 0)
    
    def is_ready_for_generation(self, conversation_id: str) -> bool:
        """Check if conversation has enough info for skill generation"""
        conversation = self.conversations.get(conversation_id)
        if not conversation:
            return False
        
        context = conversation.context
        required_fields = ["domain", "goals", "difficulty"]
        
        return (
            context.domain and 
            len(context.goals) > 0 and 
            context.difficulty and
            conversation.state in ["collecting_preferences", "generating", "complete"]
        )

# Global conversation manager instance
conversation_manager = ConversationManager()
