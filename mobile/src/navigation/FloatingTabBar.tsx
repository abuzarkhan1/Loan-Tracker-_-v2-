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
        left: 18,
        right: 18,
        bottom: Math.max(insets.bottom, 10),
      }}
    >
      <View
        style={[
          {
            minHeight: 64,
            borderRadius: 999,
            borderWidth: 1,
            borderColor: theme.border,
            backgroundColor: theme.card,
            padding: 6,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 6,
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
                minHeight: 50,
                flex: focused ? 1.34 : 0.74,
                borderRadius: 999,
                alignItems: "center",
                justifyContent: "center",
                flexDirection: focused ? "row" : "column",
                gap: focused ? 6 : 3,
                backgroundColor: focused ? theme.primary : "transparent",
                shadowColor: focused ? theme.primaryDark : "transparent",
                shadowOpacity: focused ? 0.22 : 0,
                shadowRadius: focused ? 18 : 0,
                shadowOffset: { width: 0, height: 8 },
                elevation: focused ? 5 : 0,
              }}
            >
              <Icon color={focused ? theme.white : theme.muted} size={focused ? 17 : 18} />
              <Text
                numberOfLines={1}
                style={{
                  color: focused ? theme.white : theme.muted,
                  fontFamily: focused ? fontFamily.extraBold : fontFamily.bold,
                  fontSize: focused ? 11 : 9.5,
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
