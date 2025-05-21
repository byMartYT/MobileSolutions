import React from "react";
import {
  BrainCircuit,
  ListTodo,
  Sparkles,
  Plus,
  Cog,
} from "lucide-react-native";
import { Tabs } from "expo-router";
import { View } from "react-native";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";

function TabBarIcon(props: { name: React.ElementType; color: string }) {
  const IconComponent = props.name;
  return <IconComponent size={24} color={props.color} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          tabBarStyle: {
            height: 90,
            paddingTop: 5,
            backgroundColor: Colors[colorScheme ?? "light"].tabBackground,
          },
          tabBarLabelStyle: {
            fontSize: 10,
            marginTop: 5,
          },
          sceneStyle: {
            flex: 1,
            backgroundColor: Colors[colorScheme ?? "light"].background,
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
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <TabBarIcon name={ListTodo} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="ai"
          options={{
            headerShown: false,
            title: "AI",
            tabBarIcon: ({ color }) => (
              <TabBarIcon name={Sparkles} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "Settings",
            sceneStyle: { flex: 1 },
            tabBarIcon: ({ color }) => <TabBarIcon name={Cog} color={color} />,
          }}
        />
      </Tabs>
    </View>
  );
}
