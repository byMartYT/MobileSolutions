import { View } from "react-native";
import React from "react";
import TextGradient from "./TextGradient";
import { Text } from "./Themed";
import clsx from "clsx";

const Title = ({
  children,
  className,
}: {
  children: string;
  className?: string;
}) => {
  const title = children.split(" ");
  const first = title.slice(0, -1).join(" ");
  const last = title[title.length - 1];
  return (
    <View className={clsx("flex flex-row items-center", className)}>
      {first && <Text className="text-4xl font-semibold">{first} </Text>}
      <TextGradient className="text-4xl font-medium">{last}</TextGradient>
    </View>
  );
};

export default Title;
