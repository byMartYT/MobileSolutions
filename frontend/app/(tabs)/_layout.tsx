import React from "react";
import { BrainCircuit, ListTodo, Sparkles } from "lucide-react-native";
import { Link, Tabs } from "expo-router";
import "@/global.css";
import { Pressable } from "react-native";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { FontAwesome } from "@expo/vector-icons";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: { name: React.ElementType; color: string }) {
  const IconComponent = props.name;
  return (
    <IconComponent size={28} style={{ marginBottom: -3 }} color={props.color} />
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Skills",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name={BrainCircuit} color={color} />
          ),

          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="info-circle"
                    size={25}
                    color={Colors[colorScheme ?? "light"].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: "Aufgaben",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name={ListTodo} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="ai"
        options={{
          title: "AI",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name={Sparkles} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
