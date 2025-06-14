import { View, Text, Pressable } from "react-native";
import React from "react";

type Props = {
  text: string;
  onPress: () => void;
} & React.ComponentProps<typeof Pressable>;

export default function Button({ text, onPress, ...props }: Props) {
  return (
    <Pressable
      className="bg-white flex items-center justify-center px-4 py-3 rounded-full"
      onPress={onPress}
      {...props}
    >
      <Text>{text}</Text>
    </Pressable>
  );
}
