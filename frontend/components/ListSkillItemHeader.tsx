import { View, Text } from "react-native";
import React from "react";
import IconBox from "./IconBox";
import Colors from "@/constants/Colors";
import { useAppTheme } from "@/hooks/useAppTheme";

type Props = {
  text: string;
  color: string;
  icon: string;
};

const ListSkillItemHeader = (data: Props) => {
  const { colorScheme } = useAppTheme();
  const { text, ...rest } = data;
  return (
    <View className="relative flex flex-row items-center justify-between gap-3 w-full">
      <View
        className="absolute w-full top-1/2 left-0 h-[2px]"
        style={{ backgroundColor: data.color }}
      />
      <Text
        className="bg-white px-2 ml-3 text-xl font-semibold"
        style={{
          backgroundColor: Colors[colorScheme].background,
          color: data.color,
        }}
      >
        {text}
      </Text>
      <IconBox {...rest} />
    </View>
  );
};

export default ListSkillItemHeader;
