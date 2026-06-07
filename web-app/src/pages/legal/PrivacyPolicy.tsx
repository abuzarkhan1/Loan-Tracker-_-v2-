import React from "react";
import { ArrowLeft, CheckCircle, Lock, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import Card from "../../components/common/Card";

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      <Link to="/" className="flex items-center gap-1 text-xs font-medium text-appPrimary hover:underline">
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Application
      </Link>

      <div>
        <h1 className="flex items-center gap-2 text-xl font-semibold text-appText">
          <ShieldCheck className="h-5 w-5 text-appPrimary" />
          Privacy Policy
        </h1>
        <p className="text-sm text-appMuted">
          Effective Date: June 1, 2026. This policy explains how Loan Tracker handles your simple loan and money records.
        </p>
      </div>

      <Card variant="bordered" className="space-y-5 text-xs leading-relaxed text-appMuted">
        <section className="space-y-2">
          <h2 className="flex items-center gap-1 text-sm font-semibold text-appText">
            <Lock className="h-4 w-4 text-appPrimary" />
            1. Data We Store
          </h2>
          <p>
            Loan Tracker stores your account details, contacts, loans, payments, categories, and income or expense
            transactions so the app can calculate balances and dashboard totals.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="flex items-center gap-1 text-sm font-semibold text-appText">
            <CheckCircle className="h-4 w-4 text-appSuccess" />
            2. Phone Contacts
          </h2>
          <p>
            Phone contacts are used only when you allow contact access in the mobile app. Selected contacts can be
            imported into your Loan Tracker account so you can create loan profiles faster.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-semibold text-appText">3. Removed Advanced Features</h2>
          <p>
            The simplified product is focused on contacts, loans, payments, expenses, income, categories,
            dashboard cards, and simple charts.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-semibold text-appText">4. Security</h2>
          <p>
            Your records are transmitted to the backend API over HTTPS where available. You are responsible for keeping
            your login credentials private.
          </p>
        </section>
      </Card>
    </div>
  );
};

export default PrivacyPolicy;
