import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import * as z from "zod";
import { AlertCircle, ArrowLeft } from "lucide-react";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import { contactsApi } from "../../api/contacts.api";
import { useTransactions } from "../../hooks/useTransactions";
import { ROUTES } from "../../config/routes.config";

const transactionSchema = z.object({
  amount: z.coerce.number().min(1, "Amount must be greater than 0"),
  type: z.enum(["INCOME", "EXPENSE"]),
  categoryId: z.string().min(1, "Please select a category"),
  paymentMethod: z.enum(["CASH", "BANK", "JAZZCASH", "EASYPAISA", "OTHER"]),
  paymentDate: z.string().min(1, "Date is required"),
  description: z.string().optional(),
  linkedContactId: z.string().optional(),
});

type TransactionFormInputs = z.infer<typeof transactionSchema>;

export const AddTransaction: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formError, setFormError] = useState<string | null>(null);
  const { createTransaction, isCreating, categories } = useTransactions();

  const { data: contactsData } = useQuery({
    queryKey: ["contacts_list_minimal"],
    queryFn: () => contactsApi.getContacts({ limit: 100 }),
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TransactionFormInputs>({
    resolver: zodResolver(transactionSchema) as any,
    defaultValues: {
      type: searchParams.get("type") === "INCOME" ? "INCOME" : "EXPENSE",
      paymentMethod: "CASH",
      paymentDate: new Date().toISOString().split("T")[0],
      categoryId: "",
      description: "",
      linkedContactId: "",
    },
  });

  const selectedType = watch("type");
  const filteredCategories = (categories || []).filter((category) => category.type === selectedType && category.isActive !== false);

  const onSubmit = async (data: TransactionFormInputs) => {
    setFormError(null);
    try {
      await createTransaction({
        amount: Number(data.amount),
        type: data.type,
        categoryId: data.categoryId,
        paymentMethod: data.paymentMethod,
        date: data.paymentDate,
        note: data.description || undefined,
        linkedContactId: data.linkedContactId || undefined,
      });
      navigate(ROUTES.TRANSACTIONS);
    } catch (err: any) {
      setFormError(err.response?.data?.message || "Failed to save transaction.");
    }
  };

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="rounded-lg border border-transparent p-1.5 text-appMuted transition-all hover:border-appBorder hover:bg-appBgSoft hover:text-appText"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-xl font-extrabold text-appText">
            Add {selectedType === "INCOME" ? "Income" : "Expense"}
          </h1>
          <p className="text-xs font-semibold text-appMuted">Record a simple personal cash-flow entry.</p>
        </div>
      </div>

      <Card variant="bordered" className="border-appBorder/50">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {formError && (
            <div className="flex items-center gap-2 rounded-xl border border-appDanger/25 bg-appDanger/10 p-3 text-xs font-semibold text-appDanger">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 rounded-2xl bg-appBgSoft p-1">
            <button
              type="button"
              onClick={() => {
                setValue("type", "EXPENSE");
                setValue("categoryId", "");
              }}
              className={`rounded-xl py-2 text-sm font-bold transition-all ${
                selectedType === "EXPENSE" ? "bg-appDanger text-white shadow-sm" : "text-appMuted hover:text-appText"
              }`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => {
                setValue("type", "INCOME");
                setValue("categoryId", "");
              }}
              className={`rounded-xl py-2 text-sm font-bold transition-all ${
                selectedType === "INCOME" ? "bg-appSuccess text-white shadow-sm" : "text-appMuted hover:text-appText"
              }`}
            >
              Income
            </button>
          </div>

          <Input
            label="Amount (PKR)"
            type="number"
            placeholder="0"
            error={errors.amount?.message}
            {...register("amount")}
          />

          <Select
            label="Category"
            value={watch("categoryId") || ""}
            onChange={(event) => setValue("categoryId", event.target.value)}
            error={errors.categoryId?.message}
            options={[
              { label: "Choose category...", value: "" },
              ...filteredCategories.map((category) => ({ label: category.name, value: category._id })),
            ]}
          />

          <Select
            label="Payment Method"
            error={errors.paymentMethod?.message}
            {...register("paymentMethod")}
            options={[
              { label: "Cash", value: "CASH" },
              { label: "Bank", value: "BANK" },
              { label: "JazzCash", value: "JAZZCASH" },
              { label: "EasyPaisa", value: "EASYPAISA" },
              { label: "Other", value: "OTHER" },
            ]}
          />

          <Input
            label="Date"
            type="date"
            error={errors.paymentDate?.message}
            {...register("paymentDate")}
          />

          <Input
            label="Note"
            placeholder="Groceries, freelance work, gift..."
            error={errors.description?.message}
            {...register("description")}
          />

          <Select
            label="Link Contact (Optional)"
            error={errors.linkedContactId?.message}
            {...register("linkedContactId")}
            options={[
              { label: "None", value: "" },
              ...(contactsData?.contacts || []).map((contact) => ({ label: contact.name, value: contact._id })),
            ]}
          />

          <div className="flex justify-end gap-2 border-t border-appBorder/40 pt-4">
            <Button type="button" variant="outline" onClick={() => navigate(-1)} disabled={isCreating}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isCreating}>
              Save Transaction
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddTransaction;
