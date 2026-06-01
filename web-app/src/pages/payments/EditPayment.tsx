import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { ArrowLeft, Edit } from "lucide-react";
import usePayments from "../../hooks/usePayments";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import DatePicker from "../../components/common/DatePicker";
import Card from "../../components/common/Card";
import LoadingState from "../../components/common/LoadingState";
import { ROUTES } from "../../config/routes.config";

const paymentSchema = zod.object({
  amount: zod.coerce.number().min(1, "Amount must be greater than 0"),
  paymentMethod: zod.enum(["CASH", "BANK", "JAZZCASH", "EASYPAISA", "OTHER"]),
  paymentDate: zod.string().min(1, "Payment date is required"),
  note: zod.string().optional(),
});

type PaymentFormInputs = zod.infer<typeof paymentSchema>;

export const EditPayment: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { payment, isPaymentLoading, updatePayment, isUpdating } = usePayments(undefined, id);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PaymentFormInputs>({
    resolver: zodResolver(paymentSchema) as any,
  });

  const [maxAmount, setMaxAmount] = useState<number | null>(null);

  // Once payment is loaded, prepopulate form
  useEffect(() => {
    if (payment) {
      reset({
        amount: payment.amount,
        paymentMethod: payment.method as any,
        paymentDate: payment.paymentDate ? new Date(payment.paymentDate).toISOString().slice(0, 10) : "",
        note: payment.note || "",
      });

      // Calculate max amount allowed for edit: remainingAmount + original payment amount
      if (payment.loanId) {
        const remaining = (payment.loanId as any).remainingAmount || 0;
        setMaxAmount(remaining + payment.amount);
      }
    }
  }, [payment, reset]);

  const onSubmit = async (data: PaymentFormInputs) => {
    if (!id) return;
    if (maxAmount !== null && data.amount > maxAmount) {
      setFormError(`Payment amount cannot exceed the maximum remaining due of PKR ${maxAmount}.`);
      return;
    }
    
    setFormError(null);
    try {
      await updatePayment({
        id,
        payload: {
          amount: data.amount,
          method: data.paymentMethod as any,
          paymentDate: new Date(data.paymentDate),
          note: data.note,
        },
      });
      navigate(-1);
    } catch (err: any) {
      setFormError(err.response?.data?.message || "Failed to update payment.");
    }
  };

  const methodOptions = [
    { label: "Cash", value: "CASH" },
    { label: "Bank Transfer", value: "BANK" },
    { label: "JazzCash", value: "JAZZCASH" },
    { label: "EasyPaisa", value: "EASYPAISA" },
    { label: "Other", value: "OTHER" },
  ];

  if (isPaymentLoading) {
    return <LoadingState message="Retrieving payment details..." type="spinner" />;
  }

  if (!payment) {
    return (
      <Card variant="bordered" className="p-6 text-center max-w-2xl mx-auto mt-10">
        <h3 className="text-base font-extrabold text-appText">Payment Record Not Found</h3>
        <p className="text-xs text-appMuted mt-1 mb-4">Could not load payment file details.</p>
        <Button variant="outline" className="mx-auto" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </Card>
    );
  }

  const loanDesc = (payment.loanId as any)?.description || "Loan";
  const contactName = (payment.contactId as any)?.name || "Debtor";

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header bar */}
      <div className="flex items-center gap-3 select-none">
        <button
          onClick={() => navigate(-1)}
          className="text-appMuted hover:text-appText p-1.5 rounded-lg hover:bg-appBgSoft border border-transparent hover:border-appBorder transition-all"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h2 className="text-xl font-extrabold text-appText flex items-center gap-2">
            <Edit className="h-5.5 w-5.5 text-appPrimary animate-pulse" /> Edit Repayment Record
          </h2>
          <p className="text-xs text-appMuted mt-0.5">
            Modify payment amount or channel logged for {contactName}'s loan "{loanDesc}".
          </p>
        </div>
      </div>

      {/* Form Card */}
      <Card variant="bordered" className="border border-appBorder/50">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {formError && (
            <div className="rounded-xl bg-appDanger/10 border border-appDanger/25 p-3.5 text-center text-xs font-semibold text-appDanger">
              {formError}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              id="amount"
              type="number"
              label="Repayment Amount (PKR) *"
              placeholder="5000"
              helperText={maxAmount !== null ? `Max balance credit allowed: PKR ${maxAmount}` : undefined}
              error={errors.amount?.message}
              disabled={isUpdating}
              {...register("amount" as any)}
            />

            <Select
              id="paymentMethod"
              label="Payment Method *"
              options={methodOptions}
              error={errors.paymentMethod?.message}
              disabled={isUpdating}
              {...register("paymentMethod" as any)}
            />
          </div>

          <DatePicker
            id="paymentDate"
            label="Payment Received Date *"
            error={errors.paymentDate?.message}
            disabled={isUpdating}
            {...register("paymentDate" as any)}
          />

          <Input
            id="note"
            type="text"
            label="Description Notes"
            placeholder="Repayment via JazzCash mobile transfer"
            error={errors.note?.message}
            disabled={isUpdating}
            {...register("note" as any)}
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-appBorder/40 select-none">
            <Button variant="outline" size="sm" type="button" onClick={() => navigate(-1)} disabled={isUpdating}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" isLoading={isUpdating}>
              Update Payment
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default EditPayment;
