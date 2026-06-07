import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  ArrowDownLeft,
  ArrowUpRight,
  CalendarDays,
  Edit3,
  Eye,
  Layers,
  Plus,
  ReceiptText,
  RefreshCw,
  Trash2,
  WalletCards,
} from "lucide-react";
import AmountText from "../../components/common/AmountText";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import PageHeader from "../../components/common/PageHeader";
import SearchInput from "../../components/common/SearchInput";
import Select from "../../components/common/Select";
import Table from "../../components/common/Table";
import { transactionsApi } from "../../api/transactions.api";
import { QUERY_KEYS } from "../../constants/queryKeys";
import { ROUTES } from "../../config/routes.config";
import { usePagination } from "../../hooks/usePagination";
import { useTransactions } from "../../hooks/useTransactions";
import { cn } from "../../lib/cn";
import type { Category, PaymentMethod, Transaction, TransactionType } from "../../types";

type FlowFilter = "" | "EXPENSE" | "INCOME" | "LOAN_RECOVERY" | "LOAN_REPAYMENT";

const toDateInput = (date: Date) => date.toISOString().split("T")[0];

const getMonthRange = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return { from: toDateInput(start), to: toDateInput(end) };
};

const typeLabels: Record<TransactionType, string> = {
  INCOME: "Income",
  EXPENSE: "Expense",
  LOAN_RECOVERY: "Loan Recovery",
  LOAN_REPAYMENT: "Loan Repayment",
};

const typeTone = (type: TransactionType) =>
  type === "INCOME" || type === "LOAN_RECOVERY" ? "inflow" : "outflow";

const categoryName = (transaction: Transaction) => {
  if (typeof transaction.categoryId === "object" && transaction.categoryId) return transaction.categoryId.name;
  if (transaction.source) return transaction.source;
  return transaction.type === "EXPENSE" ? "General Expense" : "General";
};

const SummaryCard = ({
  label,
  value,
  helper,
  tone,
  icon: Icon,
}: {
  label: string;
  value: number;
  helper: string;
  tone: "success" | "danger" | "primary";
  icon: React.ElementType;
}) => {
  const toneClasses = {
    success: "bg-appSuccess/10 text-appSuccess",
    danger: "bg-appDanger/10 text-appDanger",
    primary: "bg-appPrimary/10 text-appPrimary",
  };

  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.05em] text-appMuted">{label}</p>
          <AmountText amount={Math.abs(value)} className={cn("mt-2 block text-2xl font-semibold", toneClasses[tone].split(" ")[1])} />
          <p className="mt-2 text-xs font-normal leading-5 text-appTextSecondary">{helper}</p>
        </div>
        <div className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-lg", toneClasses[tone])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
};

const FlowChip = ({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "h-9 rounded-md border px-3 text-sm font-medium transition-all",
      active
        ? "border-appPrimary bg-appPrimary text-white shadow-level1"
        : "border-appBorder bg-appCard text-appMuted hover:bg-appSurface hover:text-appText",
    )}
  >
    {label}
  </button>
);

