import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, ArrowLeft, Target } from "lucide-react";
import * as z from "zod";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import ErrorState from "../../components/common/ErrorState";
import Input from "../../components/common/Input";
import LoadingState from "../../components/common/LoadingState";
import { ROUTES } from "../../config/routes.config";
import { useGoalDetail, useGoalMutations } from "../../hooks/useGoals";

const goalSchema = z.object({
  title: z.string().trim().min(2, "Goal title is required").max(100),
  targetAmount: z.coerce.number().positive("Target amount must be greater than 0"),
  note: z.string().trim().max(500).optional(),
});

type GoalFormInputs = z.input<typeof goalSchema>;
type GoalFormOutput = z.output<typeof goalSchema>;

const getErrorMessage = (error: unknown, fallback: string) => {
  if (typeof error === "object" && error !== null && "response" in error) {
    const response = (error as { response?: { data?: { message?: string } } }).response;
    return response?.data?.message || fallback;
  }
  return fallback;
};

export const AddEditGoal: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const goalQuery = useGoalDetail(id);
  const { createGoal, updateGoal, isCreatingGoal, isUpdatingGoal } = useGoalMutations();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GoalFormInputs, unknown, GoalFormOutput>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      title: "",
      targetAmount: 0,
      note: "",
    },
  });

  useEffect(() => {
    if (goalQuery.data?.goal) {
      reset({
        title: goalQuery.data.goal.title,
        targetAmount: goalQuery.data.goal.targetAmount,
        note: goalQuery.data.goal.note || "",
      });
    }
  }, [goalQuery.data?.goal, reset]);

  const onSubmit = async (data: GoalFormOutput) => {
    setFormError(null);
    try {
      const payload = {
        title: data.title.trim(),
        targetAmount: Number(data.targetAmount),
        note: data.note?.trim() || undefined,
      };
      const result = isEditing && id
        ? await updateGoal({ goalId: id, payload })
        : await createGoal(payload);
      navigate(ROUTES.GOAL_DETAIL.replace(":id", result.goal._id));
    } catch (err: unknown) {
      setFormError(getErrorMessage(err, "Goal save nahi ho saka."));
    }
  };

  if (isEditing && goalQuery.isLoading) {
    return <LoadingState message="Loading goal..." type="spinner" />;
  }
  if (isEditing && goalQuery.isError) {
    return <ErrorState onRetry={goalQuery.refetch} message="Goal load nahi ho saka." />;
  }

  const isSaving = isCreatingGoal || isUpdatingGoal;

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <button
        onClick={() => navigate(isEditing && id ? ROUTES.GOAL_DETAIL.replace(":id", id) : ROUTES.GOALS)}
        className="flex items-center gap-1.5 text-xs font-medium text-appMuted transition-colors hover:text-appText"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <div>
        <h1 className="text-xl font-semibold text-appText">{isEditing ? "Edit Goal" : "Add Goal"}</h1>
        <p className="text-sm font-normal text-appMuted">
          Create a simple saving target, like Mobile, Laptop, or Emergency cash.
        </p>
      </div>

      <Card variant="bordered" className="border-appBorder/50">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {formError && (
            <div className="flex items-center gap-2 rounded-lg border border-appDanger/25 bg-appDanger/10 p-3 text-xs font-semibold text-appDanger">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div className="rounded-lg bg-appBgSoft p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-appPrimary/10 text-appPrimary">
                <Target className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-appText">Saving progress only</p>
                <p className="text-xs font-normal text-appMuted">
                  Goal money does not create expense or income transactions.
                </p>
              </div>
            </div>
          </div>

          <Input
            label="Goal Name"
            placeholder="Mobile phone"
            error={errors.title?.message}
            {...register("title")}
          />

          <Input
            label="Target Amount (PKR)"
            type="number"
            min="1"
            placeholder="25000"
            error={errors.targetAmount?.message}
            {...register("targetAmount")}
          />

          <Input
            label="Note"
            placeholder="Optional note"
            error={errors.note?.message}
            {...register("note")}
          />

          <div className="flex justify-end gap-2 border-t border-appBorder/40 pt-4">
            <Button type="button" variant="outline" onClick={() => navigate(-1)} disabled={isSaving}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSaving}>
              {isEditing ? "Save Goal" : "Create Goal"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddEditGoal;
