import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Landmark } from "lucide-react";
import { contactsApi } from "../../api/contacts.api";
import { QUERY_KEYS } from "../../constants/queryKeys";
import { ROUTES } from "../../config/routes.config";
import AmountText from "../../components/common/AmountText";
import Card from "../../components/common/Card";
import LoadingState from "../../components/common/LoadingState";
import ErrorState from "../../components/common/ErrorState";
import EmptyState from "../../components/common/EmptyState";
import PageHeader from "../../components/common/PageHeader";
import { formatDate } from "../../lib/formatDate";

const fmtDate = (d?: string) => (d ? formatDate(d) : "—");

const SummaryTile = ({
  label,
  amount,
  tone,
}: {
  label: string;
  amount: number;
  tone: "success" | "danger" | "primary" | "warning";
}) => {
  const colorMap = {
    success: { bg: "bg-appSuccess/10", text: "text-appSuccess" },
    danger:  { bg: "bg-appDanger/10",  text: "text-appDanger"  },
    primary: { bg: "bg-appPrimary/10", text: "text-appPrimary" },
    warning: { bg: "bg-appWarning/10",  text: "text-appWarning"  },
  };
  const c = colorMap[tone];
  return (
    <div className="space-y-1 rounded-xl border border-appBorder bg-appCard p-4 shadow-level1">
      <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${c.bg}`}>
        <Landmark className={`h-4 w-4 ${c.text}`} />
      </div>
      <p className="text-xs font-semibold uppercase tracking-[0.05em] text-appMuted mt-2">{label}</p>
      <p className={`text-base font-semibold ${c.text}`}>
        <AmountText amount={amount} />
      </p>
    </div>
  );
};

export const ContactLedger: React.FC = () => {
  const { id: contactId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const ledgerQuery = useQuery({
    queryKey: [QUERY_KEYS.CONTACT_LEDGER, contactId],
    queryFn: () => contactsApi.getContactLedger(contactId!),
    enabled: !!contactId,
  });

  if (ledgerQuery.isLoading) return <LoadingState message="Loading ledger..." type="spinner" />;
  if (ledgerQuery.isError || !ledgerQuery.data)
    return <ErrorState onRetry={ledgerQuery.refetch} message="Ledger load nahi ho saka." />;

  const { contact, summary, timeline } = ledgerQuery.data as any;

  const kindColor = (kind: string) =>
    kind === "LOAN" ? "text-appPrimary" : "text-appSuccess";

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      {/* Back */}
      <button
        onClick={() => navigate(ROUTES.CONTACT_DETAIL.replace(":id", contactId!))}
        className="flex items-center gap-1.5 text-xs font-medium text-appMuted transition-colors hover:text-appText"
      >
        <ArrowLeft className="h-4 w-4" /> Back to {contact.name}
      </button>

      <PageHeader
        kicker="Contact ledger"
        title={`${contact.name} — Ledger`}
        description="Complete hisaab aur transaction timeline."
        icon={<Landmark className="h-6 w-6" />}
      />

      {/* Summary tiles */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <SummaryTile label="Total Diya"   amount={summary.totalGiven          || 0} tone="success" />
        <SummaryTile label="Total Liya"   amount={summary.totalTaken          || 0} tone="danger"  />
        <SummaryTile label="Wapis Mila"   amount={summary.totalReceivedBack   || 0} tone="primary" />
        <SummaryTile label="Wapis Diya"   amount={summary.totalPaidBack       || 0} tone="warning" />
      </div>

      {/* Net balance card */}
      <Card variant="bordered" className="border-appBorder/50">
        <p className="text-xs font-semibold uppercase tracking-[0.05em] text-appMuted">Net Balance</p>
        <p className={`mt-2 text-3xl font-semibold ${summary.overallBalance >= 0 ? "text-appSuccess" : "text-appDanger"}`}>
          <AmountText amount={Math.abs(summary.overallBalance || 0)} />
        </p>
        <p className="mt-2 text-xs font-normal text-appMuted">
          Active {summary.activeLoans ?? 0} · Completed {summary.completedLoans ?? 0} · Overdue {summary.overdueLoans ?? 0}
        </p>
      </Card>

      {/* Timeline */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-appText">Transaction Timeline</h2>

        {(!timeline || timeline.length === 0) ? (
          <EmptyState
            title="No ledger activity"
            description="Loans aur payments timeline yahan show hogi."
          />
        ) : (
          <div className="relative">
            {/* vertical line */}
            <div className="absolute bottom-0 left-[20px] top-0 w-0.5 bg-appBorder/50" />

            <div className="space-y-4">
              {timeline.map((item: any, idx: number) => (
                <div key={`${item.kind}-${item.id ?? idx}`} className="flex gap-5">
                  {/* dot */}
                  <div className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-appBorder ${item.kind === "LOAN" ? "bg-appPrimary/10" : "bg-appSuccess/10"}`}>
                    <Landmark className={`h-4 w-4 ${kindColor(item.kind)}`} />
                  </div>

                  <Card variant="bordered" className="flex-1 border-appBorder/40 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-appText">
                          {item.kind === "LOAN" ? "Loan" : "Payment"} · {item.type}
                        </p>
                        <p className="text-xs text-appMuted mt-0.5">{fmtDate(item.date)}</p>
                        {item.status && (
                          <span className="mt-1.5 inline-block rounded-md border border-appBorder bg-appBgSoft px-2 py-0.5 text-xs font-medium text-appMuted">
                            {item.status}
                          </span>
                        )}
                        {item.method && (
                          <span className="mt-1 ml-1 inline-block rounded-md border border-appBorder bg-appBgSoft px-2 py-0.5 text-xs font-medium text-appMuted">
                            {item.method}
                          </span>
                        )}
                        {(item.description || item.note) && (
                          <p className="mt-2 text-xs text-appMuted">{item.description || item.note}</p>
                        )}
                      </div>
                      <p className="whitespace-nowrap text-sm font-semibold text-appText">
                        <AmountText amount={item.amount} />
                      </p>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactLedger;
