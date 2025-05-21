import React from "react";
import { BrainCircuit, ListTodo, Sparkles, Plus } from "lucide-react-native";
import { Tabs, useRouter } from "expo-router";
import { View, StyleSheet } from "react-native";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";

function TabBarIcon(props: { name: React.ElementType; color: string }) {
  const IconComponent = props.name;
  return <IconComponent size={24} color={props.color} />;
}

export function TabBar() {
  const colorScheme = useColorScheme();

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          tabBarStyle: {
            height: 90,
            paddingTop: 5,
            backgroundColor: Colors[colorScheme ?? "light"].background,
          },
          tabBarLabelStyle: {
            fontSize: 10,
            marginTop: 5,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Skills",
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <TabBarIcon name={BrainCircuit} color={color} />
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
    </View>
  );
}
