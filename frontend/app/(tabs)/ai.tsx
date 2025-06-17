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
import { AISkillAPI, CollectorResponse, SkillItem } from "@/api/aiSkillAPI";
import Title from "@/components/Title";
import { useAppTheme } from "@/hooks/useAppTheme";
import { ArrowUp, RotateCcw } from "lucide-react-native";
import SkillPreview from "@/components/SkillPreview";
import useStore from "@/store/store";
import { Todo } from "@/generated";
import { api } from "@/api/api";

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
  skillItem?: SkillItem;
}

export default function AIScreen() {
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];
  const { addSkill } = useStore();

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentCollectorData, setCurrentCollectorData] = useState<
    CollectorResponse["current_data"]
  >({});

  const addSkillToList = async (skillItem: SkillItem) => {
    const todo: Todo = {
      title: skillItem.title,
      user: "user-123", // You might want to get this from user context
      icon: skillItem.icon,
      color: skillItem.color,
      textColor: "#FFFFFF",
      tip: skillItem.tip,
      goal: skillItem.goal,
      todos: skillItem.todos.map((todo, index) => ({
        id: `${Date.now()}-${index}`,
        text: todo.text,
        status: todo.status,
      })),
      id: Date.now().toString(),
    };

    try {
      // Send to backend first
      const createdTodo = await api.createTodoApiV1TodosPost(todo);

      // Add to local store only if backend call succeeds
      addSkill(createdTodo.data);

      Alert.alert(
        "Erfolg",
        `"${skillItem.title}" wurde zu deiner Skill-Liste hinzugefügt!`
      );
    } catch (error) {
      console.error("Error adding skill to backend:", error);
      Alert.alert(
        "Fehler",
        "Es gab einen Fehler beim Hinzufügen des Skills. Bitte versuche es erneut."
      );
    }
  };

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

      console.log(response);
      console.log("Status:", response.status);

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

      // If collection is complete, automatically generate skill plan
      if (response.status === "complete") {
        console.log("Status is complete, generating skill plan...");
        setTimeout(async () => {
          const completionMessage: Message = {
            id: (Date.now() + 2).toString(),
            text: "Perfekt! Ich habe alle Informationen gesammelt. Ich erstelle jetzt deinen personalisierten Lernplan...",
            isUser: false,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, completionMessage]);

          // Automatically generate skill plan
          try {
            const skillPlan = await AISkillAPI.generateSkillPlan(response);

            console.log(skillPlan);

            const planMessage: Message = {
              id: (Date.now() + 3).toString(),
              text: `🎉 Dein personalisierter Lernplan für "${skillPlan.title}" wurde erstellt!\n\n🎯 Ziel: ${skillPlan.goal}\n\n💡 Tipp: ${skillPlan.tip}`,
              isUser: false,
              timestamp: new Date(),
              skillItem: skillPlan,
            };
            setMessages((prev) => [...prev, planMessage]);
          } catch (error) {
            console.error("Error auto-generating skill plan:", error);
            const errorMessage: Message = {
              id: (Date.now() + 3).toString(),
              text: "Es gab einen Fehler beim Erstellen des Lernplans. Du kannst es später nochmal versuchen.",
              isUser: false,
              timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
          }
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

  const resetChat = () => {
    setMessages([]);
    setCurrentCollectorData({});
    setInputText("");
    setIsLoading(false);
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
            backgroundColor: message.isUser
              ? colors.tintDark
              : colors.onSurface,
          }}
        >
          <Text
            className="text-base"
            style={{ color: message.isUser ? "white" : colors.text }}
          >
            {message.text}
          </Text>

          {/* Show SkillItem Preview if available */}
          {message.skillItem && (
            <View className="mt-3">
              <SkillPreview
                title={message.skillItem.title}
                goal={message.skillItem.goal}
                color={message.skillItem.color}
                icon={message.skillItem.icon}
                todos={message.skillItem.todos}
              />
              <Text style={{ marginTop: 20 }}>Schritte</Text>
              <View className="gap-2" style={{ marginTop: 10 }}>
                {message.skillItem.todos.length > 0 &&
                  message.skillItem.todos.map((todo, ind) => (
                    <View key={ind} className="bg-white p-4 rounded-lg">
                      <Text>{todo.text}</Text>
                    </View>
                  ))}
              </View>
              <TouchableOpacity
                onPress={() => addSkillToList(message.skillItem!)}
                className="mt-3 rounded-full"
                style={{
                  backgroundColor: "#34C759",
                  paddingVertical: 8,
                  marginTop: 10,
                }}
              >
                <Text className="text-white text-center font-semibold">
                  Skill hinzufügen
                </Text>
              </TouchableOpacity>
            </View>
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
      {/* Header with Reset Button */}
      {messages.length > 0 && (
        <View
          className="flex-row justify-between items-center px-4 py-3 border-b"
          style={{ borderBottomColor: colors.tabIconDefault + "20" }}
        >
          <Text
            className="text-xl font-semibold"
            style={{ color: colors.text }}
          >
            AI Chat
          </Text>
          <TouchableOpacity
            onPress={resetChat}
            className="p-2 rounded-full"
            style={{ backgroundColor: colors.onSurface }}
          >
            <RotateCcw size={20} color={colors.tabIconDefault} />
          </TouchableOpacity>
        </View>
      )}

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
