from langchain_openai import AzureChatOpenAI
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from pydantic import BaseModel, Field
from typing import Optional, Dict, List, Literal
from dotenv import load_dotenv
from ai.prompts import COLLECTOR_PROMPT
import os
load_dotenv()


class SkillData(BaseModel):
  skill: Optional[str] = Field(None, description="The skill to learn")
  goal: Optional[str] = Field(None, description="The learning goal")
  experience: Optional[str] = Field(None, description="Current experience level")
  deadline: Optional[str] = Field(None, description="Time deadline")


class CollectorResponse(BaseModel):
  status: Literal["collecting", "complete"] = Field(
    ..., description="Whether we're still collecting info or have everything needed"
  )
  current_data: SkillData = Field(
    ..., description="Currently collected information"
  )
  missing_fields: List[str] = Field(
    ..., description="List of fields that are still missing or need clarification"
  )
  next_question: Optional[str] = Field(
    None, description="Next question to ask the user, if any"
  )


class CollectorRequest(BaseModel):
  skill: str = Field(
    ..., 
    description="The skill to generate content for, e.g., 'python', 'javascript', etc."
  )
  goal: str = Field(
    ..., 
    description="The goal of the content generation, e.g., 'create a web app', 'build a game', etc."
  )
  experience: str = Field(
    ..., 
    description="The experience level of the user, e.g., 'beginner', 'intermediate', 'advanced'."
  )
  deadline: str = Field(
    ..., 
    description="The deadline for the content generation, e.g., '1 week', '3 days', etc."
  )
  extra_info: Optional[str] = Field(
    None, 
    description="Any additional information that might help in generating the content."
  )

  def to_dict(self):
    return {
      "skill": self.skill,
      "goal": self.goal,
      "experience": self.experience,
      "deadline": self.deadline,
      "extra_info": self.extra_info
    }
  
  class Config:
    json_schema_extra = {
      "example": {
        "skill": "python",
        "goal": "create a web app",
        "experience": "beginner",
        "deadline": "1 week",
        "extra_info": "Focus on Django framework"
      }
    }

collector_parser = PydanticOutputParser(pydantic_object=CollectorResponse)

llm = AzureChatOpenAI(
  api_key=os.environ.get("AZURE_OPENAI_API_KEY"),
  azure_endpoint=os.environ.get("AZURE_OPENAI_ENDPOINT"),
  azure_deployment=os.environ.get("AZURE_OPENAI_DEPLOYMENT"),
  api_version=os.environ.get("AZURE_OPENAI_API_VERSION"),
  )

def collect_information(input) -> Dict:
  collector_prompt = PromptTemplate(
    template=COLLECTOR_PROMPT,
    input_variables=["skill", "goal", "experience", "deadline", "message"],
    partial_variables={
      "formation_template": collector_parser.get_format_instructions()
    },
  )

  chain = collector_prompt | llm 

  llm_res = chain.invoke({
    "skill": input.get('skill', ''),
    "goal": input.get('goal', ''),
    "experience": input.get('experience', ''),
    "deadline": input.get('deadline', ''),
    "message": input.get('message', '')
  })

  try:
    # Parse the response using the new structured format
    response = collector_parser.parse(llm_res.content)
    return response.model_dump()
  except Exception as e:
    print(f"Error parsing response: {e}")
    print(f"LLM response: {llm_res.content}")
    
    # Fallback: try to extract information manually
    return {
      "status": "collecting",
      "current_data": {
        "skill": input.get('skill'),
        "goal": input.get('goal'),
        "experience": input.get('experience'),
        "deadline": input.get('deadline')
      },
      "missing_fields": ["skill", "goal", "experience", "deadline"],
      "next_question": "Es gab einen Fehler beim Verarbeiten. Können Sie mir bitte nochmal Ihre Informationen geben?",
      "error": str(e),
      "raw_response": llm_res.content
    }


def start_skill_collection(message: str) -> Dict:
  """
  Startet den Informationssammlungsprozess mit einer leeren Datenbasis
  """
  return collect_information({
    'skill': '',
    'goal': '',
    'experience': '',
    'deadline': '',
    'message': message
  })


def continue_skill_collection(current_data: Dict, new_message: str) -> Dict:
  """
  Setzt den Sammlungsprozess mit bereits vorhandenen Daten fort
  """
  return collect_information({
    'skill': current_data.get('skill', ''),
    'goal': current_data.get('goal', ''),
    'experience': current_data.get('experience', ''),
    'deadline': current_data.get('deadline', ''),
    'message': new_message
  })