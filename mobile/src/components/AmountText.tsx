import { Text, TextProps } from "react-native";
import { formatCurrency } from "../utils/format";

type AmountTextProps = TextProps & {
  amount?: number;
  value?: string;
  prefix?: string;
  suffix?: string;
  hiddenLabel?: string;
};

export const AmountText = ({
  amount,
  value,
  prefix = "",
  suffix = "",
  children,
  ...props
}: AmountTextProps) => {
  const display = value || (amount !== undefined ? `${prefix}${formatCurrency(amount)}${suffix}` : children);
  return <Text {...props}>{display}</Text>;
};
