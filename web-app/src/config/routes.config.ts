export const ROUTES = {
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  PRIVACY_POLICY: "/privacy-policy",
  TERMS: "/terms",

  DASHBOARD: "/",

  CONTACTS: "/contacts",
  CONTACT_DETAIL: "/contacts/:id",
  CONTACT_LEDGER: "/contacts/:id/ledger",

  LOANS: "/loans",
  LOAN_DETAIL: "/loans/:id",
  ADD_LOAN: "/loans/add",
  EDIT_LOAN: "/loans/:id/edit",

  ADD_PAYMENT: "/payments/add",
  EDIT_PAYMENT: "/payments/:id/edit",
  PAYMENT_DETAIL: "/payments/:id",

  TRANSACTIONS: "/transactions",
  ADD_TRANSACTION: "/transactions/add",
  TRANSACTION_DETAIL: "/transactions/:id",
  CATEGORIES: "/categories",

  GOALS: "/goals",
  ADD_GOAL: "/goals/add",
  GOAL_DETAIL: "/goals/:id",
  EDIT_GOAL: "/goals/:id/edit",
  ADD_GOAL_CONTRIBUTION: "/goals/:id/contributions/add",
  EDIT_GOAL_CONTRIBUTION: "/goals/:id/contributions/:contributionId/edit",

  SETTINGS: "/settings",
  PROFILE: "/settings/profile",
};
