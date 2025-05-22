import { View, Text } from "react-native";
import React from "react";
import * as LucideIcons from "lucide-react-native";
import clsx from "clsx";
import Colors from "@/constants/Colors";
import { useAppTheme } from "@/hooks/useAppTheme";

type IconBoxProps = {
  icon: string;
  color: string;
};

const IconBox = ({ icon, color }: IconBoxProps) => {
  const { theme } = useAppTheme();

  const IconComponent = (LucideIcons as any)[icon];
  return (
    <View
      className={clsx(
        "size-[62] flex items-center justify-center rounded-full"
      )}
      style={{
        backgroundColor: `hsl(${extractHueFromHsl(color)}, 100%, 79%)`,
        borderColor: theme.background,
        borderWidth: 5,
      }}
    >
      <IconComponent
        color={`hsl(${extractHueFromHsl(color)}, 88%, 26%)`}
        size={28}
        strokeWidth={2}
      />
    </View>
  );
};

export default IconBox;

/**
 * Extrahiert den Hue-Wert (erste Zahl) aus einem HSL-Farbwert
 * @param hslString - Der HSL-Farbwert als String (z.B. "hsl(180, 64%, 62%)")
 * @returns Die erste Zahl im HSL-String oder 0, wenn keine Zahl gefunden wurde
 */
const extractHueFromHsl = (hslString: string): number => {
  // Regulärer Ausdruck um die erste Zahl nach der öffnenden Klammer zu finden
  const match = hslString.match(/\((\d+)/);

  // Wenn ein Match gefunden wurde, konvertiere den String zu einer Zahl
  if (match && match[1]) {
    return parseInt(match[1], 10);
  }

  // Fallback, wenn keine Zahl gefunden wurde
  return 0;
};
