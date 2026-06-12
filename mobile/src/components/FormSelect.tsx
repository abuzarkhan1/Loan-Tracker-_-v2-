import { Text, TouchableOpacity, View } from "react-native";
import { useAppTheme } from "../providers/ThemeProvider";
import { fontFamily } from "../utils/theme";

type Option<T extends string> = {
  label: string;
  value: T;
};

type FormSelectProps<T extends string> = {
  label: string;
  value?: T;
  options: Option<T>[];
  onChange: (value: T) => void;
  error?: string;
};

export const FormSelect = <T extends string>({ label, value, options, onChange, error }: FormSelectProps<T>) => {
  const { theme } = useAppTheme();

  return (
    <View style={{ gap: 8 }}>
      <Text style={{ color: theme.text, fontFamily: fontFamily.medium, fontSize: 13 }}>{label}</Text>
      <View className="flex-row flex-wrap gap-2">
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <TouchableOpacity
              key={option.value}
              activeOpacity={0.85}
              onPress={() => onChange(option.value)}
              style={{
                borderRadius: 6,
                borderWidth: 1,
                borderColor: selected ? theme.primary : theme.border,
                backgroundColor: selected ? theme.primary : theme.pill,
                paddingHorizontal: 12,
                paddingVertical: 7,
              }}
            >
              <Text style={{ color: selected ? "#000000" : theme.muted, fontFamily: fontFamily.medium, fontSize: 13 }}>
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {error ? <Text style={{ color: theme.danger, fontFamily: fontFamily.regular, fontSize: 12 }}>{error}</Text> : null}
    </View>
  );
};
