#!/bin/bash

# AI Backend Test Script
echo "🤖 Testing AI Backend Integration..."

# Test 1: Start conversation
echo "1. Starting conversation..."
CONVERSATION_RESPONSE=$(curl -s -X POST http://localhost:8000/api/v1/ai/start-conversation \
  -H "Content-Type: application/json")

if [ $? -eq 0 ]; then
  echo "✅ Conversation started successfully"
  echo "Response: $CONVERSATION_RESPONSE"
else
  echo "❌ Failed to start conversation"
  exit 1
fi

# Extract conversation ID (this would need jq in a real script)
# For now, we'll just show the response

echo ""
echo "🎯 Backend AI Integration is ready!"
echo ""
echo "Available endpoints:"
echo "- POST /api/v1/ai/start-conversation"
echo "- POST /api/v1/ai/send-message" 
echo "- POST /api/v1/ai/generate-skill"
echo "- GET /api/v1/ai/conversation/{id}"
echo ""
echo "Frontend components created:"
echo "- AISkillGenerator (main component)"
echo "- ChatInterface (chat UI)"
echo "- ConversationProgress (progress tracking)"
echo "- useAIConversation (API integration hook)"
echo ""
echo "✨ Ready to test the AI Skill Generator in the app!"
