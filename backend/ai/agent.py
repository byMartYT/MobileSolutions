import json
import re
from datetime import datetime
from typing import Optional, Dict, Any
from models.ai_models import ConversationState, Message, GeneratedSkill
from ai.prompts import *
from ai.conversation import conversation_manager

class SkillGeneratorAgent:
    """AI Agent for skill generation conversations using LangChain"""
    
    def __init__(self):
        # In a real implementation, you would initialize LangChain here
        # For now, we'll simulate the AI responses
        self.model_name = "gpt-3.5-turbo"  # or your preferred model
    
    def process_message(self, conversation_id: str, user_message: str) -> tuple[str, bool]:
        """
        Process user message and return AI response
        Returns: (ai_response, should_advance_state)
        """
        conversation = conversation_manager.get_conversation(conversation_id)
        if not conversation:
            return "Entschuldigung, ich konnte die Unterhaltung nicht finden.", False
        
        # Add user message to conversation
        user_msg = Message(
            role="user",
            content=user_message,
            timestamp=datetime.now()
        )
        conversation_manager.add_message(conversation_id, user_msg)
        
        # Process based on current state
        ai_response, should_advance = self._process_by_state(conversation, user_message)
        
        # Add AI response to conversation
        ai_msg = Message(
            role="assistant", 
            content=ai_response,
            timestamp=datetime.now()
        )
        conversation_manager.add_message(conversation_id, ai_msg)
        
        return ai_response, should_advance
    
    def _process_by_state(self, conversation: ConversationState, user_message: str) -> tuple[str, bool]:
        """Process message based on conversation state"""
        
        if conversation.state == "collecting_domain":
            return self._handle_domain_collection(conversation, user_message)
        elif conversation.state == "collecting_goals":
            return self._handle_goals_collection(conversation, user_message)
        elif conversation.state == "collecting_difficulty":
            return self._handle_difficulty_collection(conversation, user_message)
        elif conversation.state == "collecting_timeframe":
            return self._handle_timeframe_collection(conversation, user_message)
        elif conversation.state == "collecting_preferences":
            return self._handle_preferences_collection(conversation, user_message)
        else:
            return "Entschuldigung, ich bin verwirrt. Lass uns von vorne anfangen.", False
    
    def _handle_domain_collection(self, conversation: ConversationState, user_message: str) -> tuple[str, bool]:
        """Handle domain collection state"""
        if len(user_message.strip()) < 3:
            return "Das ist etwas kurz. Kannst du mir mehr über den Skill erzählen, den du lernen möchtest?", False
        
        # Extract and save domain
        domain = user_message.strip()
        conversation.context.domain = domain
        
        # Generate goals collection question
        response = f"Klasse! Du möchtest also {domain} lernen. Das ist ein spannender Bereich! Was ist dein Hauptziel dabei? Was möchtest du konkret erreichen?"
        
        return response, True
    
    def _handle_goals_collection(self, conversation: ConversationState, user_message: str) -> tuple[str, bool]:
        """Handle goals collection state"""
        if len(user_message.strip()) < 5:
            return "Erzähl mir gerne etwas mehr über deine Ziele. Was motiviert dich?", False
        
        # Save goals
        conversation.context.goals.append(user_message.strip())
        
        domain = conversation.context.domain
        response = f"Das ist ein großartiges Ziel! Wie viel Erfahrung hast du bereits mit {domain}? Bist du kompletter Anfänger oder hast du schon mal etwas in diese Richtung gemacht?"
        
        return response, True
    
    def _handle_difficulty_collection(self, conversation: ConversationState, user_message: str) -> tuple[str, bool]:
        """Handle difficulty/experience collection"""
        user_input = user_message.lower()
        
        # Determine difficulty level from user input
        if any(word in user_input for word in ["anfänger", "neu", "noch nie", "beginner", "start"]):
            difficulty = "beginner"
        elif any(word in user_input for word in ["fortgeschritten", "intermediate", "etwas erfahrung", "bisschen"]):
            difficulty = "intermediate"
        elif any(word in user_input for word in ["erfahren", "advanced", "viel erfahrung", "profi"]):
            difficulty = "advanced"
        else:
            difficulty = "beginner"  # Default to beginner
        
        conversation.context.difficulty = difficulty
        
        domain = conversation.context.domain
        response = f"Verstehe! In welchem Zeitrahmen möchtest du bei {domain} erste Erfolge sehen? Hast du eine bestimmte Deadline im Kopf?"
        
        return response, True
    
    def _handle_timeframe_collection(self, conversation: ConversationState, user_message: str) -> tuple[str, bool]:
        """Handle timeframe collection"""
        conversation.context.timeframe = user_message.strip()
        
        response = "Perfekt! Ich habe fast alle Informationen. Zum Schluss: Welche Farbe würde am besten zu deinem Skill passen? Oder soll ich eine für dich auswählen?"
        
        return response, True
    
    def _handle_preferences_collection(self, conversation: ConversationState, user_message: str) -> tuple[str, bool]:
        """Handle preferences collection"""
        user_input = user_message.lower()
        
        # Extract color preference
        color_map = {
            "blau": "hsl(210, 64%, 62%)",
            "grün": "hsl(150, 64%, 62%)", 
            "rot": "hsl(0, 64%, 62%)",
            "lila": "hsl(280, 64%, 62%)",
            "orange": "hsl(30, 64%, 62%)",
            "gelb": "hsl(60, 64%, 62%)"
        }
        
        selected_color = None
        for color_name, color_value in color_map.items():
            if color_name in user_input:
                selected_color = color_value
                break
        
        conversation.context.preferences = {
            "color": selected_color,
            "original_input": user_message
        }
        
        domain = conversation.context.domain
        response = f"Wunderbar! Ich erstelle jetzt deinen personalisierten {domain}-Skill. Das dauert nur einen Moment! 🚀"
        
        return response, True
    
    def generate_skill(self, conversation_id: str) -> Optional[GeneratedSkill]:
        """Generate final skill based on conversation context"""
        conversation = conversation_manager.get_conversation(conversation_id)
        if not conversation or not conversation_manager.is_ready_for_generation(conversation_id):
            return None
        
        context = conversation.context
        
        # This would use LangChain in a real implementation
        # For now, we'll generate based on the collected context
        skill = self._generate_skill_from_context(context)
        
        return skill
    
    def _generate_skill_from_context(self, context) -> GeneratedSkill:
        """Generate skill from conversation context"""
        import uuid
        
        # Smart defaults based on domain
        domain_lower = context.domain.lower()
        
        # Select appropriate color
        color = context.preferences.get("color")
        if not color:
            if any(word in domain_lower for word in ["sport", "fitness", "lauf", "training"]):
                color = "hsl(0, 64%, 62%)"  # Red for sports
            elif any(word in domain_lower for word in ["musik", "kunst", "kreativ"]):
                color = "hsl(280, 64%, 62%)"  # Purple for creativity
            elif any(word in domain_lower for word in ["programmier", "tech", "computer"]):
                color = "hsl(210, 64%, 62%)"  # Blue for tech
            else:
                color = "hsl(150, 64%, 62%)"  # Green as default
        
        # Select appropriate icon
        if any(word in domain_lower for word in ["sport", "fitness", "training"]):
            icon = "Dumbbell"
        elif any(word in domain_lower for word in ["musik"]):
            icon = "Music"
        elif any(word in domain_lower for word in ["programmier", "code", "tech"]):
            icon = "FileText"
        elif any(word in domain_lower for word in ["kunst", "zeichn", "mal"]):
            icon = "Palette"
        elif any(word in domain_lower for word in ["lern", "studium", "buch"]):
            icon = "BookOpen"
        else:
            icon = "Target"
        
        # Generate steps based on difficulty and domain
        steps = self._generate_steps(context.domain, context.difficulty, context.goals)
        
        # Create todos
        todos = []
        for i, step in enumerate(steps):
            todos.append({
                "text": step,
                "status": False,
                "id": f"ai_todo_{uuid.uuid4().hex[:8]}_{i}"
            })
        
        return GeneratedSkill(
            title=context.domain,
            goal=context.goals[0] if context.goals else f"Lerne {context.domain}",
            color=color,
            icon=icon,
            tip=f"Bleib dran! {context.domain} zu lernen braucht Zeit und Übung.",
            todos=todos
        )
    
    def _generate_steps(self, domain: str, difficulty: str, goals: list) -> list[str]:
        """Generate learning steps based on domain and difficulty"""
        
        # This would use LangChain/GPT in real implementation
        # For now, we'll use template-based generation
        
        base_steps = {
            "beginner": [
                f"Grundlagen von {domain} verstehen",
                f"Erste praktische Übungen in {domain}",
                f"Einfache {domain}-Techniken einüben",
                f"Regelmäßige Praxis etablieren",
                f"Erste kleine Projekte umsetzen"
            ],
            "intermediate": [
                f"Fortgeschrittene {domain}-Konzepte lernen",
                f"Komplexere Techniken beherrschen", 
                f"Eigene {domain}-Projekte entwickeln",
                f"Feedback von Experten einholen",
                f"Schwierigere Herausforderungen meistern"
            ],
            "advanced": [
                f"Expertenwissen in {domain} vertiefen",
                f"Innovative Ansätze entwickeln",
                f"Mentoring anderer übernehmen",
                f"Eigene Methoden perfektionieren",
                f"Professionelle Projekte leiten"
            ]
        }
        
        return base_steps.get(difficulty, base_steps["beginner"])

# Global agent instance
skill_agent = SkillGeneratorAgent()
