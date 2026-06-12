import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Plus, Target } from "lucide-react";
import AmountText from "../../components/common/AmountText";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";
import LoadingState from "../../components/common/LoadingState";
import PageHeader from "../../components/common/PageHeader";
import { ROUTES } from "../../config/routes.config";
import { useGoals } from "../../hooks/useGoals";
import { cn } from "../../lib/cn";
import { Goal, GoalStatus } from "../../types";

const statusOptions: Array<{ label: string; value: GoalStatus }> = [
  { label: "Active", value: "ACTIVE" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Archived", value: "ARCHIVED" },
];

const statusVariant = (status: GoalStatus) => {
  if (status === "COMPLETED") return "success";
  if (status === "ARCHIVED") return "muted";
  return "peach";
};

const GoalCard = ({ goal, onClick }: { goal: Goal; onClick: () => void }) => (
  <button
    onClick={onClick}
    className="group w-full rounded-xl border border-appBorder bg-appCard p-4 text-left shadow-level1 transition-all hover:-translate-y-0.5 hover:shadow-level2"
  >
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Badge variant={statusVariant(goal.status)} size="sm">{goal.status}</Badge>
          <span className="text-xs font-semibold uppercase tracking-[0.05em] text-appMuted">
            {goal.progressPercent}% complete
          </span>
        </div>
        <h3 className="truncate text-base font-semibold text-appText">{goal.title}</h3>
        <p className="mt-1 line-clamp-2 text-xs font-normal leading-5 text-appMuted">
          {goal.note || "Simple saving target"}
        </p>
      </div>
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-appPrimary/10 text-appPrimary">
        <Target className="h-5 w-5" />
      </div>
    </div>

    <div className="mt-5 grid grid-cols-3 gap-3">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.05em] text-appMuted">Target</p>
        <AmountText amount={goal.targetAmount} className="mt-1 block text-sm font-semibold text-appText" />
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.05em] text-appMuted">Saved</p>
        <AmountText amount={goal.savedAmount} className="mt-1 block text-sm font-semibold text-appSuccess" />
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.05em] text-appMuted">Left</p>
        <AmountText amount={goal.remainingAmount} className="mt-1 block text-sm font-semibold text-appPrimary" />
      </div>
    </div>

    <div className="mt-4 h-2 overflow-hidden rounded-full bg-appBorder">
      <div className="h-full rounded-full bg-appPrimary" style={{ width: `${goal.progressPercent}%` }} />
    </div>

    <div className="mt-4 flex items-center justify-end text-xs font-medium text-appPrimary">
      Open Goal <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
    </div>
  </button>
);

export const Goals: React.FC = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<GoalStatus>("ACTIVE");
  const goalsQuery = useGoals({ status, page: 1, limit: 60 });

  const goals = goalsQuery.data?.goals || [];

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader
        kicker="Savings"
        title="Goals"
        description="Save small amounts toward personal targets without mixing them into expenses."
        icon={<Target className="h-6 w-6" />}
        actions={
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={() => navigate(ROUTES.ADD_GOAL)}
          >
            Add Goal
          </Button>
        }
      />

      <Card variant="flat" className="flex flex-wrap gap-2 border border-appBorder/30">
        {statusOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setStatus(option.value)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium uppercase tracking-[0.05em] transition-all",
              status === option.value
                ? "border-white bg-white text-black shadow-sm"
                : "border-appBorder bg-appCard text-appMuted hover:bg-appBgSoft hover:text-appText",
            )}
          >
            {option.label}
          </button>
        ))}
      </Card>

      {goalsQuery.isLoading ? (
        <LoadingState message="Loading goals..." type="card-skeletons" count={4} />
      ) : goalsQuery.isError ? (
        <ErrorState onRetry={goalsQuery.refetch} message="Goals load nahi ho sake." />
      ) : goals.length === 0 ? (
        <EmptyState
          icon={<Target className="h-8 w-8" />}
          title={status === "ACTIVE" ? "No goals yet" : `No ${status.toLowerCase()} goals`}
          description={status === "ACTIVE" ? "Add your first saving target." : "Goals will appear here when their status changes."}
          actionText={status === "ACTIVE" ? "Add Goal" : undefined}
          onAction={status === "ACTIVE" ? () => navigate(ROUTES.ADD_GOAL) : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {goals.map((goal) => (
            <GoalCard
              key={goal._id}
              goal={goal}
              onClick={() => navigate(ROUTES.GOAL_DETAIL.replace(":id", goal._id))}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Goals;
