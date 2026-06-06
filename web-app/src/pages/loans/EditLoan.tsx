import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { ArrowLeft, HandCoins } from "lucide-react";
import useLoans from "../../hooks/useLoans";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import DatePicker from "../../components/common/DatePicker";
import Card from "../../components/common/Card";
import LoadingState from "../../components/common/LoadingState";
import ErrorState from "../../components/common/ErrorState";
import { ROUTES } from "../../config/routes.config";

const loanSchema = zod.object({
  amount: zod.coerce.number().min(1, "Amount must be greater than 0"),
  type: zod.enum(["GIVEN", "TAKEN"]),
  description: zod.string().min(1, "Description/Purpose is required"),
  issueDate: zod.string().min(1, "Issue date is required"),
  dueDate: zod.string().min(1, "Due date is required"),
});

type LoanFormInputs = zod.infer<typeof loanSchema>;

export const EditLoan: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { loanDetail, updateLoan, isUpdating, isLoading, error, refetch } = useLoans(id);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoanFormInputs>({
    resolver: zodResolver(loanSchema) as any,
  });

  useEffect(() => {
    if (loanDetail?.loan) {
      const loan = loanDetail.loan;
      setValue("amount", loan.amount);
      setValue("type", loan.type);
      setValue("description", loan.description || "");
      setValue("issueDate", new Date(loan.issueDate).toISOString().slice(0, 10));
      setValue("dueDate", loan.dueDate ? new Date(loan.dueDate).toISOString().slice(0, 10) : "");
    }
  }, [loanDetail, setValue]);

  const onSubmit = async (data: LoanFormInputs) => {
    if (!id) return;
    setFormError(null);
    try {
      await updateLoan({ id, payload: data });
      navigate(ROUTES.LOAN_DETAIL.replace(":id", id));
    } catch (err: any) {
      setFormError(err.response?.data?.message || "Failed to update loan record.");
    }
  };

  if (isLoading) {
    return <LoadingState message="Retrieving loan data..." type="spinner" />;
  }

  if (error || !loanDetail?.loan) {
    return <ErrorState onRetry={refetch} message="Could not load loan details to edit." />;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header bar */}
      <div className="flex items-center gap-3 select-none">
        <button
          onClick={() => navigate(ROUTES.LOAN_DETAIL.replace(":id", id!))}
          className="text-appMuted hover:text-appText p-1.5 rounded-lg hover:bg-appBgSoft border border-transparent hover:border-appBorder transition-all"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h2 className="text-xl font-extrabold text-appText flex items-center gap-2">
            <HandCoins className="h-5 w-5 text-appPrimary animate-pulse" /> Edit Loan Record
          </h2>
          <p className="text-xs text-appMuted mt-0.5">Modify loan metadata, due dates, or descriptions.</p>
        </div>
      </div>

      {/* Card wizard */}
      <Card variant="bordered" className="border border-appBorder/50">
        <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-4">
          {formError && (
            <div className="rounded-xl bg-appDanger/10 border border-appDanger/25 p-3.5 text-center text-xs font-semibold text-appDanger">
              {formError}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-appMuted">Linked Contact</span>
              <div className="w-full rounded-xl border border-appBorder/50 bg-appBgSoft/40 px-4 py-2.5 text-sm font-semibold text-appMuted select-none">
                {(loanDetail.loan.contactId as any)?.name || "Unknown"}
              </div>
            </div>

            <Select
              id="type"
              label="Loan Type *"
              options={[
                { label: "Given (Lene Hain - Inflow Expected)", value: "GIVEN" },
                { label: "Taken (Dene Hain - Outflow Expected)", value: "TAKEN" },
              ]}
              error={errors.type?.message}
              disabled={isUpdating}
              {...register("type" as any)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              id="amount"
              type="number"
              label="Principal Amount (PKR) *"
              placeholder="5000"
              error={errors.amount?.message}
              disabled={isUpdating}
              {...register("amount" as any)}
            />

            <Input
              id="description"
              type="text"
              label="Description / Purpose *"
              placeholder="Loan for school fees or home bills"
              error={errors.description?.message}
              disabled={isUpdating}
              {...register("description" as any)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DatePicker
              id="issueDate"
              label="Issue Date *"
              error={errors.issueDate?.message}
              disabled={isUpdating}
              {...register("issueDate" as any)}
            />

            <DatePicker
              id="dueDate"
              label="Repayment Due Date *"
              error={errors.dueDate?.message}
              disabled={isUpdating}
              {...register("dueDate" as any)}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-appBorder/40 select-none">
            <Button variant="outline" size="sm" type="button" onClick={() => navigate(ROUTES.LOAN_DETAIL.replace(":id", id!))} disabled={isUpdating}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" isLoading={isUpdating}>
              Save Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default EditLoan;
