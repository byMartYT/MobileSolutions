import { View, Text } from "react-native";
import React from "react";
import * as LucideIcons from "lucide-react-native";
import clsx from "clsx";
import Colors from "@/constants/Colors";
import { useAppTheme } from "@/hooks/useAppTheme";

type IconBoxProps = {
  icon: string;
  color: string;
  small?: boolean;
};

const IconBox = ({ icon, color, small = false }: IconBoxProps) => {
  const { theme } = useAppTheme();

  // Convert icon name to PascalCase (e.g., "laptop" -> "Laptop")
  const convertToPascalCase = (str: string) => {
    return str
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join("");
  };

  const iconName = convertToPascalCase(icon);
  const IconComponent = (LucideIcons as any)[iconName];

  // Fallback to a default icon if the icon is not found
  const FinalIconComponent = IconComponent || (LucideIcons as any).Star;

  return (
    <View
      className={clsx(
        "flex items-center justify-center rounded-full",
        !small ? "size-[62]" : "size-[46]"
      )}
      style={{
        backgroundColor: `hsl(${extractHueFromHsl(color)}, 100%, 79%)`,
        borderColor: theme.background,
        borderWidth: 5,
      }}
    >
      <FinalIconComponent
        color={`hsl(${extractHueFromHsl(color)}, 88%, 26%)`}
        size={!small ? 28 : 22}
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
