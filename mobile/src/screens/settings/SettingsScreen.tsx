import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Constants from "expo-constants";
import {
  ChevronRight,
  DollarSign,
  Fingerprint,
  Info,
  LogOut,
  MoonStar,
  ShieldCheck,
  SlidersHorizontal,
  Tag,
  UserRoundPen,
  type LucideIcon,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import { Switch, Text, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AppButton } from "../../components/AppButton";
import { FormInput } from "../../components/FormInput";
import { Screen } from "../../components/Screen";
import { RootStackParamList } from "../../navigation/types";
import { showAlert } from "../../providers/AlertProvider";
import { useAuth } from "../../providers/AuthProvider";
import { useAppTheme } from "../../providers/ThemeProvider";
import { clearBiometricCredentials, getBiometricAvailability, getSavedBiometricCredentials } from "../../services/biometricAuth";
import { getErrorMessage } from "../../utils/errors";
import { fontFamily } from "../../utils/theme";

const profileSchema = z.object({
  name: z.string().min(2, "Name required").max(80),
  email: z.string().email("Valid email required"),
});

type ProfileValues = z.infer<typeof profileSchema>;
type Navigation = NativeStackNavigationProp<RootStackParamList>;

const initials = (name?: string) => {
  const parts = (name || "User").trim().split(/\s+/).filter(Boolean);
  return parts.slice(0, 2).map((part) => part.charAt(0).toUpperCase()).join("") || "U";
};

const SectionHeader = ({ title, icon: Icon }: { title: string; icon: LucideIcon }) => {
  const { theme } = useAppTheme();

  return (
    <View className="mt-6 flex-row items-center gap-2">
      <Icon color={theme.primary} size={14} />
      <Text style={{ color: theme.text, fontFamily: fontFamily.semiBold, fontSize: 12, letterSpacing: 0 }}>
        {title}
      </Text>
    </View>
  );
};

const SettingsGroup = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useAppTheme();

  return (
    <View
      className="mt-3 rounded-3xl border px-4"
      style={[
        { borderColor: theme.border, backgroundColor: theme.card },
        theme.shadowSoft,
      ]}
    >
      {children}
    </View>
  );
};

const SettingsRow = ({
  title,
  subtitle,
  value,
  icon: Icon,
  danger,
  onPress,
  showDivider = true,
  switchValue,
  onSwitchChange,
}: {
  title: string;
  subtitle?: string;
  value?: string;
  icon: LucideIcon;
  danger?: boolean;
  onPress?: () => void;
  showDivider?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
}) => {
  const { theme } = useAppTheme();
  const color = danger ? theme.danger : theme.text;

  return (
    <TouchableOpacity activeOpacity={onPress ? 0.86 : 1} onPress={onPress} disabled={!onPress}>
      <View className="flex-row items-center gap-3 py-4">
        <View
          style={{
            height: 36,
            width: 36,
            borderRadius: 8,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: danger ? theme.peach : theme.surface,
          }}
        >
          <Icon color={danger ? theme.danger : theme.muted} size={17} />
        </View>
        <View className="min-w-0 flex-1">
          <Text numberOfLines={1} style={{ color, fontFamily: fontFamily.semiBold, fontSize: 15 }}>
            {title}
          </Text>
          {subtitle ? (
            <Text numberOfLines={1} style={{ color: theme.muted, fontFamily: fontFamily.regular, fontSize: 13, marginTop: 3 }}>
              {subtitle}
            </Text>
          ) : null}
        </View>
        {typeof switchValue === "boolean" && onSwitchChange ? (
          <Switch
            value={switchValue}
            onValueChange={onSwitchChange}
            trackColor={{ false: theme.border, true: theme.primary }}
            thumbColor={theme.white}
          />
        ) : (
          <>
            {value ? (
              <Text style={{ color: theme.muted, fontFamily: fontFamily.regular, fontSize: 13 }}>
                {value}
              </Text>
            ) : null}
            {onPress ? <ChevronRight color={danger ? theme.danger : theme.muted} size={18} /> : null}
          </>
        )}
      </View>
      {showDivider ? <View style={{ height: 1, backgroundColor: theme.border, marginLeft: 49 }} /> : null}
    </TouchableOpacity>
  );
};

