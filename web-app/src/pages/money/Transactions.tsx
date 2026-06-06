import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Layers,
  Trash2,
  Eye,
  RefreshCw,
  WalletCards
} from "lucide-react";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Select from "../../components/common/Select";
import Table from "../../components/common/Table";
import Badge from "../../components/common/Badge";
import AmountText from "../../components/common/AmountText";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import PageHeader from "../../components/common/PageHeader";
import SearchInput from "../../components/common/SearchInput";
import { useTransactions } from "../../hooks/useTransactions";
import { usePagination } from "../../hooks/usePagination";
import { ROUTES } from "../../config/routes.config";
import { TransactionType, PaymentMethod } from "../../types";

export const Transactions: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [type, setType] = useState<TransactionType | "">("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | "">("");
  const [categoryId, setCategoryId] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedTxId, setSelectedTxId] = useState<string | null>(null);

  // Pagination hook
  const { page, limit, setPage } = usePagination(1, 10);

  // Query hook
  const listParams = {
    search: search || undefined,
    type: (type || undefined) as TransactionType | undefined,
    paymentMethod: (paymentMethod || undefined) as PaymentMethod | undefined,
    categoryId: categoryId || undefined,
    page,
    limit,
  };

  const { transactions, categories, isLoading, deleteTransaction, isDeleting } = useTransactions(undefined, listParams);

  const txList = transactions?.transactions || [];
  const totalCount = transactions?.pagination?.total || 0;
  const totalPages = transactions?.pagination?.totalPages || 1;

  const handleDeleteClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedTxId(id);
    setDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedTxId) {
      await deleteTransaction(selectedTxId);
      setDeleteOpen(false);
      setSelectedTxId(null);
    }
  };

  const getCategoryName = (tx: any) => {
    if (typeof tx.categoryId === "object" && tx.categoryId) {
      return tx.categoryId.name;
    }
    return "General";
  };

  return (
    <div className="w-full space-y-6">
      <PageHeader
        kicker="Expenses"
        title="Transactions Ledger"
        description="Unified view of expenses, income, loan recoveries, and loan repayments."
        icon={<WalletCards className="h-6 w-6" />}
        actions={
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={() => navigate(ROUTES.ADD_TRANSACTION)}
          >
            Add Transaction
          </Button>
        }
      />

      {/* Filters row */}
      <Card variant="bordered">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
          <div>
            <SearchInput
              placeholder="Search descriptions..."
              value={search}
              onChange={(value) => {
                setSearch(value);
                setPage(1);
              }}
            />
          </div>

          <Select
            label=""
            value={type}
            onChange={(e) => {
              setType(e.target.value as TransactionType | "");
              setPage(1);
            }}
            options={[
              { label: "All Types", value: "" },
              { label: "Income", value: "INCOME" },
              { label: "Expense", value: "EXPENSE" },
              { label: "Loan Recovery", value: "LOAN_RECOVERY" },
              { label: "Loan Repayment", value: "LOAN_REPAYMENT" },
            ]}
          />

          <Select
            label=""
            value={paymentMethod}
            onChange={(e) => {
              setPaymentMethod(e.target.value as PaymentMethod | "");
              setPage(1);
            }}
            options={[
              { label: "All Methods", value: "" },
              { label: "Cash", value: "CASH" },
              { label: "Bank Transfer", value: "BANK" },
              { label: "JazzCash", value: "JAZZCASH" },
              { label: "EasyPaisa", value: "EASYPAISA" },
              { label: "Other", value: "OTHER" },
            ]}
          />

          <Select
            label=""
            value={categoryId}
            onChange={(e) => {
              setCategoryId(e.target.value);
              setPage(1);
            }}
            options={[
              { label: "All Categories", value: "" },
              ...(categories || []).map((cat) => ({
                label: cat.name,
                value: cat._id,
              })),
            ]}
          />

          <div className="flex items-center justify-between sm:justify-end gap-2 md:col-span-4 lg:col-span-1">
            <Button
              variant="outline"
              size="sm"
              className="w-full sm:w-auto"
              leftIcon={<RefreshCw className="h-4 w-4" />}
              onClick={() => {
                setSearch("");
                setType("");
                setPaymentMethod("");
                setCategoryId("");
                setPage(1);
              }}
            >
              Reset Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Transactions Table Card */}
      <Card variant="bordered" className="overflow-hidden border-appBorder/50" padding="none">
        <Table
          headers={["Details", "Category", "Method", "Type", "Amount", "Actions"]}
          isLoading={isLoading}
          isEmpty={txList.length === 0}
        >
          {txList.map((tx: any) => {
            const isIncome = tx.type === "INCOME" || tx.type === "LOAN_RECOVERY";
            const catName = getCategoryName(tx);
            return (
              <tr key={tx._id} className="hover:bg-appBgSoft border-b border-appBorder last:border-0">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${isIncome ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400" : "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400"}`}>
                      {isIncome ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownLeft className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="font-semibold text-appText truncate max-w-[200px]">{tx.note || catName}</p>
                      <p className="text-xs text-appMuted">{new Date(tx.date || tx.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1 text-xs text-appMuted font-medium">
                    <Layers className="h-3.5 w-3.5 text-indigo-500" />
                    <span>{catName}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge variant={tx.paymentMethod === "CASH" ? "warning" : "primary"}>
                    {tx.paymentMethod}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-bold ${isIncome ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                    {tx.type}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <p className={`font-bold ${isIncome ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                    {isIncome ? "+" : "-"}<AmountText amount={tx.amount} />
                  </p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(ROUTES.TRANSACTION_DETAIL.replace(":id", tx._id))}
                      leftIcon={<Eye className="h-3.5 w-3.5" />}
                      title="View Details"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-rose-500 hover:text-rose-600"
                      onClick={(e) => handleDeleteClick(tx._id, e)}
                      leftIcon={<Trash2 className="h-3.5 w-3.5" />}
                      title="Delete Transaction"
                    />
                  </div>
                </td>
              </tr>
            );
          })}
        </Table>

        {/* Pagination HUD */}
        {totalPages > 1 && (
          <div className="py-4 px-6 border-t border-appBorder flex items-center justify-between">
            <span className="text-xs text-appMuted">
              Showing {(page - 1) * limit + 1} - {Math.min(page * limit, totalCount)} of {totalCount} records
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Delete confirmation dialog */}
      <ConfirmDialog
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Transaction"
        message="Are you sure you want to delete this transaction? Auto-generated loan transactions must be changed from the original payment."
        confirmText={isDeleting ? "Deleting..." : "Delete"}
        isDestructive={true}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default Transactions;
