import { View, Text } from "react-native";
import React from "react";

type IconBoxProps = {
  icon: string;
};

const IconBox = ({ icon }: IconBoxProps) => {
  return (
    <View>
      <Text>IconBox</Text>
    </View>
  );
};

export default IconBox;
