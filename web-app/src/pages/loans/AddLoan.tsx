import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { ArrowLeft, HandCoins } from "lucide-react";
import useLoans from "../../hooks/useLoans";
import useContacts from "../../hooks/useContacts";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import DatePicker from "../../components/common/DatePicker";
import Card from "../../components/common/Card";
import { ROUTES } from "../../config/routes.config";

const loanSchema = zod.object({
  contactId: zod.string().min(1, "Contact is required"),
  amount: zod.coerce.number().min(1, "Amount must be greater than 0"),
  type: zod.enum(["GIVEN", "TAKEN"]),
  description: zod.string().min(1, "Description/Purpose is required"),
  issueDate: zod.string().min(1, "Issue date is required"),
  dueDate: zod.string().min(1, "Due date is required"),
});

type LoanFormInputs = zod.infer<typeof loanSchema>;

export const AddLoan: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { createLoan, isCreating } = useLoans();
  const { contacts } = useContacts(undefined, { limit: 100 });
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoanFormInputs>({
    resolver: zodResolver(loanSchema) as any,
    defaultValues: {
      contactId: searchParams.get("contactId") || "",
      type: searchParams.get("type") === "TAKEN" ? "TAKEN" : "GIVEN",
      issueDate: new Date().toISOString().slice(0, 10),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    },
  });

  const onSubmit = async (data: LoanFormInputs) => {
    setFormError(null);
    try {
      await createLoan(data);
      navigate(ROUTES.LOANS);
    } catch (err: any) {
      setFormError(err.response?.data?.message || "Failed to create loan record.");
    }
  };

  const contactOptions = (contacts?.contacts || []).map((c: any) => ({
    label: c.name,
    value: c._id || c.id,
  }));

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header bar */}
      <div className="flex items-center gap-3 select-none">
        <button
          onClick={() => navigate(ROUTES.LOANS)}
          className="text-appMuted hover:text-appText p-1.5 rounded-lg hover:bg-appBgSoft border border-transparent hover:border-appBorder transition-all"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h2 className="text-xl font-extrabold text-appText flex items-center gap-2">
            <HandCoins className="h-5 w-5 text-appPrimary animate-pulse" /> Add Loan Record
          </h2>
          <p className="text-xs text-appMuted mt-0.5">Log a new loan given to or taken from a contact.</p>
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
            <Select
              id="contactId"
              label="Select Contact *"
              placeholder="Choose a contact"
              options={contactOptions}
              error={errors.contactId?.message}
              disabled={isCreating}
              {...register("contactId" as any)}
            />

            <Select
              id="type"
              label="Loan Type *"
              options={[
                { label: "Given (Lene Hain - Inflow Expected)", value: "GIVEN" },
                { label: "Taken (Dene Hain - Outflow Expected)", value: "TAKEN" },
              ]}
              error={errors.type?.message}
              disabled={isCreating}
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
              disabled={isCreating}
              {...register("amount" as any)}
            />

            <Input
              id="description"
              type="text"
              label="Description / Purpose *"
              placeholder="Loan for school fees or home bills"
              error={errors.description?.message}
              disabled={isCreating}
              {...register("description" as any)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DatePicker
              id="issueDate"
              label="Issue Date *"
              error={errors.issueDate?.message}
              disabled={isCreating}
              {...register("issueDate" as any)}
            />

            <DatePicker
              id="dueDate"
              label="Repayment Due Date *"
              error={errors.dueDate?.message}
              disabled={isCreating}
              {...register("dueDate" as any)}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-appBorder/40 select-none">
            <Button variant="outline" size="sm" type="button" onClick={() => navigate(ROUTES.LOANS)} disabled={isCreating}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" isLoading={isCreating}>
              Save Loan Record
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddLoan;
