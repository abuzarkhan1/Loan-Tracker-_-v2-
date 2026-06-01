export type TransactionType = "INCOME" | "EXPENSE" | "LOAN_RECOVERY" | "LOAN_REPAYMENT";

export type PaymentMethod = "CASH" | "BANK" | "JAZZCASH" | "EASYPAISA" | "OTHER";

export type LoanType = "GIVEN" | "TAKEN";

export type LoanStatus = "ACTIVE" | "PARTIALLY_PAID" | "COMPLETED" | "OVERDUE";

export const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
  { value: "CASH", label: "Cash" },
  { value: "BANK", label: "Bank" },
  { value: "JAZZCASH", label: "JazzCash" },
  { value: "EASYPAISA", label: "EasyPaisa" },
  { value: "OTHER", label: "Other" },
];

export const LOAN_STATUSES: { value: LoanStatus; label: string; color: string }[] = [
  { value: "ACTIVE", label: "Active", color: "primary" },
  { value: "PARTIALLY_PAID", label: "Partially Paid", color: "warning" },
  { value: "COMPLETED", label: "Completed", color: "success" },
  { value: "OVERDUE", label: "Overdue", color: "danger" },
];

export const TRANSACTION_TYPES: { value: TransactionType; label: string }[] = [
  { value: "INCOME", label: "Income" },
  { value: "EXPENSE", label: "Expense" },
  { value: "LOAN_RECOVERY", label: "Loan Recovery" },
  { value: "LOAN_REPAYMENT", label: "Loan Repayment" },
];
