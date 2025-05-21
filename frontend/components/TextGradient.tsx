import { Text, TextProps, useColorScheme } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import Colors from "@/constants/Colors";

type Props = {
  className?: string;
} & TextProps;

const TextGradient = (props: Props) => {
  const colorScheme = useColorScheme();

  return (
    <MaskedView maskElement={<Text {...props} className={props.className} />}>
      <LinearGradient
        colors={Colors[colorScheme ?? "light"].textGradient.colors as any}
        start={Colors[colorScheme ?? "light"].textGradient.start}
        end={Colors[colorScheme ?? "light"].textGradient.end}
      >
        <Text
          {...props}
          className={props.className}
          style={[props.style, { opacity: 0 }]}
        />
      </LinearGradient>
    </MaskedView>
  );
};

export default TextGradient;
