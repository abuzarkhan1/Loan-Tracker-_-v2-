import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, ArrowLeft, HandCoins } from "lucide-react";
import * as z from "zod";
import AmountText from "../../components/common/AmountText";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import ErrorState from "../../components/common/ErrorState";
import Input from "../../components/common/Input";
import LoadingState from "../../components/common/LoadingState";
import { ROUTES } from "../../config/routes.config";
import { useGoalDetail, useGoalMutations } from "../../hooks/useGoals";
import { toDateInput } from "../../lib/formatDate";

const contributionSchema = z.object({
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  date: z.string().min(1, "Date is required"),
  note: z.string().trim().max(500).optional(),
});

type ContributionFormInputs = z.input<typeof contributionSchema>;
type ContributionFormOutput = z.output<typeof contributionSchema>;

const getErrorMessage = (error: unknown, fallback: string) => {
  if (typeof error === "object" && error !== null && "response" in error) {
    const response = (error as { response?: { data?: { message?: string } } }).response;
    return response?.data?.message || fallback;
  }
  return fallback;
};

export const AddGoalContribution: React.FC = () => {
  const { id, contributionId } = useParams<{ id: string; contributionId?: string }>();
  const navigate = useNavigate();
  const goalQuery = useGoalDetail(id);
  const { addContribution, updateContribution, isAddingContribution, isUpdatingContribution } = useGoalMutations();
  const [formError, setFormError] = useState<string | null>(null);
  const isEditing = Boolean(contributionId);

  const contribution = useMemo(
    () => goalQuery.data?.contributions.find((item) => item._id === contributionId),
    [contributionId, goalQuery.data?.contributions],
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContributionFormInputs, unknown, ContributionFormOutput>({
    resolver: zodResolver(contributionSchema),
    defaultValues: {
      amount: 0,
      date: new Date().toISOString().slice(0, 10),
      note: "",
    },
  });

  useEffect(() => {
    if (contribution) {
      reset({
        amount: contribution.amount,
        date: toDateInput(contribution.date),
        note: contribution.note || "",
      });
    }
  }, [contribution, reset]);

  const onSubmit = async (data: ContributionFormOutput) => {
    if (!id) return;
    setFormError(null);
    try {
      const payload = {
        amount: Number(data.amount),
        date: data.date,
        note: data.note?.trim() || undefined,
      };
      const result = isEditing && contributionId
        ? await updateContribution({ goalId: id, contributionId, payload })
        : await addContribution({ goalId: id, payload });

      navigate(ROUTES.GOAL_DETAIL.replace(":id", id), {
        state: result.message ? { goalMessage: result.message } : undefined,
      });
    } catch (err: unknown) {
      setFormError(getErrorMessage(err, "Goal money save nahi ho saka."));
    }
  };

  if (goalQuery.isLoading) return <LoadingState message="Loading goal..." type="spinner" />;
  if (goalQuery.isError || !goalQuery.data || !id) {
    return <ErrorState onRetry={goalQuery.refetch} message="Goal load nahi ho saka." />;
  }
  if (isEditing && !contribution) {
    return <ErrorState onRetry={goalQuery.refetch} message="Contribution not found." />;
  }

  const { goal } = goalQuery.data;
  const isSaving = isAddingContribution || isUpdatingContribution;

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <button
        onClick={() => navigate(ROUTES.GOAL_DETAIL.replace(":id", id))}
        className="flex items-center gap-1.5 text-sm font-bold text-appMuted transition-colors hover:text-appText"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Goal
      </button>

      <div>
        <h1 className="text-2xl font-extrabold text-appText">{isEditing ? "Edit Saved Money" : "Add Money"}</h1>
        <p className="text-sm font-semibold text-appMuted">
          Add progress toward <span className="text-appText">{goal.title}</span>.
        </p>
      </div>

      <Card variant="flat" className="border border-appBorder/30">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-appMuted">Remaining</p>
            <AmountText amount={goal.remainingAmount} className="mt-1 block text-xl font-extrabold text-appPrimary" />
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-appPeach text-appPrimary">
            <HandCoins className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-appBorder">
          <div className="h-full rounded-full bg-appPrimary" style={{ width: `${goal.progressPercent}%` }} />
        </div>
      </Card>

      <Card variant="bordered" className="border-appBorder/50">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {formError && (
            <div className="flex items-center gap-2 rounded-xl border border-appDanger/25 bg-appDanger/10 p-3 text-xs font-semibold text-appDanger">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <Input
            label="Amount (PKR)"
            type="number"
            min="1"
            placeholder="5000"
            error={errors.amount?.message}
            {...register("amount")}
          />

          <Input
            label="Date"
            type="date"
            error={errors.date?.message}
            {...register("date")}
          />

          <Input
            label="Note"
            placeholder="Saved from this week..."
            error={errors.note?.message}
            {...register("note")}
          />

          <div className="flex justify-end gap-2 border-t border-appBorder/40 pt-4">
            <Button type="button" variant="outline" onClick={() => navigate(-1)} disabled={isSaving}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSaving}>
              {isEditing ? "Save Money" : "Add Money"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddGoalContribution;
