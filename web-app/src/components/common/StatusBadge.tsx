import React from "react";
import Badge from "./Badge";
import { LoanStatus } from "../../constants/enums";

interface StatusBadgeProps {
  status: LoanStatus | string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const normalized = status.toUpperCase();

  const getMapping = () => {
    switch (normalized) {
      // Loan statuses
      case "ACTIVE":
        return { variant: "primary", label: "Active" } as const;
      case "PARTIALLY_PAID":
        return { variant: "warning", label: "Partially Paid" } as const;
      case "COMPLETED":
        return { variant: "success", label: "Completed" } as const;
      case "OVERDUE":
        return { variant: "danger", label: "Overdue" } as const;
      case "PAID":
        return { variant: "success", label: "Paid" } as const;

      default:
        return { variant: "muted", label: status } as const;
    }
  };

  const { variant, label } = getMapping();

  return (
    <Badge variant={variant} className={className}>
      {label}
    </Badge>
  );
};

export default StatusBadge;
