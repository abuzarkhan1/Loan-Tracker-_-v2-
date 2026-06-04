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
      <Text style={{ color: theme.text, fontFamily: fontFamily.extraBold, fontSize: 12, letterSpacing: 0 }}>
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
            borderRadius: 12,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: danger ? theme.peach : theme.backgroundSoft,
          }}
        >
          <Icon color={danger ? theme.danger : theme.muted} size={17} />
        </View>
        <View className="min-w-0 flex-1">
          <Text numberOfLines={1} style={{ color, fontFamily: fontFamily.bold, fontSize: 14 }}>
            {title}
          </Text>
          {subtitle ? (
            <Text numberOfLines={1} style={{ color: theme.muted, fontFamily: fontFamily.medium, fontSize: 11.5, marginTop: 3 }}>
              {subtitle}
            </Text>
          ) : null}
        </View>
        {typeof switchValue === "boolean" && onSwitchChange ? (
          <Switch
            value={switchValue}
            onValueChange={onSwitchChange}
            trackColor={{ false: "rgba(111,101,119,0.25)", true: theme.primary }}
            thumbColor={theme.white}
          />
        ) : (
          <>
            {value ? (
              <Text style={{ color: theme.muted, fontFamily: fontFamily.medium, fontSize: 12.5 }}>
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
          <Text style={{ color: theme.muted, fontFamily: fontFamily.medium, fontSize: 11 }}>ترتیبات</Text>
          <Text style={{ color: theme.text, fontFamily: fontFamily.extraBold, fontSize: 28, marginTop: 4 }}>Settings</Text>
        </View>
      </View>

      <View
        className="mt-5 overflow-hidden rounded-3xl"
        style={{
          backgroundColor: theme.primary,
          padding: 18,
          shadowColor: theme.primaryDark,
          shadowOpacity: 0.18,
          shadowRadius: 20,
          shadowOffset: { width: 0, height: 10 },
          elevation: 6,
        }}
      >
        <View className="flex-row items-center gap-4">
          <View
            style={{
              height: 54,
              width: 54,
              borderRadius: 16,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(255,255,255,0.17)",
            }}
          >
            <Text style={{ color: theme.white, fontFamily: fontFamily.extraBold, fontSize: 20 }}>
              {initials(user?.name)}
            </Text>
          </View>
          <View className="min-w-0 flex-1">
            <Text numberOfLines={1} style={{ color: theme.white, fontFamily: fontFamily.extraBold, fontSize: 18 }}>
              {user?.name || "User"}
            </Text>
            <Text numberOfLines={1} style={{ color: "rgba(255,255,255,0.82)", fontFamily: fontFamily.medium, fontSize: 12.5, marginTop: 5 }}>
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
            className="mt-4 flex-row items-center justify-center gap-2 rounded-2xl bg-white py-3"
          >
            <UserRoundPen color={theme.primary} size={16} />
            <Text style={{ color: theme.primary, fontFamily: fontFamily.extraBold, fontSize: 13 }}>Edit Profile</Text>
          </TouchableOpacity>
        )}
      </View>

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
        className="mt-7 flex-row items-center justify-center gap-2 rounded-2xl border py-4"
        style={{ borderColor: theme.primary }}
      >
        <LogOut color={theme.primary} size={17} />
        <Text style={{ color: theme.primary, fontFamily: fontFamily.extraBold, fontSize: 14 }}>Logout</Text>
      </TouchableOpacity>
    </Screen>
  );
};
