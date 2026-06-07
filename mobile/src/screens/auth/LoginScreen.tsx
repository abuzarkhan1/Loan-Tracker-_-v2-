import { zodResolver } from "@hookform/resolvers/zod";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useMutation } from "@tanstack/react-query";
import { Fingerprint, ShieldCheck } from "lucide-react-native";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Text, TouchableOpacity, View } from "react-native";
import { z } from "zod";
import { AuthStackParamList } from "../../navigation/types";
import { useAuth } from "../../providers/AuthProvider";
import { useAppTheme } from "../../providers/ThemeProvider";
import { AppButton } from "../../components/AppButton";
import { BrandLogo } from "../../components/BrandLogo";
import { FormInput } from "../../components/FormInput";
import { Screen } from "../../components/Screen";
import { getErrorMessage } from "../../utils/errors";
import {
  authenticateAndGetSavedCredentials,
  clearBiometricCredentials,
  getBiometricAvailability,
  getSavedBiometricCredentials,
  saveBiometricCredentials,
} from "../../services/biometricAuth";
import { fontFamily } from "../../utils/theme";

const schema = z.object({
  email: z.string().email("Valid email required"),
  password: z.string().min(1, "Password required"),
});

type FormValues = z.infer<typeof schema>;
type Props = NativeStackScreenProps<AuthStackParamList, "Login">;

export const LoginScreen = ({ navigation }: Props) => {
  const { login } = useAuth();
  const { theme } = useAppTheme();
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricLabel, setBiometricLabel] = useState("Biometric");
  const [rememberBiometric, setRememberBiometric] = useState(true);
  const [savedEmail, setSavedEmail] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      await login(values);
      if (biometricAvailable && rememberBiometric) {
        await saveBiometricCredentials(values);
        setSavedEmail(values.email.trim().toLowerCase());
      }
    },
  });

  const biometricMutation = useMutation({
    mutationFn: async () => {
      const credentials = await authenticateAndGetSavedCredentials();
      if (!credentials) return;
      await login({ email: credentials.email, password: credentials.password });
    },
  });

  useEffect(() => {
    let mounted = true;

    const loadBiometricState = async () => {
      try {
        const [availability, credentials] = await Promise.all([
          getBiometricAvailability(),
          getSavedBiometricCredentials(),
        ]);

        if (!mounted) return;

        setBiometricAvailable(availability.canUseBiometric);
        setBiometricLabel(availability.label);
        if (credentials?.email) {
          setSavedEmail(credentials.email);
          setValue("email", credentials.email);
        }
      } catch {
        if (!mounted) return;
        setBiometricAvailable(false);
      }
    };

    void loadBiometricState();

    return () => {
      mounted = false;
    };
  }, [setValue]);

  const resetSavedLogin = async () => {
    await clearBiometricCredentials();
    setSavedEmail(null);
  };

  return (
    <Screen className="justify-center pt-16" refreshable={false}>
      <View className="mb-10 items-center gap-4">
        <BrandLogo size={72} />
        <View className="items-center">
          <Text className="text-3xl font-bold text-dark">Loan Tracker</Text>
          <Text className="mt-2 text-center text-[15px] font-normal leading-6 text-muted">
            Raqam, contacts, aur payments ek jagah.
          </Text>
        </View>
      </View>

      {biometricAvailable && savedEmail ? (
        <View
          className="mb-4 rounded-3xl border p-4"
          style={{ backgroundColor: theme.card, borderColor: theme.border, ...theme.shadowSoft }}
        >
          <AppButton
            title={`Login with ${biometricLabel}`}
            icon={Fingerprint}
            variant="secondary"
            loading={biometricMutation.isPending}
            onPress={() => biometricMutation.mutate()}
          />
          <View className="mt-3 flex-row items-center justify-between gap-3">
            <Text numberOfLines={1} style={{ color: theme.muted, fontFamily: fontFamily.regular, fontSize: 13, flex: 1 }}>
              Saved for {savedEmail}
            </Text>
            <TouchableOpacity activeOpacity={0.82} onPress={resetSavedLogin}>
              <Text style={{ color: theme.primary, fontFamily: fontFamily.medium, fontSize: 13 }}>
                Remove
              </Text>
            </TouchableOpacity>
          </View>
          {biometricMutation.isError ? (
            <Text className="mt-3 text-sm font-semibold text-danger">{getErrorMessage(biometricMutation.error)}</Text>
          ) : null}
        </View>
      ) : null}

      <View className="gap-4 rounded-3xl border border-border bg-card p-6" style={theme.shadowSoft}>
        <FormInput
          control={control}
          name="email"
          label="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="you@example.com"
          error={errors.email?.message}
        />
        <FormInput
          control={control}
          name="password"
          label="Password"
          secureTextEntry
          placeholder="Password"
          error={errors.password?.message}
        />
        {biometricAvailable ? (
          <TouchableOpacity
            activeOpacity={0.86}
            onPress={() => setRememberBiometric((value) => !value)}
            className="flex-row items-center gap-3 rounded-2xl border px-3.5 py-3"
            style={{
              borderColor: rememberBiometric ? theme.primary : theme.border,
              backgroundColor: rememberBiometric ? theme.surface : theme.backgroundSoft,
            }}
          >
            <View
              style={{
                height: 32,
                width: 32,
                borderRadius: 8,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: rememberBiometric ? theme.primary : theme.pill,
              }}
            >
              <ShieldCheck color={rememberBiometric ? theme.white : theme.muted} size={16} strokeWidth={2.5} />
            </View>
            <View className="flex-1">
              <Text style={{ color: theme.text, fontFamily: fontFamily.semiBold, fontSize: 15 }}>
                Enable quick login
              </Text>
              <Text style={{ color: theme.muted, fontFamily: fontFamily.regular, fontSize: 13, marginTop: 2 }}>
                Use {biometricLabel} next time instead of typing again.
              </Text>
            </View>
          </TouchableOpacity>
        ) : null}
        {mutation.isError ? (
          <Text className="text-sm font-semibold text-danger">{getErrorMessage(mutation.error)}</Text>
        ) : null}
        <AppButton title="Login" onPress={handleSubmit((values) => mutation.mutate(values))} loading={mutation.isPending} />
      </View>

      <TouchableOpacity className="mt-6 items-center" onPress={() => navigation.navigate("Register")}>
        <Text className="text-sm font-normal text-muted">
          New here? <Text style={{ color: theme.primary }}>Create account</Text>
        </Text>
      </TouchableOpacity>
    </Screen>
  );
};
