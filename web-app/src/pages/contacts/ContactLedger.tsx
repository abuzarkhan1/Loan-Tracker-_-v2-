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
import { format } from "date-fns";

const fmtDate = (d?: string) => (d ? format(new Date(d), "dd MMM yyyy") : "—");

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
    warning: { bg: "bg-appYellow/10",  text: "text-appYellow"  },
  };
  const c = colorMap[tone];
  return (
    <div className={`${c.bg} rounded-2xl p-4 space-y-1`}>
      <div className={`h-9 w-9 flex items-center justify-center rounded-xl ${c.bg}`}>
        <Landmark className={`h-5 w-5 ${c.text}`} />
      </div>
      <p className="text-[10px] font-black uppercase tracking-widest text-appMuted mt-2">{label}</p>
      <p className={`text-base font-extrabold ${c.text}`}>
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
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Back */}
      <button
        onClick={() => navigate(ROUTES.CONTACT_DETAIL.replace(":id", contactId!))}
        className="flex items-center gap-1.5 text-sm font-bold text-appMuted hover:text-appText transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to {contact.name}
      </button>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-appText">{contact.name} — Ledger</h1>
        <p className="mt-1 text-sm text-appMuted">Complete hisaab aur transaction timeline.</p>
      </div>

      {/* Summary tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <SummaryTile label="Total Diya"   amount={summary.totalGiven          || 0} tone="success" />
        <SummaryTile label="Total Liya"   amount={summary.totalTaken          || 0} tone="danger"  />
        <SummaryTile label="Wapis Mila"   amount={summary.totalReceivedBack   || 0} tone="primary" />
        <SummaryTile label="Wapis Diya"   amount={summary.totalPaidBack       || 0} tone="warning" />
      </div>

      {/* Net balance card */}
      <Card variant="bordered" className="border-appBorder/50">
        <p className="text-sm font-bold text-appMuted">Net Balance</p>
        <p className={`mt-2 text-4xl font-extrabold ${summary.overallBalance >= 0 ? "text-appSuccess" : "text-appDanger"}`}>
          <AmountText amount={Math.abs(summary.overallBalance || 0)} />
        </p>
        <p className="mt-2 text-xs font-semibold text-appMuted">
          Active {summary.activeLoans ?? 0} · Completed {summary.completedLoans ?? 0} · Overdue {summary.overdueLoans ?? 0}
        </p>
      </Card>

      {/* Timeline */}
      <div>
        <h2 className="text-lg font-extrabold text-appText mb-4">Transaction Timeline</h2>

        {(!timeline || timeline.length === 0) ? (
          <EmptyState
            title="No ledger activity"
            description="Loans aur payments timeline yahan show hogi."
          />
        ) : (
          <div className="relative">
            {/* vertical line */}
            <div className="absolute left-[22px] top-0 bottom-0 w-0.5 bg-appBorder/50" />

            <div className="space-y-4">
              {timeline.map((item: any, idx: number) => (
                <div key={`${item.kind}-${item.id ?? idx}`} className="flex gap-5">
                  {/* dot */}
                  <div className={`relative z-10 h-11 w-11 shrink-0 flex items-center justify-center rounded-xl border border-appBorder ${item.kind === "LOAN" ? "bg-appPrimary/10" : "bg-appSuccess/10"}`}>
                    <Landmark className={`h-5 w-5 ${kindColor(item.kind)}`} />
                  </div>

                  <Card variant="bordered" className="flex-1 border-appBorder/40 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-extrabold text-appText">
                          {item.kind === "LOAN" ? "Loan" : "Payment"} · {item.type}
                        </p>
                        <p className="text-xs text-appMuted mt-0.5">{fmtDate(item.date)}</p>
                        {item.status && (
                          <span className="inline-block mt-1.5 text-[9px] font-black uppercase tracking-wider bg-appBgSoft text-appMuted px-2 py-0.5 rounded-full">
                            {item.status}
                          </span>
                        )}
                        {item.method && (
                          <span className="inline-block mt-1 ml-1 text-[9px] font-black uppercase tracking-wider bg-appBgSoft text-appMuted px-2 py-0.5 rounded-full">
                            {item.method}
                          </span>
                        )}
                        {(item.description || item.note) && (
                          <p className="mt-2 text-xs text-appMuted">{item.description || item.note}</p>
                        )}
                      </div>
                      <p className="text-sm font-extrabold text-appText whitespace-nowrap">
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
