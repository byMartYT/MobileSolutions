import { useColorScheme } from "react-native";
import { useMemo } from "react";
import Colors from "@/constants/Colors";

/**
 * Custom Hook, der das Systemfarbschema erkennt und das entsprechende Theme zurückgibt
 * @param overrideColorScheme Optional: Überschreibt das Systemfarbschema
 * @returns Das aktuelle Theme aus Colors
 */
export function useAppTheme(overrideColorScheme?: "light" | "dark") {
  const systemColorScheme = useColorScheme();

  // Nutze das übergebene Schema oder das Systemschema, mit Fallback auf 'light'
  const colorScheme = overrideColorScheme || systemColorScheme || "light";

  // Verwende useMemo, um den Themewert nur neu zu berechnen, wenn sich colorScheme ändert
  const theme = useMemo(() => {
    return Colors[colorScheme];
  }, [colorScheme]);

  return {
    theme,
    colorScheme,
    isDark: colorScheme === "dark",
    isLight: colorScheme === "light",
  };
}
