import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Send, Bot, User } from "lucide-react-native";
import { AIMessage } from "@/hooks/useAIConversation";

interface ChatInterfaceProps {
  messages: AIMessage[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export default function ChatInterface({
  messages,
  onSendMessage,
  isLoading,
  disabled = false,
}: ChatInterfaceProps) {
  const [inputText, setInputText] = React.useState("");
  const scrollViewRef = useRef<ScrollView>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const handleSend = () => {
    if (inputText.trim() && !isLoading && !disabled) {
      onSendMessage(inputText.trim());
      setInputText("");
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("de-DE", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <View className="flex-1 bg-gray-50">
        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          className="flex-1 px-4 py-4"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {messages.map((message, index) => (
            <MessageBubble key={index} message={message} />
          ))}

          {isLoading && (
            <View className="flex-row items-center justify-center py-4">
              <ActivityIndicator size="small" color="#6B7280" />
              <Text className="ml-2 text-gray-500">AI tippt...</Text>
            </View>
          )}
        </ScrollView>

        {/* Input */}
        <View className="border-t border-gray-200 bg-white px-4 py-3">
          <View className="flex-row items-center space-x-3">
            <TextInput
              value={inputText}
              onChangeText={setInputText}
              placeholder="Schreibe deine Antwort..."
              className="flex-1 border border-gray-300 rounded-full px-4 py-3 text-base bg-gray-50"
              multiline
              maxLength={500}
              editable={!disabled && !isLoading}
              onSubmitEditing={handleSend}
              returnKeyType="send"
            />
            <Pressable
              onPress={handleSend}
              disabled={!inputText.trim() || isLoading || disabled}
              className={`rounded-full p-3 ${
                inputText.trim() && !isLoading && !disabled
                  ? "bg-blue-500"
                  : "bg-gray-300"
              }`}
            >
              <Send size={20} color="white" />
            </Pressable>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

interface MessageBubbleProps {
  message: AIMessage;
}

function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";
  const time = new Date(message.timestamp).toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <View
      className={`flex-row mb-4 ${isUser ? "justify-end" : "justify-start"}`}
    >
      {!isUser && (
        <View className="w-8 h-8 rounded-full bg-blue-100 items-center justify-center mr-3 mt-1">
          <Bot size={16} color="#3B82F6" />
        </View>
      )}

      <View className={`max-w-[75%] ${isUser ? "items-end" : "items-start"}`}>
        <View
          className={`rounded-2xl px-4 py-3 ${
            isUser
              ? "bg-blue-500 rounded-br-sm"
              : "bg-white border border-gray-200 rounded-bl-sm"
          }`}
        >
          <Text
            className={`text-base leading-6 ${
              isUser ? "text-white" : "text-gray-900"
            }`}
          >
            {message.content}
          </Text>
        </View>
        <Text className="text-xs text-gray-500 mt-1 px-2">{time}</Text>
      </View>

      {isUser && (
        <View className="w-8 h-8 rounded-full bg-green-100 items-center justify-center ml-3 mt-1">
          <User size={16} color="#10B981" />
        </View>
      )}
    </View>
  );
}
