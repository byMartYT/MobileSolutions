import React, { useState } from "react";
import { View, Text, Pressable, Alert } from "react-native";
import { Sparkles, RotateCcw, Check, ArrowRight } from "lucide-react-native";
import { router } from "expo-router";
import { useAIConversation, GeneratedSkill } from "@/hooks/useAIConversation";
import ChatInterface from "./ChatInterface";
import ConversationProgress from "./ConversationProgress";
import Container from "@/components/Container";
import { api } from "@/api/api";
import useStore from "@/store/store";

export default function AISkillGenerator() {
  const {
    conversation,
    isLoading,
    error,
    startConversation,
    sendMessage,
    generateSkill,
    resetConversation,
  } = useAIConversation();

  const { addSkill } = useStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSkill, setGeneratedSkill] = useState<GeneratedSkill | null>(
    null
  );

  const handleStartConversation = async () => {
    await startConversation();
  };

  const handleSendMessage = async (message: string) => {
    await sendMessage(message);
  };

  const handleGenerateSkill = async () => {
    setIsGenerating(true);
    try {
      const skill = await generateSkill();
      if (skill) {
        setGeneratedSkill(skill);
      }
    } catch (err) {
      console.error("Error generating skill:", err);
      Alert.alert("Fehler", "Skill konnte nicht generiert werden.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveSkill = async () => {
    if (!generatedSkill) return;

    try {
      // Create skill via API
      const response = await api.createTodoApiV1TodosPost({
        ...generatedSkill,
        user: "default-user",
        textColor: "#FFFFFF",
      });

      // Add to local store
      addSkill(response.data);

      Alert.alert(
        "Erfolg! 🎉",
        "Dein AI-generierter Skill wurde erfolgreich erstellt!",
        [
          {
            text: "Zu Skills",
            onPress: () => {
              resetConversation();
              setGeneratedSkill(null);
              router.navigate("/(tabs)/");
            },
          },
        ]
      );
    } catch (error) {
      console.error("Error saving skill:", error);
      Alert.alert("Fehler", "Skill konnte nicht gespeichert werden.");
    }
  };

  const handleRestart = () => {
    Alert.alert(
      "Neu starten?",
      "Möchtest du eine neue Skill-Erstellung beginnen?",
      [
        { text: "Abbrechen", style: "cancel" },
        {
          text: "Neu starten",
          onPress: () => {
            resetConversation();
            setGeneratedSkill(null);
          },
        },
      ]
    );
  };

  // Initial state - no conversation started
  if (!conversation && !isLoading) {
    return (
      <Container>
        <View className="flex-1 justify-center items-center px-6">
          <View className="items-center mb-8">
            <View className="w-20 h-20 bg-blue-100 rounded-full items-center justify-center mb-4">
              <Sparkles size={40} color="#3B82F6" />
            </View>
            <Text className="text-2xl font-bold text-gray-900 text-center mb-3">
              AI Skill Generator
            </Text>
            <Text className="text-base text-gray-600 text-center leading-6">
              Lass die AI dir helfen, den perfekten personalisierten Skill zu
              erstellen! Ich führe dich durch ein paar Fragen und erstelle dann
              einen maßgeschneiderten Lernplan.
            </Text>
          </View>

          <Pressable
            onPress={handleStartConversation}
            disabled={isLoading}
            className="bg-blue-500 rounded-xl px-8 py-4 min-w-[200px] items-center"
          >
            <View className="flex-row items-center">
              <Sparkles size={20} color="white" />
              <Text className="text-white font-semibold text-lg ml-2">
                Los geht's!
              </Text>
            </View>
          </Pressable>
        </View>
      </Container>
    );
  }

  // Show generated skill result
  if (generatedSkill) {
    return (
      <Container>
        <View className="flex-1">
          {/* Header */}
          <View className="bg-green-50 border-b border-green-200 px-4 py-4">
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-green-500 rounded-full items-center justify-center mr-3">
                <Check size={20} color="white" />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-bold text-green-800">
                  Skill erfolgreich generiert! 🎉
                </Text>
                <Text className="text-sm text-green-600">
                  Schau dir deinen personalisierten Skill an
                </Text>
              </View>
            </View>
          </View>

          {/* Generated Skill Preview */}
          <View className="flex-1 p-4">
            <View className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
              <View className="flex-row items-center mb-4">
                <View
                  className="w-12 h-12 rounded-xl items-center justify-center mr-4"
                  style={{ backgroundColor: generatedSkill.color }}
                >
                  <Text className="text-white text-lg">🎯</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-xl font-bold text-gray-900">
                    {generatedSkill.title}
                  </Text>
                  <Text className="text-sm text-gray-600 mt-1">
                    {generatedSkill.todos.length} Schritte
                  </Text>
                </View>
              </View>

              <Text className="text-gray-700 mb-4 leading-6">
                {generatedSkill.goal}
              </Text>

              {generatedSkill.tip && (
                <View className="bg-blue-50 rounded-lg p-3 mb-4">
                  <Text className="text-blue-800 text-sm font-medium">
                    💡 Tipp: {generatedSkill.tip}
                  </Text>
                </View>
              )}

              <Text className="text-lg font-semibold text-gray-900 mb-3">
                Deine Lernschritte:
              </Text>
              {generatedSkill.todos.map((todo, index) => (
                <View key={todo.id} className="flex-row items-center mb-2">
                  <View className="w-6 h-6 bg-gray-200 rounded-full items-center justify-center mr-3">
                    <Text className="text-xs font-bold text-gray-600">
                      {index + 1}
                    </Text>
                  </View>
                  <Text className="flex-1 text-gray-700">{todo.text}</Text>
                </View>
              ))}
            </View>

            {/* Action Buttons */}
            <View className="space-y-3">
              <Pressable
                onPress={handleSaveSkill}
                className="bg-green-500 rounded-xl px-6 py-4 items-center"
              >
                <View className="flex-row items-center">
                  <Check size={20} color="white" />
                  <Text className="text-white font-semibold text-lg ml-2">
                    Skill speichern & starten
                  </Text>
                </View>
              </Pressable>

              <Pressable
                onPress={handleRestart}
                className="bg-gray-200 rounded-xl px-6 py-3 items-center"
              >
                <View className="flex-row items-center">
                  <RotateCcw size={18} color="#6B7280" />
                  <Text className="text-gray-700 font-medium ml-2">
                    Neuen Skill erstellen
                  </Text>
                </View>
              </Pressable>
            </View>
          </View>
        </View>
      </Container>
    );
  }

  // Show conversation interface
  return (
    <View className="flex-1 bg-gray-50">
      {conversation && (
        <ConversationProgress
          currentState={conversation.state}
          progressPercentage={conversation.progressPercentage}
        />
      )}

      {error && (
        <View className="bg-red-50 border-b border-red-200 px-4 py-3">
          <Text className="text-red-800 text-sm">Fehler: {error}</Text>
        </View>
      )}

      <View className="flex-1">
        {conversation && (
          <ChatInterface
            messages={conversation.messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            disabled={conversation.isComplete}
          />
        )}
      </View>

      {conversation?.isComplete && !generatedSkill && (
        <View className="bg-white border-t border-gray-200 px-4 py-4">
          <Pressable
            onPress={handleGenerateSkill}
            disabled={isGenerating}
            className={`rounded-xl px-6 py-4 items-center ${
              isGenerating ? "bg-gray-300" : "bg-blue-500"
            }`}
          >
            <View className="flex-row items-center">
              <Sparkles size={20} color="white" />
              <Text className="text-white font-semibold text-lg ml-2">
                {isGenerating ? "Erstelle Skill..." : "Skill generieren"}
              </Text>
            </View>
          </Pressable>
        </View>
      )}

      {/* Restart Button */}
      {conversation && !conversation.isComplete && (
        <View className="absolute top-4 right-4">
          <Pressable
            onPress={handleRestart}
            className="bg-gray-200 rounded-full p-2"
          >
            <RotateCcw size={18} color="#6B7280" />
          </Pressable>
        </View>
      )}
    </View>
  );
}
