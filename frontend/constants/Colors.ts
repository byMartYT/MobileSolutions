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
    onSurface: "#F0f0f0",
    onSurfaceLight: "#FFF",
    textGradient: {
      colors: ["#C0B0FF", "#4D3D90"],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 1 },
    },
    successContainer: "rgba(16, 185, 129, 0.1)",
    successContainerText: "#22B959",
  },
  dark: {
    text: "#fff",
    background: "#0f0f0f",
    tint: tintColorLight,
    tintDark: tintColorDark,
    tabIconDefault: "#ccc",
    tabIconSelected: tintColorLight,
    tabBackground: "#111",
    onSurface: "#F0f0f0",
    onSurfaceLight: "#000",
    textGradient: {
      colors: ["#C0B0FF", "#4D3D90"],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 1 },
    },
    successContainer: "rgba(16, 185, 129, 0.2)",
    successContainerText: "#4ade80",
  },
};
