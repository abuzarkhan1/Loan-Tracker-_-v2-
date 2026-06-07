import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  ChevronRight,
  HandCoins,
  Mail,
  Phone,
  Plus,
  Trash2,
} from "lucide-react";
import useContacts from "../../hooks/useContacts";
import AmountText from "../../components/common/AmountText";
import Badge from "../../components/common/Badge";
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

const summaryCards = [
  ["totalGiven", "Total Diya", "success"],
  ["totalTaken", "Total Liya", "danger"],
  ["totalReceivedBack", "Wapis Mila", "primary"],
  ["totalPaidBack", "Wapis Diya", "warning"],
] as const;

export const ContactDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { contactDetail, deleteContact, isDeleting, isLoading, error, refetch } = useContacts(id);

  if (isLoading) return <LoadingState message="Loading contact ledger..." type="spinner" />;
  if (error || !contactDetail)
    return <ErrorState onRetry={refetch} message="Contact profile load nahi ho saka." />;

  const { contact, summary, recentLoans } = contactDetail;
  const activeLoans = recentLoans.filter((loan) => loan.remainingAmount > 0);
  const firstActiveLoan = activeLoans[0];
  const sourceLabel = contact.source === "DEVICE_CONTACT" ? "Phone Contact" : "Manual";

  const handleDelete = async () => {
    if (!id) return;
    await deleteContact(id);
    navigate(ROUTES.CONTACTS);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <button
        onClick={() => navigate(ROUTES.CONTACTS)}
        className="flex items-center gap-1.5 text-xs font-medium text-appMuted transition-colors hover:text-appText"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Contacts
      </button>

      <Card variant="bordered" className="border-appBorder/50">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-appPrimary/10 text-base font-semibold text-appPrimary">
              {contact.name.trim().charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="truncate text-xl font-semibold text-appText">{contact.name}</h1>
                <Badge variant="muted" size="sm">{sourceLabel}</Badge>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm font-normal text-appMuted">
                {contact.phone && (
                  <span className="inline-flex items-center gap-1.5">
                    <Phone className="h-4 w-4" /> {contact.phone}
                  </span>
                )}
                {contact.email && (
                  <span className="inline-flex items-center gap-1.5">
                    <Mail className="h-4 w-4" /> {contact.email}
                  </span>
                )}
              </div>
              {contact.note && <p className="mt-3 max-w-2xl text-sm leading-6 text-appText">{contact.note}</p>}
            </div>
          </div>

          <Button
            variant="danger"
            size="sm"
            onClick={() => setDeleteOpen(true)}
            leftIcon={<Trash2 className="h-4 w-4" />}
          >
            Delete
          </Button>
        </div>

        <div className="mt-5 rounded-lg border border-appBorder bg-appSurface p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.05em] text-appMuted">Net Balance</p>
          <p className={`mt-1 text-2xl font-semibold ${summary.overallBalance >= 0 ? "text-appSuccess" : "text-appDanger"}`}>
            <AmountText amount={Math.abs(summary.overallBalance)} />
          </p>
          <p className="mt-1 text-xs font-normal text-appMuted">
            {summary.overallBalance >= 0 ? "Mujhe lene hain" : "Mujhe dene hain"}
          </p>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {summaryCards.map(([key, label, tone]) => (
            <div key={key} className="rounded-lg border border-appBorder bg-appCard p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.05em] text-appMuted">{label}</p>
              <p className={`mt-1 text-base font-semibold ${
                tone === "success"
                  ? "text-appSuccess"
                  : tone === "danger"
                    ? "text-appDanger"
                    : tone === "warning"
                      ? "text-appWarning"
                      : "text-appPrimary"
              }`}>
                <AmountText amount={summary[key] || 0} />
              </p>
            </div>
          ))}
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={() => navigate(`${ROUTES.ADD_LOAN}?contactId=${id}&type=GIVEN`)}
          >
            Add Loan Given
          </Button>
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={() => navigate(`${ROUTES.ADD_LOAN}?contactId=${id}&type=TAKEN`)}
          >
            Add Loan Taken
          </Button>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<HandCoins className="h-4 w-4" />}
            onClick={() => navigate(firstActiveLoan ? `${ROUTES.ADD_PAYMENT}?loanId=${firstActiveLoan._id}` : ROUTES.ADD_PAYMENT)}
          >
            Add Payment
          </Button>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<BookOpen className="h-4 w-4" />}
            onClick={() => navigate(ROUTES.CONTACT_LEDGER.replace(":id", id!))}
          >
            View Ledger
          </Button>
        </div>
      </Card>

      <Card variant="bordered" className="border-appBorder/50">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-appText">Recent Loans</h2>
            <p className="text-xs font-normal text-appMuted">Simple loan records and payment progress.</p>
          </div>
        </div>

        {recentLoans.length === 0 ? (
          <EmptyState
            title="No loans for this contact"
            description="Add a loan given or taken to start the contact ledger."
            actionText="Add Loan"
            onAction={() => navigate(`${ROUTES.ADD_LOAN}?contactId=${id}`)}
          />
        ) : (
          <div className="space-y-3">
            {recentLoans.map((loan) => {
              const progress = getProgress(loan.paidAmount, loan.amount);
              return (
                <button
                  key={loan._id}
                  onClick={() => navigate(ROUTES.LOAN_DETAIL.replace(":id", loan._id))}
                  className="w-full rounded-lg border border-appBorder bg-appCard p-4 text-left shadow-level1 transition-colors hover:bg-appSurface"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <StatusBadge status={loan.status} />
                        <span className={`text-xs font-semibold uppercase tracking-[0.05em] ${loan.type === "GIVEN" ? "text-appSuccess" : "text-appDanger"}`}>
                          {loan.type === "GIVEN" ? "Given" : "Taken"}
                        </span>
                      </div>
                      <p className="truncate text-sm font-semibold text-appText">{loan.description || "Loan"}</p>
                      <p className="mt-1 text-xs font-normal text-appMuted">Due {loan.dueDate ? formatDate(loan.dueDate) : "not set"}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-xs font-semibold uppercase tracking-[0.05em] text-appMuted">Remaining</p>
                      <AmountText amount={loan.remainingAmount} className="text-sm font-semibold text-appText" />
                    </div>
                    <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-appMuted" />
                  </div>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-appBorder">
                    <div className="h-full rounded-full bg-appPrimary" style={{ width: `${progress}%` }} />
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </Card>

      <ConfirmDialog
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete contact?"
        message="Contacts with active loans cannot be deleted. Completed contacts will be removed from the active list."
        confirmText="Delete"
        isDestructive
        isLoading={isDeleting}
      />
    </div>
  );
};

export default ContactDetail;
