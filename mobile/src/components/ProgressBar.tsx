import { View } from "react-native";
import { useAppTheme } from "../providers/ThemeProvider";

export const ProgressBar = ({ progress }: { progress: number }) => {
  const { theme } = useAppTheme();

  return (
    <View style={{ height: 6, overflow: "hidden", borderRadius: 999, backgroundColor: theme.surface }}>
      <View
        style={{
          height: "100%",
          borderRadius: 999,
          backgroundColor: theme.primary,
          width: `${Math.min(100, Math.max(0, progress))}%`,
        }}
      />
    </View>
  );
};
