import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { ContactRound, Home, Landmark, Settings2, WalletCards } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppTheme } from "../providers/ThemeProvider";
import { fontFamily } from "../utils/theme";

const tabMeta = {
  Dashboard: { label: "Home", icon: Home },
  Loans: { label: "Loans", icon: Landmark },
  Contacts: { label: "Contacts", icon: ContactRound },
  Expenses: { label: "Expenses", icon: WalletCards },
  SettingsTab: { label: "Settings", icon: Settings2 },
};

export const FloatingTabBar = ({ state, navigation }: BottomTabBarProps) => {
  const { theme } = useAppTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: "absolute",
        left: 24,
        right: 24,
        bottom: Math.max(insets.bottom, 14),
      }}
    >
      <View
        style={[
          {
            minHeight: 64,
            borderRadius: 9999, // Premium capsule outer container
            borderWidth: 1,
            borderColor: theme.border,
            backgroundColor: theme.card,
            padding: 6,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 4,
          },
          theme.shadowElevated,
        ]}
      >
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const meta = tabMeta[route.name as keyof typeof tabMeta] || tabMeta.Dashboard;
          const Icon = meta.icon;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              activeOpacity={0.86}
              accessibilityRole="button"
              accessibilityState={focused ? { selected: true } : {}}
              onPress={onPress}
              style={{
                minHeight: 48,
                flex: focused ? 1.25 : 0.8,
                borderRadius: 9999, // Capsule tab items
                alignItems: "center",
                justifyContent: "center",
                flexDirection: focused ? "row" : "column",
                gap: focused ? 6 : 3,
                backgroundColor: focused ? theme.primary : "transparent",
                shadowColor: focused ? theme.primary : "transparent",
                shadowOpacity: focused ? 0.15 : 0,
                shadowRadius: focused ? 10 : 0,
                shadowOffset: { width: 0, height: 4 },
                elevation: focused ? 3 : 0,
              }}
            >
              <Icon color={focused ? "#000000" : theme.muted} size={focused ? 16 : 18} />
              <Text
                numberOfLines={1}
                style={{
                  color: focused ? "#000000" : theme.muted,
                  fontFamily: fontFamily.medium,
                  fontSize: focused ? 12 : 9,
                  fontWeight: focused ? "600" : "400",
                }}
              >
                {meta.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};
