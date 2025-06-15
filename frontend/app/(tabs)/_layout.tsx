import React, { useState } from "react";
import {
  BrainCircuit,
  ListTodo,
  Sparkles,
  Cog,
  Trophy,
  X,
} from "lucide-react-native";
import { Tabs, router } from "expo-router";
import {
  Button,
  View,
  Modal,
  Text,
  Pressable,
  Animated,
  Dimensions,
} from "react-native";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import AddChooseModal from "@/components/AddChooseModal";

function TabBarIcon(props: { name: React.ElementType; color: string }) {
  const IconComponent = props.name;
  return <IconComponent size={24} color={props.color} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [slideAnim] = useState(
    new Animated.Value(Dimensions.get("window").height)
  );

  const openModal = () => {
    setModalVisible(true);
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 65,
      friction: 11,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: Dimensions.get("window").height,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
    });
  };

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
          name="list"
          options={{
            title: "Aufgaben",
            headerShown: true,
            headerRight: () => (
              <Button
                title="+"
                color={Colors[colorScheme ?? "light"].tintDark}
                accessibilityLabel="Add new task"
                onPress={openModal}
              />
            ),
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
          name="erfolge"
          options={{
            title: "Erfolge",
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <TabBarIcon name={Trophy} color={color} />
            ),
          }}
        />
      </Tabs>

      <AddChooseModal
        slideAnim={slideAnim}
        closeModal={closeModal}
        modalVisible={modalVisible}
      />
    </View>
  );
}
