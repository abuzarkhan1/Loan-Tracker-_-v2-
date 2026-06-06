import React, { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LoadingState from "../components/common/LoadingState";
import AppLayout from "../components/layout/AppLayout";
import { ROUTES } from "../config/routes.config";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

const Login = lazy(() => import("../pages/auth/Login"));
const Register = lazy(() => import("../pages/auth/Register"));
const ForgotPassword = lazy(() => import("../pages/auth/ForgotPassword"));

const Dashboard = lazy(() => import("../pages/dashboard/Dashboard"));

const Contacts = lazy(() => import("../pages/contacts/Contacts"));
const ContactDetail = lazy(() => import("../pages/contacts/ContactDetail"));
const ContactLedger = lazy(() => import("../pages/contacts/ContactLedger"));

const Loans = lazy(() => import("../pages/loans/Loans"));
const AddLoan = lazy(() => import("../pages/loans/AddLoan"));
const EditLoan = lazy(() => import("../pages/loans/EditLoan"));
const LoanDetail = lazy(() => import("../pages/loans/LoanDetail"));

const AddPayment = lazy(() => import("../pages/payments/AddPayment"));
const EditPayment = lazy(() => import("../pages/payments/EditPayment"));
const PaymentDetail = lazy(() => import("../pages/payments/PaymentDetail"));

const Transactions = lazy(() => import("../pages/money/Transactions"));
const AddTransaction = lazy(() => import("../pages/money/AddTransaction"));
const TransactionDetail = lazy(() => import("../pages/money/TransactionDetail"));
const Categories = lazy(() => import("../pages/money/Categories"));

const Goals = lazy(() => import("../pages/goals/Goals"));
const AddEditGoal = lazy(() => import("../pages/goals/AddEditGoal"));
const AddGoalContribution = lazy(() => import("../pages/goals/AddGoalContribution"));
const GoalDetail = lazy(() => import("../pages/goals/GoalDetail"));

const Settings = lazy(() => import("../pages/settings/Settings"));
const Profile = lazy(() => import("../pages/settings/Profile"));

const PrivacyPolicy = lazy(() => import("../pages/legal/PrivacyPolicy"));
const Terms = lazy(() => import("../pages/legal/Terms"));

const lazyFallback = <LoadingState message="Loading page..." type="spinner" />;

const withSuspense = (children: React.ReactNode) => (
  <Suspense fallback={lazyFallback}>{children}</Suspense>
);

const protectedPage = (children: React.ReactNode) => (
  <ProtectedRoute>
    <AppLayout>{withSuspense(children)}</AppLayout>
  </ProtectedRoute>
);

const publicPage = (children: React.ReactNode) => (
  <PublicRoute>{withSuspense(children)}</PublicRoute>
);

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.LOGIN} element={publicPage(<Login />)} />
        <Route path={ROUTES.REGISTER} element={publicPage(<Register />)} />
        <Route path={ROUTES.FORGOT_PASSWORD} element={publicPage(<ForgotPassword />)} />

        <Route path={ROUTES.PRIVACY_POLICY} element={withSuspense(<PrivacyPolicy />)} />
        <Route path={ROUTES.TERMS} element={withSuspense(<Terms />)} />

        <Route path={ROUTES.DASHBOARD} element={protectedPage(<Dashboard />)} />
        <Route path={ROUTES.CONTACTS} element={protectedPage(<Contacts />)} />
        <Route path={ROUTES.CONTACT_DETAIL} element={protectedPage(<ContactDetail />)} />
        <Route path={ROUTES.CONTACT_LEDGER} element={protectedPage(<ContactLedger />)} />

        <Route path={ROUTES.LOANS} element={protectedPage(<Loans />)} />
        <Route path={ROUTES.ADD_LOAN} element={protectedPage(<AddLoan />)} />
        <Route path={ROUTES.LOAN_DETAIL} element={protectedPage(<LoanDetail />)} />
        <Route path={ROUTES.EDIT_LOAN} element={protectedPage(<EditLoan />)} />

        <Route path={ROUTES.ADD_PAYMENT} element={protectedPage(<AddPayment />)} />
        <Route path={ROUTES.EDIT_PAYMENT} element={protectedPage(<EditPayment />)} />
        <Route path={ROUTES.PAYMENT_DETAIL} element={protectedPage(<PaymentDetail />)} />

        <Route path={ROUTES.TRANSACTIONS} element={protectedPage(<Transactions />)} />
        <Route path={ROUTES.ADD_TRANSACTION} element={protectedPage(<AddTransaction />)} />
        <Route path={ROUTES.TRANSACTION_DETAIL} element={protectedPage(<TransactionDetail />)} />
        <Route path={ROUTES.CATEGORIES} element={protectedPage(<Categories />)} />

        <Route path={ROUTES.GOALS} element={protectedPage(<Goals />)} />
        <Route path={ROUTES.ADD_GOAL} element={protectedPage(<AddEditGoal />)} />
        <Route path={ROUTES.GOAL_DETAIL} element={protectedPage(<GoalDetail />)} />
        <Route path={ROUTES.EDIT_GOAL} element={protectedPage(<AddEditGoal />)} />
        <Route path={ROUTES.ADD_GOAL_CONTRIBUTION} element={protectedPage(<AddGoalContribution />)} />
        <Route path={ROUTES.EDIT_GOAL_CONTRIBUTION} element={protectedPage(<AddGoalContribution />)} />

        <Route path={ROUTES.SETTINGS} element={protectedPage(<Settings />)} />
        <Route path={ROUTES.PROFILE} element={protectedPage(<Profile />)} />

        <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
