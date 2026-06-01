import React, { useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  Calendar,
  CreditCard,
  Edit3,
  Trash2,
  User,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AmountText from "../../components/common/AmountText";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import LoadingState from "../../components/common/LoadingState";
import { usePayments } from "../../hooks/usePayments";
import { ROUTES } from "../../config/routes.config";
import { formatDate } from "../../lib/formatDate";
import { paymentMethodOptions } from "../../lib/utils";

export const PaymentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { payment, isPaymentLoading, deletePayment, isDeleting } = usePayments(undefined, id);

  const handleDelete = async () => {
    if (!id) return;
    await deletePayment(id);
    navigate(ROUTES.LOANS);
  };

  if (isPaymentLoading) {
    return <LoadingState message="Loading payment..." type="spinner" />;
  }

  if (!payment) {
    return (
      <Card variant="bordered" className="mx-auto mt-10 max-w-2xl p-6 text-center">
        <AlertTriangle className="mx-auto mb-2 h-10 w-10 text-appDanger" />
        <h3 className="text-base font-extrabold text-appText">Payment not found</h3>
        <p className="mb-4 mt-1 text-xs text-appMuted">Could not find this payment record.</p>
        <Link to={ROUTES.LOANS}>
          <Button variant="outline" leftIcon={<ArrowLeft className="h-4 w-4" />}>
            Back to Loans
          </Button>
        </Link>
      </Card>
    );
  }

  const loan = typeof payment.loanId === "object" ? payment.loanId : undefined;
  const contact = typeof payment.contactId === "object" ? payment.contactId : undefined;
  const methodLabel = paymentMethodOptions.find((option) => option.value === payment.method)?.label || payment.method;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <button
        onClick={() => navigate(loan?._id ? ROUTES.LOAN_DETAIL.replace(":id", loan._id) : ROUTES.LOANS)}
        className="flex items-center gap-1.5 text-sm font-bold text-appMuted transition-colors hover:text-appText"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <Card variant="bordered" className="border-appBorder/50">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-appMuted">
              {payment.type === "RECEIVED" ? "Payment Received" : "Payment Paid"}
            </span>
            <AmountText amount={payment.amount} className="mt-2 block text-3xl font-black text-appSuccess" />
            <p className="mt-2 text-sm font-semibold text-appMuted">
              {loan?.description || "Loan payment"}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Edit3 className="h-4 w-4" />}
              onClick={() => navigate(ROUTES.EDIT_PAYMENT.replace(":id", id!))}
            >
              Edit
            </Button>
            <Button
              variant="danger"
              size="sm"
              leftIcon={<Trash2 className="h-4 w-4" />}
              onClick={() => setDeleteOpen(true)}
            >
              Delete
            </Button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-appBgSoft p-4">
            <p className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-appMuted">
              <Calendar className="h-3.5 w-3.5" /> Date
            </p>
            <p className="mt-1 text-sm font-bold text-appText">{formatDate(payment.paymentDate)}</p>
          </div>
          <div className="rounded-2xl bg-appBgSoft p-4">
            <p className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-appMuted">
              <CreditCard className="h-3.5 w-3.5" /> Method
            </p>
            <p className="mt-1 text-sm font-bold text-appText">{methodLabel}</p>
          </div>
          <div className="rounded-2xl bg-appBgSoft p-4">
            <p className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-appMuted">
              <User className="h-3.5 w-3.5" /> Contact
            </p>
            <p className="mt-1 text-sm font-bold text-appText">{contact?.name || "Unknown Contact"}</p>
          </div>
          <div className="rounded-2xl bg-appBgSoft p-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-appMuted">Cash Flow</p>
            <p className="mt-1 text-sm font-bold text-appText">
              {payment.type === "RECEIVED" ? "Loan Recovery" : "Loan Repayment"}
            </p>
          </div>
        </div>

        {payment.note && (
          <div className="mt-5 rounded-2xl border border-appBorder/50 bg-appBgSoft/50 p-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-appMuted">Note</p>
            <p className="mt-1 text-sm font-semibold text-appText">{payment.note}</p>
          </div>
        )}
      </Card>

      <ConfirmDialog
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete payment?"
        message="The loan balance and linked transaction will be recalculated after deleting this payment."
        confirmText="Delete"
        isDestructive
        isLoading={isDeleting}
      />
    </div>
  );
};

export default PaymentDetail;