export const SettingsScreen = () => {
  const { user, logout, updateProfile } = useAuth();
  const { theme, mode, toggleMode } = useAppTheme();
  const navigation = useNavigation<Navigation>();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [biometricLabel, setBiometricLabel] = useState("Biometric");
  const [savedBiometricEmail, setSavedBiometricEmail] = useState<string | null>(null);
  const profileGradient = ["#141414", "#0a0a0a"] as const;
  const profileBorder = "rgba(255, 255, 255, 0.08)";
  const profileSecondaryText = "rgba(255, 255, 255, 0.5)";

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });

  useEffect(() => {
    reset({
      name: user?.name || "",
      email: user?.email || "",
    });
  }, [reset, user]);

  useEffect(() => {
    let mounted = true;

    const loadBiometricState = async () => {
      const [availability, credentials] = await Promise.all([
        getBiometricAvailability(),
        getSavedBiometricCredentials(),
      ]);

      if (!mounted) return;

      setBiometricAvailable(availability.canUseBiometric);
      setBiometricLabel(availability.label);
      setSavedBiometricEmail(credentials?.email || null);
      setBiometricEnabled(Boolean(credentials));
    };

    void loadBiometricState();

    return () => {
      mounted = false;
    };
  }, []);

  const profileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["me"] });
      setIsEditing(false);
    },
  });

  const handleLogout = async () => {
    queryClient.clear();
    await logout();
  };

  const handleBiometricToggle = async (nextValue: boolean) => {
    if (!nextValue) {
      await clearBiometricCredentials();
      setBiometricEnabled(false);
      setSavedBiometricEmail(null);
      return;
    }

    if (!biometricAvailable) {
      showAlert({
        title: "Biometric not available",
        message: "This device does not have enrolled biometrics yet.",
        buttons: [{ text: "OK" }],
      });
      return;
    }

    if (!savedBiometricEmail) {
      showAlert({
        title: "Login once first",
        message: "Logout, login with email/password once, and keep quick login enabled. After that this switch will stay on.",
        buttons: [{ text: "OK" }],
      });
      return;
    }

    setBiometricEnabled(true);
  };

  return (
    <Screen className="pt-1">
      <View className="flex-row items-start justify-between gap-4">
        <View className="flex-1">
          <Text style={{ color: theme.muted, fontFamily: fontFamily.regular, fontSize: 13 }}>ترتیبات</Text>
          <Text style={{ color: theme.text, fontFamily: fontFamily.bold, fontSize: 32, lineHeight: 40, marginTop: 2 }}>Settings</Text>
        </View>
      </View>

      <LinearGradient
        className="mt-5 overflow-hidden rounded-3xl"
        colors={profileGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          borderWidth: 1,
          borderColor: profileBorder,
          padding: 24,
          shadowColor: theme.mode === "dark" ? "#000000" : theme.secondary,
          shadowOpacity: theme.mode === "dark" ? 0.5 : 0.14,
          shadowRadius: theme.mode === "dark" ? 16 : 24,
          shadowOffset: { width: 0, height: theme.mode === "dark" ? 4 : 12 },
          elevation: theme.mode === "dark" ? 8 : 7,
        }}
      >
        <View className="flex-row items-center gap-4">
          <View
            style={{
              height: 54,
              width: 54,
              borderRadius: 999,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(255,255,255,0.17)",
            }}
          >
            <Text style={{ color: theme.white, fontFamily: fontFamily.bold, fontSize: 20 }}>
              {initials(user?.name)}
            </Text>
          </View>
          <View className="min-w-0 flex-1">
            <Text numberOfLines={1} style={{ color: theme.white, fontFamily: fontFamily.semiBold, fontSize: 20 }}>
              {user?.name || "User"}
            </Text>
            <Text numberOfLines={1} style={{ color: profileSecondaryText, fontFamily: fontFamily.regular, fontSize: 13, marginTop: 5 }}>
              {user?.email || "No email"}
            </Text>
          </View>
        </View>

        {isEditing ? (
          <View className="mt-4 gap-3 rounded-3xl bg-card p-4">
            <FormInput control={control} name="name" label="Name" placeholder="Your name" error={errors.name?.message} />
            <FormInput
              control={control}
              name="email"
              label="Email"
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="you@example.com"
              error={errors.email?.message}
            />
            {profileMutation.isError ? (
              <Text className="text-sm font-semibold text-danger">{getErrorMessage(profileMutation.error)}</Text>
            ) : null}
            <View className="flex-row gap-3">
              <View className="flex-1">
                <AppButton
                  title="Cancel"
                  variant="secondary"
                  onPress={() => {
                    reset({ name: user?.name || "", email: user?.email || "" });
                    setIsEditing(false);
                  }}
                />
              </View>
              <View className="flex-1">
                <AppButton
                  title="Save"
                  loading={profileMutation.isPending}
                  onPress={handleSubmit((values) => profileMutation.mutate(values))}
                />
              </View>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            activeOpacity={0.86}
            onPress={() => setIsEditing(true)}
            className="mt-4 flex-row items-center justify-center gap-2 bg-white py-3"
            style={{ borderRadius: 6 }}
          >
            <UserRoundPen color={theme.primary} size={16} />
            <Text style={{ color: theme.primary, fontFamily: fontFamily.medium, fontSize: 14 }}>Edit Profile</Text>
          </TouchableOpacity>
        )}
      </LinearGradient>

      <SectionHeader title="APP SETTINGS" icon={SlidersHorizontal} />
      <SettingsGroup>
        <SettingsRow title="Theme" subtitle={mode === "dark" ? "Dark mode" : "Light mode"} icon={MoonStar} switchValue={mode === "dark"} onSwitchChange={() => void toggleMode()} />
        <SettingsRow title="Currency" subtitle="Karansi" value="PKR — Rs" icon={DollarSign} />
        <SettingsRow title="Categories" subtitle="Income aur expense categories" icon={Tag} onPress={() => navigation.navigate("Categories")} showDivider={false} />
      </SettingsGroup>

      <SectionHeader title="QUICK LOGIN" icon={ShieldCheck} />
      <SettingsGroup>
        <SettingsRow
          title={`${biometricLabel} Login`}
          subtitle={savedBiometricEmail ? `Saved for ${savedBiometricEmail}` : "Login once with quick login enabled"}
          icon={Fingerprint}
          switchValue={biometricEnabled}
          onSwitchChange={(value) => void handleBiometricToggle(value)}
          showDivider={false}
        />
      </SettingsGroup>

      <SectionHeader title="ABOUT" icon={Info} />
      <SettingsGroup>
        <SettingsRow title="Version" icon={Info} value={Constants.expoConfig?.version || "1.0.0"} showDivider={false} />
      </SettingsGroup>

      <TouchableOpacity
        activeOpacity={0.86}
        onPress={handleLogout}
        className="mt-7 flex-row items-center justify-center gap-2 border py-3"
        style={{ borderColor: theme.primary, borderRadius: 6 }}
      >
        <LogOut color={theme.primary} size={17} />
        <Text style={{ color: theme.primary, fontFamily: fontFamily.medium, fontSize: 14 }}>Logout</Text>
      </TouchableOpacity>
    </Screen>
  );
};
