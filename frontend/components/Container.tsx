import { View, Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "expo-router";

const Container = ({
  children,
  isHeaderShown = false,
}: {
  children: React.ReactNode;
  isHeaderShown?: boolean;
}) => {
  if (!isHeaderShown) {
    return (
      <SafeAreaView>
        <View className="px-5 py-2.5">{children}</View>
      </SafeAreaView>
    );
  } else {
    return <View className="px-5 py-2.5">{children}</View>;
  }
};

export default Container;
