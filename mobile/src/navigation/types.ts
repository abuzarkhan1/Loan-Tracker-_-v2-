import type { NavigatorScreenParams } from "@react-navigation/native";

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  Loans: undefined;
  Contacts: undefined;
  Expenses: undefined;
  SettingsTab: undefined;
};

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;
  ContactForm: { contactId?: string } | undefined;
  ContactLedger: { contactId: string };
  ContactLoanProfile: { contactId: string };
  LoanForm: { loanId?: string; contactId?: string; defaultType?: "GIVEN" | "TAKEN" } | undefined;
  LoanDetail: { loanId: string };
  PaymentForm: { loanId: string; paymentId?: string };
  QuickAddPayment: { loanId?: string; contactId?: string } | undefined;
  Transactions: undefined;
  TransactionDetail: { transactionId: string };
  AddTransaction: { transactionId?: string; defaultType?: "INCOME" | "EXPENSE" } | undefined;
  AddExpense: undefined;
  AddIncome: undefined;
  Categories: undefined;
  AddEditCategory: { categoryId?: string; type?: "INCOME" | "EXPENSE" } | undefined;
  Goals: undefined;
  GoalDetail: { goalId: string };
  AddEditGoal: { goalId?: string } | undefined;
  AddGoalContribution: { goalId: string; contributionId?: string };
  Settings: undefined;
};
