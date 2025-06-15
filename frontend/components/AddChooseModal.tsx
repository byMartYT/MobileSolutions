import {
  View,
  Text,
  Modal,
  Pressable,
  Dimensions,
  Animated,
  useColorScheme,
} from "react-native";
import React, { useState } from "react";
import Colors from "@/constants/Colors";
import { useAppTheme } from "@/hooks/useAppTheme";
import { X } from "lucide-react-native";
import { router } from "expo-router";

type Props = {
  modalVisible: boolean;
  closeModal: () => void;
  slideAnim: Animated.Value;
};

const AddChooseModal = ({ modalVisible, closeModal, slideAnim }: Props) => {
  const { colorScheme } = useAppTheme();

  const handleButton1Press = () => {
    console.log("Button 1 pressed - navigating to create-skill");
    closeModal();
    // Navigate to create skill screen
    try {
      router.push("/create-skill");
      console.log("Navigation successful");
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  const handleButton2Press = () => {
    closeModal();
    // Navigate to AI page
    router.push("/(tabs)/ai");
  };

  return (
    <Modal
      visible={modalVisible}
      transparent={true}
      animationType="none"
      onRequestClose={closeModal}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "flex-end",
          backgroundColor: "rgba(0, 0, 0, 0.7)",
        }}
      >
        <Pressable style={{ flex: 1 }} onPress={closeModal} />
        <Animated.View
          style={[
            {
              backgroundColor: Colors[colorScheme].background,
              paddingBottom: 48,
            },
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
          className="rounded-t-3xl p-4"
        >
          {/* Header mit Close Button */}
          <View
            className="flex-row justify-between items-center"
            style={{ marginBottom: 16 }}
          >
            <Text className="text-xl font-bold text-gray-900">
              Neuen Skill erstellen
            </Text>
            <Pressable
              onPress={closeModal}
              className="p-2 rounded-full bg-gray-100"
            >
              <X size={20} color="#6B7280" />
            </Pressable>
          </View>

          {/* Action Buttons */}
          <View className="gap-4 flex-row">
            <Pressable
              onPress={handleButton1Press}
              className="p-4 rounded-xl flex-1 flex items-center justify-center"
              style={{
                backgroundColor: Colors[colorScheme ?? "light"].onSurface,
              }}
            >
              <Text className="text-black text-center text-lg font-semibold">
                Manuell
              </Text>
            </Pressable>

            <Pressable
              onPress={handleButton2Press}
              className="p-4 rounded-xl flex-1 flex items-center justify-center"
              style={{
                backgroundColor: Colors[colorScheme ?? "light"].onSurface,
              }}
            >
              <Text className="text-black text-center text-lg font-semibold">
                Mit KI
              </Text>
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default AddChooseModal;
