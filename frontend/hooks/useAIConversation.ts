import { useState, useCallback } from 'react';

export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

export interface ConversationState {
  id: string;
  state: string;
  messages: AIMessage[];
  isComplete: boolean;
  progressPercentage: number;
}

export interface GeneratedSkill {
  title: string;
  goal: string;
  color: string;
  icon: string;
  tip: string;
  todos: Array<{
    text: string;
    status: boolean;
    id: string;
  }>;
}

const AI_BASE_URL = 'http://localhost:8000/api/v1/ai';

export const useAIConversation = () => {
  const [conversation, setConversation] = useState<ConversationState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startConversation = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${AI_BASE_URL}/start-conversation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to start conversation');
      }

      const data = await response.json();
      
      setConversation({
        id: data.conversation_id,
        state: data.state,
        messages: [
          {
            role: 'assistant',
            content: data.message,
            timestamp: new Date().toISOString(),
          }
        ],
        isComplete: data.is_complete,
        progressPercentage: data.progress_percentage,
      });

    } catch (err) {
      console.error('Error starting conversation:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sendMessage = useCallback(async (message: string) => {
    if (!conversation?.id) {
      setError('No active conversation');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Add user message immediately to UI
      const userMessage: AIMessage = {
        role: 'user',
        content: message,
        timestamp: new Date().toISOString(),
      };

      setConversation(prev => prev ? {
        ...prev,
        messages: [...prev.messages, userMessage],
      } : null);

      const response = await fetch(`${AI_BASE_URL}/send-message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversation_id: conversation.id,
          message: message,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();

      // Add AI response to conversation
      const aiMessage: AIMessage = {
        role: 'assistant',
        content: data.message,
        timestamp: new Date().toISOString(),
      };

      setConversation(prev => prev ? {
        ...prev,
        messages: [...prev.messages, aiMessage],
        state: data.state,
        isComplete: data.is_complete,
        progressPercentage: data.progress_percentage,
      } : null);

    } catch (err) {
      console.error('Error sending message:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      
      // Remove the user message if sending failed
      setConversation(prev => prev ? {
        ...prev,
        messages: prev.messages.slice(0, -1),
      } : null);
    } finally {
      setIsLoading(false);
    }
  }, [conversation?.id]);

  const generateSkill = useCallback(async (): Promise<GeneratedSkill | null> => {
    if (!conversation?.id) {
      setError('No active conversation');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${AI_BASE_URL}/generate-skill`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversation_id: conversation.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate skill');
      }

      const data = await response.json();
      
      if (!data.success || !data.skill) {
        throw new Error(data.error || 'Failed to generate skill');
      }

      return data.skill;

    } catch (err) {
      console.error('Error generating skill:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [conversation?.id]);

  const resetConversation = useCallback(() => {
    setConversation(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    conversation,
    isLoading,
    error,
    startConversation,
    sendMessage,
    generateSkill,
    resetConversation,
  };
};
