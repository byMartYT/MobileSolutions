import { LinearGradient } from "expo-linear-gradient";

const tintColorLight = "#C0B0FF";
const tintColorDark = "#4D3D90";

export default {
  light: {
    text: "#000",
    background: "#F8F8F8",
    tint: tintColorLight,
    tintDark: tintColorDark,
    tabIconDefault: "#ccc",
    tabIconSelected: tintColorLight,
    tabBackground: "#F5F5F5",
    textGradient: {
      colors: ["#C0B0FF", "#4D3D90"],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 1 },
    },
  },
  dark: {
    text: "#fff",
    background: "#000",
    tint: tintColorLight,
    tintDark: tintColorDark,
    tabIconDefault: "#ccc",
    tabIconSelected: tintColorLight,
    tabBackground: "#111",
    textGradient: {
      colors: ["#C0B0FF", "#4D3D90"],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 1 },
    },
  },
};
