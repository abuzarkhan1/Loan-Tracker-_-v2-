import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { ArrowLeft, Coins } from "lucide-react";
import usePayments from "../../hooks/usePayments";
import useLoans from "../../hooks/useLoans";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import DatePicker from "../../components/common/DatePicker";
import Card from "../../components/common/Card";
import { ROUTES } from "../../config/routes.config";


const paymentSchema = zod.object({
  loanId: zod.string().min(1, "Loan file selection is required"),
  amount: zod.coerce.number().min(1, "Amount must be greater than 0"),
  method: zod.enum(["CASH", "BANK", "JAZZCASH", "EASYPAISA", "OTHER"]),
  paymentDate: zod.string().min(1, "Payment date is required"),
  note: zod.string().optional(),
});

type PaymentFormInputs = zod.infer<typeof paymentSchema>;

export const AddPayment: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addPayment, isAdding } = usePayments();
  const { loans } = useLoans(undefined, { limit: 100, status: "ACTIVE" });
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PaymentFormInputs>({
    resolver: zodResolver(paymentSchema) as any,
    defaultValues: {
      loanId: searchParams.get("loanId") || "",
      method: "CASH",
      paymentDate: new Date().toISOString().slice(0, 10),
      note: "",
    },
  });

  const selectedLoanId = watch("loanId");
  const [maxAmount, setMaxAmount] = useState<number | null>(null);

  // Set limits based on selected loan remaining amounts
  useEffect(() => {
    if (selectedLoanId && loans?.loans) {
      const targetLoan = loans.loans.find((l: any) => (l._id || l.id) === selectedLoanId);
      if (targetLoan) {
        setMaxAmount(targetLoan.remainingAmount);
        setValue("amount", targetLoan.remainingAmount);
      }
    }
  }, [selectedLoanId, loans, setValue]);

  const onSubmit = async (data: PaymentFormInputs) => {
    if (maxAmount !== null && data.amount > maxAmount) {
      setFormError(`Payment amount cannot exceed the remaining loan due of PKR ${maxAmount}.`);
      return;
    }
    
    setFormError(null);
    try {
      await addPayment(data);
      if (selectedLoanId) {
        navigate(ROUTES.LOAN_DETAIL.replace(":id", selectedLoanId));
      } else {
        navigate(ROUTES.LOANS);
      }
    } catch (err: any) {
      setFormError(err.response?.data?.message || "Failed to log payment.");
    }
  };

  const loanOptions = (loans?.loans || []).map((l: any) => ({
    label: `${l.description || "Loan"} (${(l.contactId as any)?.name || "Unknown Contact"}) - Due: PKR ${l.remainingAmount}`,
    value: l._id || l.id,
  }));

  // Re-map enums value matching the backend JAZZCASH, EASYPAISA
  const methodOptions = [
    { label: "Cash", value: "CASH" },
    { label: "Bank Transfer", value: "BANK" },
    { label: "JazzCash", value: "JAZZCASH" },
    { label: "EasyPaisa", value: "EASYPAISA" },
    { label: "Other", value: "OTHER" },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header bar */}
      <div className="flex items-center gap-3 select-none">
        <button
          onClick={() => navigate(-1)}
          className="text-appMuted hover:text-appText p-1.5 rounded-lg hover:bg-appBgSoft border border-transparent hover:border-appBorder transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h2 className="text-lg font-semibold text-appText flex items-center gap-2">
            <Coins className="h-5 w-5 text-appPrimary" /> Log Repayment
          </h2>
          <p className="text-xs text-appMuted mt-0.5">Record a partial or full payment made against a loan liability.</p>
        </div>
      </div>

      {/* Form Card */}
      <Card variant="bordered" className="border border-appBorder/50">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {formError && (
            <div className="rounded-lg border border-appDanger/25 bg-appDanger/10 p-3.5 text-center text-xs font-semibold text-appDanger">
              {formError}
            </div>
          )}

          <Select
            id="loanId"
            label="Select Active Loan *"
            placeholder="Choose an active loan file"
            options={loanOptions}
            error={errors.loanId?.message}
            disabled={isAdding}
            {...register("loanId" as any)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              id="amount"
              type="number"
              label="Repayment Amount (PKR) *"
              placeholder="5000"
              helperText={maxAmount !== null ? `Max due: PKR ${maxAmount}` : undefined}
              error={errors.amount?.message}
              disabled={isAdding}
              {...register("amount" as any)}
            />

            <Select
              id="method"
              label="Payment Method *"
              options={methodOptions}
              error={errors.method?.message}
              disabled={isAdding}
              {...register("method" as any)}
            />
          </div>

          <DatePicker
            id="paymentDate"
            label="Payment Received Date *"
            error={errors.paymentDate?.message}
            disabled={isAdding}
            {...register("paymentDate" as any)}
          />

          <Input
            id="note"
            type="text"
            label="Description Notes"
            placeholder="Repayment via JazzCash mobile transfer"
            error={errors.note?.message}
            disabled={isAdding}
            {...register("note" as any)}
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-appBorder/40 select-none">
            <Button variant="outline" size="sm" type="button" onClick={() => navigate(-1)} disabled={isAdding}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" isLoading={isAdding}>
              Log Payment
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddPayment;
