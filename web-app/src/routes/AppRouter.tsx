import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import { ROUTES } from "../config/routes.config";
import ForgotPassword from "../pages/auth/ForgotPassword";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ContactDetail from "../pages/contacts/ContactDetail";
import ContactLedger from "../pages/contacts/ContactLedger";
import Contacts from "../pages/contacts/Contacts";
import Dashboard from "../pages/dashboard/Dashboard";
import PrivacyPolicy from "../pages/legal/PrivacyPolicy";
import Terms from "../pages/legal/Terms";
import AddLoan from "../pages/loans/AddLoan";
import EditLoan from "../pages/loans/EditLoan";
import LoanDetail from "../pages/loans/LoanDetail";
import Loans from "../pages/loans/Loans";
import AddTransaction from "../pages/money/AddTransaction";
import Categories from "../pages/money/Categories";
import TransactionDetail from "../pages/money/TransactionDetail";
import Transactions from "../pages/money/Transactions";
import AddPayment from "../pages/payments/AddPayment";
import EditPayment from "../pages/payments/EditPayment";
import PaymentDetail from "../pages/payments/PaymentDetail";
import Profile from "../pages/settings/Profile";
import Settings from "../pages/settings/Settings";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

const protectedPage = (children: React.ReactNode) => (
  <ProtectedRoute>
    <AppLayout>{children}</AppLayout>
  </ProtectedRoute>
);

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.LOGIN} element={<PublicRoute><Login /></PublicRoute>} />
        <Route path={ROUTES.REGISTER} element={<PublicRoute><Register /></PublicRoute>} />
        <Route path={ROUTES.FORGOT_PASSWORD} element={<PublicRoute><ForgotPassword /></PublicRoute>} />

        <Route path={ROUTES.PRIVACY_POLICY} element={<PrivacyPolicy />} />
        <Route path={ROUTES.TERMS} element={<Terms />} />

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

        <Route path={ROUTES.SETTINGS} element={protectedPage(<Settings />)} />
        <Route path={ROUTES.PROFILE} element={protectedPage(<Profile />)} />

        <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
