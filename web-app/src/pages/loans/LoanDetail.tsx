import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Edit,
  FileText,
  HandCoins,
  Plus,
  Trash2,
  User,
} from "lucide-react";
import useLoans from "../../hooks/useLoans";
import usePayments from "../../hooks/usePayments";
import AmountText from "../../components/common/AmountText";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";
import LoadingState from "../../components/common/LoadingState";
import StatusBadge from "../../components/common/StatusBadge";
import { ROUTES } from "../../config/routes.config";
import { formatDate } from "../../lib/formatDate";
import { getProgress } from "../../lib/utils";
import { Contact, Payment } from "../../types";
import { APP_CONFIG } from "../../config/app.config";

const getContact = (loan: any): Contact | undefined =>
  typeof loan?.contactId === "object" ? loan.contactId as Contact : undefined;

export const LoanDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [deleteLoanOpen, setDeleteLoanOpen] = useState(false);
  const [paymentToDelete, setPaymentToDelete] = useState<Payment | null>(null);
  const { loanDetail, deleteLoan, isDeleting, isLoading, error, refetch } = useLoans(id);
  const { payments, deletePayment, isDeleting: isDeletingPayment } = usePayments(id);

  const handleDownloadPdf = () => {
    const token = localStorage.getItem(APP_CONFIG.localStorageKeys.token);
    const pdfUrl = `${APP_CONFIG.apiUrl}/loans/${id}/pdf?token=${token}`;
    window.open(pdfUrl, "_blank");
  };

  if (isLoading) return <LoadingState message="Loading loan..." type="spinner" />;
  if (error || !loanDetail) return <ErrorState onRetry={refetch} message="Loan detail load nahi ho saka." />;

  const loan = loanDetail.loan;
  const contact = getContact(loan);
  const paymentList = payments || loanDetail.payments || [];
  const progress = getProgress(loan.paidAmount, loan.amount);
  const contactId = contact?._id || (typeof loan.contactId === "string" ? loan.contactId : undefined);

  const handleDeleteLoan = async () => {
    if (!id) return;
    await deleteLoan(id);
    navigate(ROUTES.LOANS);
  };

  const handleDeletePayment = async () => {
    if (!paymentToDelete) return;
    await deletePayment(paymentToDelete._id);
    setPaymentToDelete(null);
    await refetch();
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <button
        onClick={() => navigate(ROUTES.LOANS)}
        className="flex items-center gap-1.5 text-sm font-bold text-appMuted transition-colors hover:text-appText"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Loans
      </button>

      <Card variant="bordered" className="border-appBorder/50">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <StatusBadge status={loan.status} />
              <span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-widest ${
                loan.type === "GIVEN" ? "bg-appSuccess/10 text-appSuccess" : "bg-appDanger/10 text-appDanger"
              }`}>
                {loan.type === "GIVEN" ? "Given Loan" : "Taken Loan"}
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-appText">{loan.description || "Loan"}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm font-semibold text-appMuted">
              <span className="inline-flex items-center gap-1.5">
                <User className="h-4 w-4" /> {contact?.name || "Unknown Contact"}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-4 w-4" /> Due {loan.dueDate ? formatDate(loan.dueDate) : "not set"}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<FileText className="h-4 w-4" />}
              onClick={handleDownloadPdf}
            >
              PDF
            </Button>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Edit className="h-4 w-4" />}
              onClick={() => navigate(ROUTES.EDIT_LOAN.replace(":id", loan._id))}
            >
              Edit
            </Button>
            <Button
              variant="danger"
              size="sm"
              leftIcon={<Trash2 className="h-4 w-4" />}
              onClick={() => setDeleteLoanOpen(true)}
            >
              Delete
            </Button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-appBgSoft p-5">
            <p className="text-[10px] font-black uppercase tracking-widest text-appMuted">Amount</p>
            <AmountText amount={loan.amount} className="mt-1 text-xl font-extrabold text-appText" />
          </div>
          <div className="rounded-2xl bg-appBgSoft p-5">
            <p className="text-[10px] font-black uppercase tracking-widest text-appMuted">Paid</p>
            <AmountText amount={loan.paidAmount} className="mt-1 text-xl font-extrabold text-appSuccess" />
          </div>
          <div className="rounded-2xl bg-appBgSoft p-5">
            <p className="text-[10px] font-black uppercase tracking-widest text-appMuted">Remaining</p>
            <AmountText amount={loan.remainingAmount} className="mt-1 text-xl font-extrabold text-appPrimary" />
          </div>
        </div>

        <div className="mt-6 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-appMuted">
            <span>Payment Progress</span>
            <span>{progress}% paid</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-appBorder">
            <div className="h-full rounded-full bg-appPrimary" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={() => navigate(`${ROUTES.ADD_PAYMENT}?loanId=${loan._id}`)}
            disabled={loan.remainingAmount <= 0}
          >
            Add Payment
          </Button>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<BookOpen className="h-4 w-4" />}
            onClick={() => contactId && navigate(ROUTES.CONTACT_LEDGER.replace(":id", contactId))}
            disabled={!contactId}
          >
            Contact Ledger
          </Button>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<HandCoins className="h-4 w-4" />}
            onClick={() => navigate(ROUTES.LOANS)}
          >
            All Loans
          </Button>
        </div>
      </Card>

      <Card variant="bordered" className="border-appBorder/50">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-extrabold text-appText">Payment History</h2>
            <p className="text-xs font-semibold text-appMuted">Every partial payment recalculates the balance automatically.</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={() => navigate(`${ROUTES.ADD_PAYMENT}?loanId=${loan._id}`)}
            disabled={loan.remainingAmount <= 0}
          >
            Add Payment
          </Button>
        </div>

        {paymentList.length === 0 ? (
          <EmptyState
            title="No payments yet"
            description="Add a partial or full payment to update the remaining balance."
            actionText="Add Payment"
            onAction={() => navigate(`${ROUTES.ADD_PAYMENT}?loanId=${loan._id}`)}
          />
        ) : (
          <div className="space-y-3">
            {paymentList.map((payment) => (
              <div key={payment._id} className="rounded-2xl border border-appBorder/50 bg-appBgSoft/50 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-extrabold text-appText">
                      <AmountText amount={payment.amount} />
                    </p>
                    <p className="mt-1 text-xs font-semibold text-appMuted">
                      {payment.type === "RECEIVED" ? "Received back" : "Paid back"} via {payment.method}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-appMuted">{formatDate(payment.paymentDate)}</p>
                    {payment.note && <p className="mt-2 text-sm text-appText">{payment.note}</p>}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(ROUTES.EDIT_PAYMENT.replace(":id", payment._id))}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => setPaymentToDelete(payment)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <ConfirmDialog
        isOpen={deleteLoanOpen}
        onClose={() => setDeleteLoanOpen(false)}
        onConfirm={handleDeleteLoan}
        title="Delete loan?"
        message="This will also remove this loan's payment history and linked cash-flow transactions."
        confirmText="Delete"
        isDestructive
        isLoading={isDeleting}
      />

      <ConfirmDialog
        isOpen={Boolean(paymentToDelete)}
        onClose={() => setPaymentToDelete(null)}
        onConfirm={handleDeletePayment}
        title="Delete payment?"
        message="The loan balance will be recalculated after this payment is deleted."
        confirmText="Delete"
        isDestructive
        isLoading={isDeletingPayment}
      />
    </div>
  );
};

export default LoanDetail;
