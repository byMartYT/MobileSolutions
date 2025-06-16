import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { AISkillAPI, CollectorResponse } from "@/api/aiSkillAPI";
import Title from "@/components/Title";
import { useAppTheme } from "@/hooks/useAppTheme";
import { ArrowUp } from "lucide-react-native";

const EXAMPLE_PROMPTS = [
  "🏃🏻 Halbmarathon",
  "⚛ React lernen",
  "🎸 Gitarre spielen",
  "🇪🇸 Spanisch sprechen",
];

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  data?: CollectorResponse;
}

export default function AIScreen() {
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentCollectorData, setCurrentCollectorData] = useState<
    CollectorResponse["current_data"]
  >({});

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      let response: CollectorResponse;

      // Determine if this is the first message or continuation
      if (messages.length === 0) {
        response = await AISkillAPI.startCollection(text.trim());
      } else {
        response = await AISkillAPI.continueCollection(
          currentCollectorData,
          text.trim()
        );
      }

      // Update current data
      setCurrentCollectorData(response.current_data);

      // Add AI response
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.next_question || "Danke für die Informationen!",
        isUser: false,
        timestamp: new Date(),
        data: response,
      };

      setMessages((prev) => [...prev, aiMessage]);

      // If collection is complete, show completion message
      if (response.status === "complete") {
        setTimeout(() => {
          const completionMessage: Message = {
            id: (Date.now() + 2).toString(),
            text: "Perfekt! Ich habe alle Informationen gesammelt. Möchtest du jetzt einen personalisierten Lernplan erstellen?",
            isUser: false,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, completionMessage]);
        }, 1000);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      Alert.alert(
        "Fehler",
        "Es gab ein Problem beim Senden der Nachricht. Bitte versuche es erneut."
      );

      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Entschuldigung, es gab einen Fehler. Bitte versuche es erneut.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateSkillPlan = async () => {
    const lastAiMessage = [...messages]
      .reverse()
      .find((m) => !m.isUser && m.data);
    if (!lastAiMessage?.data) return;

    setIsLoading(true);
    try {
      const skillPlan = await AISkillAPI.generateSkillPlan(lastAiMessage.data);

      const planMessage: Message = {
        id: Date.now().toString(),
        text: `🎉 Dein personalisierter Lernplan für "${skillPlan.title}" wurde erstellt!\n\n🎯 Ziel: ${skillPlan.goal}\n\n💡 Tipp: ${skillPlan.tip}\n\nDein Plan wurde zu deiner Skill-Liste hinzugefügt!`,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, planMessage]);
    } catch (error) {
      console.error("Error generating skill plan:", error);
      Alert.alert("Fehler", "Es gab ein Problem beim Erstellen des Lernplans.");
    } finally {
      setIsLoading(false);
    }
  };

  const WelcomeScreen = () => (
    <View className="flex-1 items-start justify-between gap-1">
      <View className="px-4">
        <Title className="">Hallo!</Title>
        <Text
          className="text-3xl font-semibold mb-8"
          style={{ color: colors.text }}
        >
          Welchen neuen Skill{"\n"}möchtest du lernen?
        </Text>
      </View>
      <View className="w-full mb-8">
        <View className="flex-row justify-start gap-3 mb-6">
          <FlatList
            data={EXAMPLE_PROMPTS}
            horizontal
            keyExtractor={(item) => item}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => sendMessage(item)}
                className="px-4 py-1 rounded-full"
                style={{ backgroundColor: colors.onSurface }}
              >
                <Text className="text-lg" style={{ color: "#333" }}>
                  {item}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </View>
  );

  const ChatMessage = ({ message }: { message: Message }) => {
    const isComplete = message.data?.status === "complete";

    return (
      <View
        className={`mb-4 flex-row`}
        style={{ justifyContent: message.isUser ? "flex-end" : "flex-start" }}
      >
        <View
          className={`max-w-[80%] px-4 py-3 rounded-2xl`}
          style={{
            backgroundColor: message.isUser ? "#007AFF" : colors.onSurface,
          }}
        >
          <Text
            className="text-base"
            style={{ color: message.isUser ? "white" : colors.text }}
          >
            {message.text}
          </Text>

          {isComplete && !message.isUser && (
            <TouchableOpacity
              onPress={generateSkillPlan}
              className="mt-3 px-4 py-2 rounded-full"
              style={{ backgroundColor: "#007AFF" }}
            >
              <Text className="text-white text-center font-semibold">
                Lernplan erstellen 🚀
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView
      className="flex-1"
      edges={["top"]}
      style={{ backgroundColor: colors.background }}
    >
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Chat Area */}
        <ScrollView
          className="flex-1"
          contentContainerStyle={
            messages.length === 0 ? { flex: 1 } : undefined
          }
        >
          {messages.length === 0 ? (
            <WelcomeScreen />
          ) : (
            <View className="py-4 px-4 ">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {isLoading && (
                <View className="mb-4" style={{ alignItems: "flex-start" }}>
                  <View
                    className="px-4 py-3 rounded-2xl rounded-bl-md"
                    style={{ backgroundColor: colors.onSurface }}
                  >
                    <Text style={{ color: colors.text }}>Typing...</Text>
                  </View>
                </View>
              )}
            </View>
          )}
        </ScrollView>

        {/* Input Area */}
        <View
          className="px-4 py-3 border-t flex-row items-center gap-3"
          style={{
            backgroundColor: colors.onSurfaceLight,
            borderTopRightRadius: 20,
            borderTopLeftRadius: 20,
            // iOS Shadow
            shadowColor: "#000000",
            shadowOffset: {
              width: 0,
              height: -3,
            },
            shadowOpacity: 0.15, // 15% Opacity
            shadowRadius: 28.5,

            // Android Shadow
            elevation: 8,
          }}
        >
          <TextInput
            className="flex-1 px-4 py-3 rounded-full"
            style={{
              borderColor: colors.tabIconDefault + "30",
              backgroundColor: colors.onSurfaceLight,
              color: colors.text,
            }}
            placeholder="Nachricht eingeben..."
            placeholderTextColor={colors.tabIconDefault}
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={() => sendMessage(inputText)}
            multiline
          />
          <TouchableOpacity
            onPress={() => sendMessage(inputText)}
            disabled={!inputText.trim() || isLoading}
            className="w-12 h-12 rounded-full items-center justify-center"
            style={{
              backgroundColor: inputText.trim()
                ? colors.tint
                : colors.tabIconDefault + "30",
            }}
          >
            <ArrowUp color={inputText.trim() ? colors.tintDark : colors.tint} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
