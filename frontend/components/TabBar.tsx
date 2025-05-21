import React from "react";
import { BrainCircuit, ListTodo, Sparkles } from "lucide-react-native";
import { Link, Tabs } from "expo-router";
import { Pressable } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";

// Icon component for tabs
function TabBarIcon(props: { name: React.ElementType; color: string }) {
  const IconComponent = props.name;
  return (
    <IconComponent size={28} style={{ marginBottom: -3 }} color={props.color} />
  );
}

export function TabBar() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
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
