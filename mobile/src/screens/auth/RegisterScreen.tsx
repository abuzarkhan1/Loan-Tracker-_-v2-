import { zodResolver } from "@hookform/resolvers/zod";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Text, TouchableOpacity, View } from "react-native";
import { z } from "zod";
import { AppButton } from "../../components/AppButton";
import { BrandLogo } from "../../components/BrandLogo";
import { FormInput } from "../../components/FormInput";
import { Screen } from "../../components/Screen";
import { AuthStackParamList } from "../../navigation/types";
import { useAuth } from "../../providers/AuthProvider";
import { useAppTheme } from "../../providers/ThemeProvider";
import { getErrorMessage } from "../../utils/errors";
import { fontFamily } from "../../utils/theme";

const schema = z.object({
  name: z.string().min(2, "Name required"),
  email: z.string().email("Valid email required"),
  password: z.string().min(6, "At least 6 characters"),
});

type FormValues = z.infer<typeof schema>;
type Props = NativeStackScreenProps<AuthStackParamList, "Register">;

export const RegisterScreen = ({ navigation }: Props) => {
  const { register } = useAuth();
  const { theme } = useAppTheme();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const mutation = useMutation({
    mutationFn: register,
  });

  return (
    <Screen className="justify-center pt-16 bg-black" refreshable={false}>
      <View className="mb-10 items-center gap-4">
        {/* Premium Badge instead of Logo */}
        <View 
          className="rounded-full border px-4 py-1.5" 
          style={{ borderColor: "rgba(255, 255, 255, 0.12)", backgroundColor: "rgba(255, 255, 255, 0.05)" }}
        >
          <Text style={{ color: "rgba(255, 255, 255, 0.8)", fontFamily: fontFamily.bold, fontSize: 10, letterSpacing: 2.5, textTransform: "uppercase" }}>
            Premium
          </Text>
        </View>
        <View className="items-center">
          <Text className="text-3.5xl font-bold text-white tracking-tight">Create Account</Text>
          <Text className="mt-2 text-center text-[14px] font-light leading-relaxed text-white/50">
            Apni lending aur borrowing ko clean tareeqe se track karein.
          </Text>
        </View>
      </View>

      <View className="gap-4 rounded-3xl border border-border bg-card p-6" style={theme.shadowSoft}>
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
        <FormInput
          control={control}
          name="password"
          label="Password"
          secureTextEntry
          placeholder="Password"
          error={errors.password?.message}
        />
        {mutation.isError ? (
          <Text className="text-sm font-semibold text-danger">{getErrorMessage(mutation.error)}</Text>
        ) : null}
        <AppButton
          title="Register"
          onPress={handleSubmit((values) => mutation.mutate(values))}
          loading={mutation.isPending}
        />
      </View>

      <TouchableOpacity className="mt-6 items-center" onPress={() => navigation.navigate("Login")}>
        <Text style={{ fontFamily: fontFamily.medium, fontSize: 14, color: "rgba(255, 255, 255, 0.45)" }}>
          Already have an account? <Text style={{ color: "#ffffff", fontFamily: fontFamily.bold }}>Login</Text>
        </Text>
      </TouchableOpacity>
    </Screen>
  );
};
