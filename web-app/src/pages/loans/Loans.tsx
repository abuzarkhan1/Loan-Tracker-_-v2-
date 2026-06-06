import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  HandCoins,
  LayoutGrid,
  List,
  Plus,
  User,
} from "lucide-react";
import useLoans from "../../hooks/useLoans";
import AmountText from "../../components/common/AmountText";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";
import LoadingState from "../../components/common/LoadingState";
import PageHeader from "../../components/common/PageHeader";
import SearchInput from "../../components/common/SearchInput";
import StatusBadge from "../../components/common/StatusBadge";
import { ROUTES } from "../../config/routes.config";
import useDebounce from "../../hooks/useDebounce";
import { formatDate } from "../../lib/formatDate";
import { getProgress } from "../../lib/utils";
import { Contact, Loan } from "../../types";

const contactName = (loan: Loan) =>
  typeof loan.contactId === "object" ? (loan.contactId as Contact).name : "Unknown Contact";

export const Loans: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [type, setType] = useState<"ALL" | "GIVEN" | "TAKEN">("ALL");
  const [status, setStatus] = useState<"ALL" | "ACTIVE" | "PARTIALLY_PAID" | "COMPLETED" | "OVERDUE">("ALL");
  const debouncedSearch = useDebounce(search, 300);

  const { loans, isLoading, error, refetch } = useLoans(undefined, {
    search: debouncedSearch,
    type: type === "ALL" ? undefined : type,
    status: status === "ALL" ? undefined : status,
  });

  const allLoans = loans?.loans || [];

  if (isLoading && !loans) {
    return <LoadingState message="Loading loans..." type="spinner" />;
  }

  if (error) {
    return <ErrorState onRetry={refetch} message="Could not fetch loans." />;
  }

  return (
    <div className="w-full space-y-6">
      <PageHeader
        kicker="Loan ledger"
        title="Loans"
        description="Track given and taken loans with partial payments, due dates, statuses, and remaining balances."
        icon={<HandCoins className="h-6 w-6" />}
        actions={
          <Button
            variant="primary"
            onClick={() => navigate(ROUTES.ADD_LOAN)}
            leftIcon={<Plus className="h-4 w-4" />}
          >
            Add Loan
          </Button>
        }
      />

      <Card variant="bordered" className="border-appBorder/50">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
          <div className="flex-1">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search by contact or description..."
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {(["ALL", "GIVEN", "TAKEN"] as const).map((value) => (
              <button
                key={value}
                onClick={() => setType(value)}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all ${
                  type === value
                    ? "bg-appPrimary text-white shadow-sm"
                    : "bg-appBgSoft text-appMuted hover:bg-appBorder hover:text-appText"
                }`}
              >
                {value === "ALL" ? "All" : value === "GIVEN" ? "Given" : "Taken"}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {(["ALL", "ACTIVE", "PARTIALLY_PAID", "COMPLETED", "OVERDUE"] as const).map((value) => (
              <button
                key={value}
                onClick={() => setStatus(value)}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all ${
                  status === value
                    ? "bg-[#6f6577] text-white shadow-sm"
                    : "bg-appBgSoft text-appMuted hover:bg-appBorder hover:text-appText"
                }`}
              >
                {value === "ALL" ? "All Status" : value.replace("_", " ")}
              </button>
            ))}
          </div>
          <div className="flex w-fit items-center gap-2 rounded-xl bg-appBgSoft p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`rounded-lg p-2 transition-colors ${
                viewMode === "grid" ? "bg-appCard text-appPrimary shadow-sm" : "text-appMuted hover:text-appText"
              }`}
              title="Grid view"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`rounded-lg p-2 transition-colors ${
                viewMode === "list" ? "bg-appCard text-appPrimary shadow-sm" : "text-appMuted hover:text-appText"
              }`}
              title="List view"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </Card>

      {allLoans.length === 0 ? (
        <EmptyState
          title="No loans found"
          description="Add a loan to start tracking who owes what and what has been paid back."
          actionText="Add Loan"
          onAction={() => navigate(ROUTES.ADD_LOAN)}
        />
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {allLoans.map((loan) => {
            const progress = getProgress(loan.paidAmount, loan.amount);
            return (
              <Card
                key={loan._id}
                variant="bordered"
                hoverable
                onClick={() => navigate(ROUTES.LOAN_DETAIL.replace(":id", loan._id))}
                className="border-appBorder/50"
              >
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge status={loan.status} />
                    <span className={`text-[10px] font-black uppercase tracking-widest ${loan.type === "GIVEN" ? "text-appSuccess" : "text-appDanger"}`}>
                      {loan.type === "GIVEN" ? "Given" : "Taken"}
                    </span>
                  </div>

                  <div>
                    <h3 className="truncate text-sm font-extrabold text-appText">
                      {loan.description || "Loan"}
                    </h3>
                    <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-appMuted">
                      <User className="h-3.5 w-3.5" /> {contactName(loan)}
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-appMuted">
                      <Calendar className="h-3.5 w-3.5" /> Due {loan.dueDate ? formatDate(loan.dueDate) : "not set"}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 border-t border-appBorder/40 pt-4">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-appMuted">Amount</p>
                      <AmountText amount={loan.amount} className="text-sm font-extrabold text-appText" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-appMuted">Remaining</p>
                      <AmountText amount={loan.remainingAmount} className="text-sm font-extrabold text-appPrimary" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-semibold text-appMuted">
                      <span>Progress</span>
                      <span>{progress}% paid</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-appBorder">
                      <div className="h-full rounded-full bg-appPrimary" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card variant="bordered" padding="none" className="overflow-hidden border-appBorder/50">
          <div className="w-full overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead className="border-b border-appBorder bg-appBgSoft/60 font-bold uppercase tracking-widest text-appMuted">
                <tr>
                  <th className="px-6 py-4">Loan</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Due Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                  <th className="px-6 py-4 text-right">Remaining</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-appBorder/40">
                {allLoans.map((loan) => (
                  <tr
                    key={loan._id}
                    onClick={() => navigate(ROUTES.LOAN_DETAIL.replace(":id", loan._id))}
                    className="cursor-pointer transition-colors hover:bg-appBgSoft/40"
                  >
                    <td className="px-6 py-4 font-bold text-appText">{loan.description || "Loan"}</td>
                    <td className="px-6 py-4 font-semibold text-appMuted">{contactName(loan)}</td>
                    <td className={`px-6 py-4 font-semibold ${loan.type === "GIVEN" ? "text-appSuccess" : "text-appDanger"}`}>
                      {loan.type === "GIVEN" ? "Given" : "Taken"}
                    </td>
                    <td className="px-6 py-4 text-appMuted">{loan.dueDate ? formatDate(loan.dueDate) : "-"}</td>
                    <td className="px-6 py-4"><StatusBadge status={loan.status} /></td>
                    <td className="px-6 py-4 text-right font-semibold text-appText">
                      <AmountText amount={loan.amount} />
                    </td>
                    <td className="px-6 py-4 text-right font-extrabold text-appPrimary">
                      <AmountText amount={loan.remainingAmount} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Loans;