export const Transactions: React.FC = () => {
  const navigate = useNavigate();
  const monthRange = useMemo(getMonthRange, []);
  const [search, setSearch] = useState("");
  const [type, setType] = useState<FlowFilter>("EXPENSE");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | "">("");
  const [categoryId, setCategoryId] = useState("");
  const [dateFrom, setDateFrom] = useState(monthRange.from);
  const [dateTo, setDateTo] = useState(monthRange.to);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedTxId, setSelectedTxId] = useState<string | null>(null);
  const { page, limit, setPage } = usePagination(1, 12);

  const listParams = {
    search: search || undefined,
    type: (type || undefined) as TransactionType | undefined,
    paymentMethod: (paymentMethod || undefined) as PaymentMethod | undefined,
    categoryId: categoryId || undefined,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
    page,
    limit,
    sortBy: "date",
    sortOrder: "desc",
  };

  const { transactions, categories, isLoading, deleteTransaction, isDeleting } = useTransactions(undefined, listParams);

  const summaryQuery = useQuery({
    queryKey: [QUERY_KEYS.TRANSACTIONS, "expense-summary", dateFrom, dateTo],
    queryFn: () =>
      transactionsApi.getTransactions({
        dateFrom,
        dateTo,
        page: 1,
        limit: 100,
        sortBy: "date",
        sortOrder: "desc",
      }),
  });

  const allCategories = categories || [];
  const filteredCategories = allCategories.filter((category) => {
    if (type === "EXPENSE" || type === "INCOME") return category.type === type;
    return true;
  });
  const txList = transactions?.transactions || [];
  const totalCount = transactions?.pagination?.total || 0;
  const totalPages = transactions?.pagination?.totalPages || 1;

  const summary = useMemo(() => {
    const rows = summaryQuery.data?.transactions || [];
    return rows.reduce(
      (acc, transaction) => {
        if (transaction.type === "INCOME") acc.income += transaction.amount;
        if (transaction.type === "EXPENSE") acc.expense += transaction.amount;
        if (transaction.type === "LOAN_RECOVERY") acc.loanRecovery += transaction.amount;
        if (transaction.type === "LOAN_REPAYMENT") acc.loanRepayment += transaction.amount;
        return acc;
      },
      { income: 0, expense: 0, loanRecovery: 0, loanRepayment: 0 },
    );
  }, [summaryQuery.data]);

  const net = summary.income + summary.loanRecovery - summary.expense - summary.loanRepayment;

  const expenseCategories = allCategories.filter((category) => category.type === "EXPENSE");
  const budgetTotal = expenseCategories.reduce((sum, category) => sum + Number(category.monthlyBudget || 0), 0);
  const budgetUsed = budgetTotal > 0 ? Math.min(100, Math.round((summary.expense / budgetTotal) * 100)) : 0;

  const handleDeleteClick = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedTxId(id);
    setDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedTxId) return;
    await deleteTransaction(selectedTxId);
    setDeleteOpen(false);
    setSelectedTxId(null);
  };

  const resetFilters = () => {
    setSearch("");
    setType("EXPENSE");
    setPaymentMethod("");
    setCategoryId("");
    setDateFrom(monthRange.from);
    setDateTo(monthRange.to);
    setPage(1);
  };

  const goAdd = (nextType: "EXPENSE" | "INCOME") => {
    navigate(`${ROUTES.ADD_TRANSACTION}?type=${nextType}`);
  };

  return (
    <div className="w-full space-y-7">
      <PageHeader
        kicker="Expenses"
        title="Expenses"
        description="Track monthly expenses, income, and loan cash flow from the same workspace."
        icon={<ReceiptText className="h-6 w-6" />}
        actions={
          <>
            <Button variant="secondary" size="sm" leftIcon={<Layers className="h-4 w-4" />} onClick={() => navigate(ROUTES.CATEGORIES)}>
              Categories
            </Button>
            <Button variant="danger" size="sm" leftIcon={<Plus className="h-4 w-4" />} onClick={() => goAdd("EXPENSE")}>
              Add Expense
            </Button>
            <Button variant="success" size="sm" leftIcon={<Plus className="h-4 w-4" />} onClick={() => goAdd("INCOME")}>
              Add Income
            </Button>
          </>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard label="Expenses" value={summary.expense} helper="Manual expenses this period" tone="danger" icon={ArrowUpRight} />
        <SummaryCard label="Income" value={summary.income} helper="Manual income this period" tone="success" icon={ArrowDownLeft} />
        <SummaryCard label="Net Cash Flow" value={net} helper="Income plus loan flow minus outflow" tone={net >= 0 ? "success" : "danger"} icon={WalletCards} />
      </div>

      <Card className="space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-appText">Monthly Overview</h2>
            <p className="mt-1 text-sm font-normal text-appTextSecondary">
              {budgetTotal > 0
                ? `${budgetUsed}% of your configured expense budget has been used.`
                : "Add category budgets to monitor monthly spending limits."}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <FlowChip label="Expense" active={type === "EXPENSE"} onClick={() => { setType("EXPENSE"); setCategoryId(""); setPage(1); }} />
            <FlowChip label="Income" active={type === "INCOME"} onClick={() => { setType("INCOME"); setCategoryId(""); setPage(1); }} />
            <FlowChip label="Recovery" active={type === "LOAN_RECOVERY"} onClick={() => { setType("LOAN_RECOVERY"); setCategoryId(""); setPage(1); }} />
            <FlowChip label="Repayment" active={type === "LOAN_REPAYMENT"} onClick={() => { setType("LOAN_REPAYMENT"); setCategoryId(""); setPage(1); }} />
            <FlowChip label="All" active={type === ""} onClick={() => { setType(""); setCategoryId(""); setPage(1); }} />
          </div>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-appBorder">
          <div
            className={cn("h-full rounded-full transition-all", budgetTotal > 0 && budgetUsed > 90 ? "bg-appDanger" : "bg-appPrimary")}
            style={{ width: budgetTotal > 0 ? `${budgetUsed}%` : "0%" }}
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-appSurface p-3">
            <p className="text-xs font-medium text-appMuted">Loan Recovery</p>
            <AmountText amount={summary.loanRecovery} className="mt-1 block text-sm font-semibold text-appSuccess" />
          </div>
          <div className="rounded-lg bg-appSurface p-3">
            <p className="text-xs font-medium text-appMuted">Loan Repayment</p>
            <AmountText amount={summary.loanRepayment} className="mt-1 block text-sm font-semibold text-appDanger" />
          </div>
          <div className="rounded-lg bg-appSurface p-3">
            <p className="text-xs font-medium text-appMuted">Expense Budget</p>
            <AmountText amount={budgetTotal} className="mt-1 block text-sm font-semibold text-appText" />
          </div>
          <div className="rounded-lg bg-appSurface p-3">
            <p className="text-xs font-medium text-appMuted">Categories</p>
            <p className="mt-1 text-sm font-semibold text-appText">{expenseCategories.length} expense categories</p>
          </div>
        </div>
      </Card>

      <Card>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-[1.4fr_0.9fr_0.9fr_0.9fr_0.9fr_auto]">
          <SearchInput
            placeholder="Search note or source..."
            value={search}
            onChange={(value) => {
              setSearch(value);
              setPage(1);
            }}
          />
          <InputDate label="From" value={dateFrom} onChange={(value) => { setDateFrom(value); setPage(1); }} />
          <InputDate label="To" value={dateTo} onChange={(value) => { setDateTo(value); setPage(1); }} />
          <Select
            label=""
            value={paymentMethod}
            onChange={(event) => {
              setPaymentMethod(event.target.value as PaymentMethod | "");
              setPage(1);
            }}
            options={[
              { label: "All Methods", value: "" },
              { label: "Cash", value: "CASH" },
              { label: "Bank", value: "BANK" },
              { label: "JazzCash", value: "JAZZCASH" },
              { label: "EasyPaisa", value: "EASYPAISA" },
              { label: "Other", value: "OTHER" },
            ]}
          />
          <Select
            label=""
            value={categoryId}
            onChange={(event) => {
              setCategoryId(event.target.value);
              setPage(1);
            }}
            options={[
              { label: "All Categories", value: "" },
              ...(type === "EXPENSE" || type === "INCOME" ? filteredCategories : []).map((category: Category) => ({
                label: category.name,
                value: category._id,
              })),
            ]}
          />
          <Button variant="outline" size="sm" className="h-10" leftIcon={<RefreshCw className="h-4 w-4" />} onClick={resetFilters}>
            Reset
          </Button>
        </div>
      </Card>

      <Card variant="bordered" className="overflow-hidden border-appBorder/50" padding="none">
        <Table
          headers={["Details", "Category", "Method", "Type", "Amount", "Actions"]}
          isLoading={isLoading}
          isEmpty={txList.length === 0}
          emptyComponent={
            <div className="mx-auto max-w-sm text-center">
              <p className="text-sm font-semibold text-appText">No expense records found.</p>
              <p className="mt-1 text-sm text-appMuted">Add an expense or adjust filters to view more records.</p>
              <Button className="mt-4" size="sm" variant="danger" leftIcon={<Plus className="h-4 w-4" />} onClick={() => goAdd("EXPENSE")}>
                Add Expense
              </Button>
            </div>
          }
        >
          {txList.map((transaction) => {
            const isInflow = typeTone(transaction.type) === "inflow";
            const catName = categoryName(transaction);
            const canEdit = !transaction.isAutoGenerated && (transaction.type === "INCOME" || transaction.type === "EXPENSE");
            return (
              <tr key={transaction._id} className="border-b border-appBorder last:border-0 hover:bg-appSurface">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-md", isInflow ? "bg-appSuccess/10 text-appSuccess" : "bg-appDanger/10 text-appDanger")}>
                      {isInflow ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="max-w-[240px] truncate text-sm font-medium text-appText">{transaction.note || transaction.source || catName}</p>
                      <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-appMuted">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {new Date(transaction.date || transaction.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 text-xs font-medium text-appMuted">
                    <Layers className="h-3.5 w-3.5 text-appPrimary" />
                    <span>{catName}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={transaction.paymentMethod === "CASH" ? "warning" : "primary"}>
                    {transaction.paymentMethod}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <span className={cn("text-xs font-semibold", isInflow ? "text-appSuccess" : "text-appDanger")}>
                    {typeLabels[transaction.type]}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <p className={cn("font-medium", isInflow ? "text-appSuccess" : "text-appDanger")}>
                    {isInflow ? "+" : "-"}<AmountText amount={transaction.amount} />
                  </p>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 px-0"
                      onClick={() => navigate(ROUTES.TRANSACTION_DETAIL.replace(":id", transaction._id))}
                      leftIcon={<Eye className="h-3.5 w-3.5" />}
                      title="View details"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 px-0"
                      disabled={!canEdit}
                      onClick={() => navigate(ROUTES.EDIT_TRANSACTION.replace(":id", transaction._id))}
                      leftIcon={<Edit3 className="h-3.5 w-3.5" />}
                      title={canEdit ? "Edit transaction" : "Auto-generated loan transactions are edited from payments"}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 px-0 text-appDanger hover:text-appDanger"
                      disabled={transaction.isAutoGenerated}
                      onClick={(event) => handleDeleteClick(transaction._id, event)}
                      leftIcon={<Trash2 className="h-3.5 w-3.5" />}
                      title={transaction.isAutoGenerated ? "Auto-generated loan transactions are deleted from payments" : "Delete transaction"}
                    />
                  </div>
                </td>
              </tr>
            );
          })}
        </Table>

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-appBorder px-6 py-4">
            <span className="text-xs text-appMuted">
              Showing {(page - 1) * limit + 1} - {Math.min(page * limit, totalCount)} of {totalCount} records
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(page + 1)}>
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      <ConfirmDialog
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Transaction"
        message="Are you sure you want to delete this manual income or expense record?"
        confirmText={isDeleting ? "Deleting..." : "Delete"}
        isDestructive
        isLoading={isDeleting}
      />
    </div>
  );
};

const InputDate = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) => (
  <label className="flex h-10 items-center gap-2 rounded-md border border-appBorder bg-appInput px-3 text-sm text-appMuted">
    <span className="shrink-0 text-xs font-medium">{label}</span>
    <input
      type="date"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="min-w-0 flex-1 bg-transparent text-sm font-normal text-appText outline-none"
    />
  </label>
);

export default Transactions;
