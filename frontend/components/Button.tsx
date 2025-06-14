import { View, Text, Pressable } from "react-native";
import React, { Children } from "react";

type Props = {
  children: string;
  onPress: () => void;
} & React.ComponentProps<typeof Pressable>;

export default function Button({ onPress, children, ...props }: Props) {
  return (
    <Pressable
      className="bg-white flex items-center justify-center px-4 py-3 rounded-full"
      onPress={onPress}
      {...props}
    >
      <Text>{children}</Text>
    </Pressable>
  );
}
