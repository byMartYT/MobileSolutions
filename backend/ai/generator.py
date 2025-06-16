from langchain_openai import AzureChatOpenAI
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from pydantic import BaseModel, Field, field_validator
from typing import List, Dict
from dotenv import load_dotenv
from prompts import GENERATOR_PROMPT
import os
load_dotenv()


class TodoItem(BaseModel):
    status: bool = Field(False, description="Completion status of the todo")
    text: str = Field(..., description="Description of the todo task")


class SkillItem(BaseModel):
    color: str = Field(..., description="HSL color in format 'hsl(X, 64%, 62%)' where X is 0-360")
    goal: str = Field(..., description="Main goal description")
    icon: str = Field(..., description="Lucide icon name")
    tip: str = Field(..., description="Motivational tip for learning")
    title: str = Field(..., description="Title of the skill")
    todos: List[TodoItem] = Field(..., description="List of todo items")
    
    @field_validator('icon')
    def validate_lucide_icon(cls, v):
        # List of allowed Lucide icons
        allowed_icons = [
            "code", "book", "star", "target", "laptop", "brain", "chart-bar",
            "graduation-cap", "heart", "zap", "trophy", "clock", "play",
            "bookmark", "lightbulb", "settings", "terminal", "database",
            "globe", "smartphone"
        ]
        if v not in allowed_icons:
            raise ValueError(f"Icon must be one of: {', '.join(allowed_icons)}")
        return v
    
    @field_validator('color')
    def validate_color_format(cls, v):
        import re
        if not re.match(r'^hsl\(\d+,\s*64%,\s*62%\)$', v):
            raise ValueError("Color must be in format 'hsl(X, 64%, 62%)' where X is 0-360")
        return v


generator_parser = PydanticOutputParser(pydantic_object=SkillItem)

llm = AzureChatOpenAI(
    api_key=os.environ.get("AZURE_OPENAI_API_KEY"),
    azure_endpoint=os.environ.get("AZURE_OPENAI_ENDPOINT"),
    azure_deployment=os.environ.get("AZURE_OPENAI_DEPLOYMENT"),
    api_version=os.environ.get("AZURE_OPENAI_API_VERSION"),
)


def generate_skill_plan(collector_data: Dict) -> Dict:
    """
    Generates a structured skill plan from collector data
    
    Args:
        collector_data: Dictionary containing status, current_data, etc. from collector
        
    Returns:
        Dictionary containing the generated SkillItem
    """
    
    # Extract the current_data from collector output
    skill_data = collector_data.get('current_data', {})
    
    # Validate that we have complete data
    if collector_data.get('status') != 'complete':
        raise ValueError("Cannot generate plan from incomplete collector data")
    
    generator_prompt = PromptTemplate(
        template=GENERATOR_PROMPT,
        input_variables=["skill", "goal", "experience", "deadline"],
        partial_variables={
            "formation_template": generator_parser.get_format_instructions()
        },
    )

    chain = generator_prompt | llm 

    llm_res = chain.invoke({
        "skill": skill_data.get('skill', ''),
        "goal": skill_data.get('goal', ''),
        "experience": skill_data.get('experience', ''),
        "deadline": skill_data.get('deadline', '')
    })

    try:
        # Parse the response using the SkillItem structure
        response = generator_parser.parse(llm_res.content)
        return response.model_dump()
    except Exception as e:
        print(f"Error parsing generator response: {e}")
        print(f"LLM response: {llm_res.content}")
        
        # Fallback: create a basic skill item
        return {
            "color": "hsl(200, 64%, 62%)",
            "goal": skill_data.get('goal', 'Learn new skill'),
            "icon": "book",
            "tip": "Stay consistent and practice regularly",
            "title": skill_data.get('skill', 'New Skill'),
            "todos": [
                {"status": False, "text": "Start learning basics"},
                {"status": False, "text": "Practice daily"},
                {"status": False, "text": "Build a project"},
                {"status": False, "text": "Review and refine"}
            ],
            "error": str(e),
            "raw_response": llm_res.content
        }


if __name__ == "__main__":
    # Test with the provided data
    test_data = {
        "status": "complete",
        "current_data": {
            "skill": "React",
            "goal": "Ich möchte Frontend Entwickler werden und 100 Tausend im Jahr verdienen.",
            "experience": "Werkstudentenjob seit 9 Monaten in Frontend und als Hobby seit 2019.",
            "deadline": "noch 9 Monate bis zu meinem Bachelor Abschluss"
        },
        "missing_fields": [],
        "next_question": None
    }
    
    result = generate_skill_plan(test_data)
    print("Generated Skill Plan:")
    print(result)
