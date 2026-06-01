import React from "react";
import { ArrowLeft, FileText, HelpCircle, Scale } from "lucide-react";
import { Link } from "react-router-dom";
import Card from "../../components/common/Card";

export const Terms: React.FC = () => {
  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      <Link to="/" className="flex items-center gap-1 text-xs font-bold text-appPrimary hover:underline">
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Application
      </Link>

      <div>
        <h1 className="flex items-center gap-2 text-2xl font-extrabold text-appText">
          <FileText className="h-6 w-6 text-appPrimary" />
          Terms of Service
        </h1>
        <p className="text-sm text-appMuted">
          Last Updated: June 1, 2026. These terms apply to the Loan Tracker web dashboard and mobile app.
        </p>
      </div>

      <Card variant="bordered" className="space-y-5 p-6 text-xs leading-relaxed text-appMuted">
        <section className="space-y-2">
          <h2 className="flex items-center gap-1 text-sm font-extrabold text-appText">
            <Scale className="h-4 w-4 text-appPrimary" />
            1. Scope
          </h2>
          <p>
            Loan Tracker helps you record contacts, loans you gave or took, partial payments, remaining balances,
            expenses, income, categories, and simple dashboard charts.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="flex items-center gap-1 text-sm font-extrabold text-appText">
            <HelpCircle className="h-4 w-4 text-appSuccess" />
            2. Your Responsibility
          </h2>
          <p>
            You are responsible for entering correct contact, loan, payment, expense, and income data. The app is a
            personal record keeping tool and is not a bank, lender, payment processor, or accounting service.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-extrabold text-appText">3. Simple Product</h2>
          <p>
            The simplified app intentionally focuses on the core day-to-day workflows: contacts, loans, partial
            payments, expenses, income, categories, dashboard totals, and simple charts.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-extrabold text-appText">4. Availability</h2>
          <p>
            Service interruptions can happen. Keep your own important records when legal, business, or tax accuracy is
            required.
          </p>
        </section>
      </Card>
    </div>
  );
};

export default Terms;
