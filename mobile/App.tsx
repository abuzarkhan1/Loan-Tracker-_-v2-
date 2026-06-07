import "./global.css";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  useFonts,
} from "@expo-google-fonts/inter";
import { FiraCode_400Regular } from "@expo-google-fonts/fira-code";
import { StatusBar } from "expo-status-bar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { Text, TextInput, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "./src/providers/AuthProvider";
import { ThemeProvider, useAppTheme } from "./src/providers/ThemeProvider";
import { AlertProvider } from "./src/providers/AlertProvider";
import { RootNavigator } from "./src/navigation/RootNavigator";
import { fontFamily } from "./src/utils/theme";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

const configureDefaultFonts = () => {
  const textDefaultProps = (Text as unknown as { defaultProps?: Record<string, unknown> }).defaultProps || {};
  const inputDefaultProps = (TextInput as unknown as { defaultProps?: Record<string, unknown> }).defaultProps || {};

  (Text as unknown as { defaultProps: Record<string, unknown> }).defaultProps = {
    ...textDefaultProps,
    style: [{ fontFamily: fontFamily.medium }, textDefaultProps.style],
  };

  (TextInput as unknown as { defaultProps: Record<string, unknown> }).defaultProps = {
    ...inputDefaultProps,
    style: [{ fontFamily: fontFamily.medium }, inputDefaultProps.style],
  };
};

const ThemedStatusBar = () => {
  const { mode } = useAppTheme();
  return <StatusBar style={mode === "dark" ? "light" : "dark"} />;
};

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    FiraCode_400Regular,
  });

  useEffect(() => {
    if (fontsLoaded) {
      configureDefaultFonts();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return <View className="flex-1 bg-background" />;
  }

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AlertProvider>
            <AuthProvider>
              <ThemedStatusBar />
              <RootNavigator />
            </AuthProvider>
          </AlertProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
