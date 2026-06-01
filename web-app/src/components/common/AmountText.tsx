import React from "react";
import { formatCurrency } from "../../lib/formatCurrency";
import { cn } from "../../lib/cn";

interface AmountTextProps {
  amount: number;
  className?: string;
  currencyClassName?: string;
  hideMask?: string;
}

export const AmountText: React.FC<AmountTextProps> = ({
  amount,
  className,
}) => {
  return (
    <span className={cn("font-sans tabular-nums select-all", className)}>
      {formatCurrency(amount)}
    </span>
  );
};

export default AmountText;
