import { useState } from "react";
import { Controller, Control, FieldValues, Path } from "react-hook-form";
import { Text, TextInput, TextInputProps, View } from "react-native";
import { useAppTheme } from "../providers/ThemeProvider";
import { fontFamily } from "../utils/theme";

type FormInputProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  error?: string;
} & TextInputProps;

export const FormInput = <T extends FieldValues>({
  control,
  name,
  label,
  error,
  ...inputProps
}: FormInputProps<T>) => {
  const { theme } = useAppTheme();
  const [focused, setFocused] = useState(false);
  const {
    autoCorrect,
    blurOnSubmit,
    multiline,
    onBlur: inputOnBlur,
    onChangeText: inputOnChangeText,
    onFocus: inputOnFocus,
    returnKeyType,
    style: inputStyle,
    ...restInputProps
  } = inputProps;

  return (
    <View style={{ gap: 4 }}>
      <Text style={{ color: theme.text, fontFamily: fontFamily.medium, fontSize: 13 }}>{label}</Text>
      <Controller
        control={control}
        name={name}
        render={({ field: { onBlur, onChange, value } }) => (
          <TextInput
            {...restInputProps}
            autoCorrect={autoCorrect ?? false}
            blurOnSubmit={multiline ? false : blurOnSubmit}
            multiline={multiline}
            returnKeyType={returnKeyType ?? (multiline ? "default" : "done")}
            style={[
              {
                minHeight: multiline ? 104 : 40,
                borderRadius: 6,
                borderWidth: focused || error ? 2 : 1,
                borderColor: error ? theme.danger : focused ? theme.primary : theme.border,
                backgroundColor: theme.input,
                color: theme.text,
                fontFamily: fontFamily.regular,
                fontSize: 15,
                paddingHorizontal: 12,
                paddingVertical: multiline ? 12 : 0,
                textAlignVertical: multiline ? "top" : "center",
              },
              focused ? { shadowColor: theme.primary, shadowOpacity: 0.18, shadowRadius: 6, shadowOffset: { width: 0, height: 0 }, elevation: 2 } : null,
              inputStyle,
            ]}
            placeholderTextColor={theme.placeholder}
            value={value === undefined || value === null ? "" : String(value)}
            onBlur={(event) => {
              setFocused(false);
              onBlur();
              inputOnBlur?.(event);
            }}
            onFocus={(event) => {
              setFocused(true);
              inputOnFocus?.(event);
            }}
            onChangeText={(text) => {
              onChange(text);
              inputOnChangeText?.(text);
            }}
          />
        )}
      />
      {error ? <Text style={{ color: theme.danger, fontFamily: fontFamily.regular, fontSize: 12 }}>{error}</Text> : null}
    </View>
  );
};
