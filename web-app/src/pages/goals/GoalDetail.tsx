import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Archive,
  ArrowLeft,
  Calendar,
  CheckCircle,
  Edit,
  HandCoins,
  RotateCcw,
  Target,
  Trash2,
} from "lucide-react";
import AmountText from "../../components/common/AmountText";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";
import LoadingState from "../../components/common/LoadingState";
import { ROUTES } from "../../config/routes.config";
import { useGoalDetail, useGoalMutations } from "../../hooks/useGoals";
import { formatDate } from "../../lib/formatDate";
import { GoalContribution, GoalStatus } from "../../types";

const statusVariant = (status: GoalStatus) => {
  if (status === "COMPLETED") return "success";
  if (status === "ARCHIVED") return "muted";
  return "peach";
};

const Metric = ({ label, amount, tone = "text-appText" }: { label: string; amount: number; tone?: string }) => (
  <div className="rounded-lg border border-appBorder bg-appSurface p-4">
    <p className="text-xs font-semibold uppercase tracking-[0.05em] text-appMuted">{label}</p>
    <AmountText amount={amount} className={`mt-1 block text-lg font-semibold ${tone}`} />
  </div>
);

export const GoalDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const goalMessage = (location.state as { goalMessage?: string } | null)?.goalMessage;
  const goalQuery = useGoalDetail(id);
  const {
    updateGoal,
    deleteGoal,
    deleteContribution,
    isUpdatingGoal,
    isDeletingGoal,
    isDeletingContribution,
  } = useGoalMutations();
  const [deleteGoalOpen, setDeleteGoalOpen] = useState(false);
  const [contributionToDelete, setContributionToDelete] = useState<GoalContribution | null>(null);

  if (goalQuery.isLoading) return <LoadingState message="Loading goal..." type="spinner" />;
  if (goalQuery.isError || !goalQuery.data || !id) {
    return <ErrorState onRetry={goalQuery.refetch} message="Goal load nahi ho saka." />;
  }

  const { goal, contributions } = goalQuery.data;
  const isCompleted = goal.status === "COMPLETED";
  const isArchived = goal.status === "ARCHIVED";

  const handleStatusToggle = async () => {
    await updateGoal({
      goalId: goal._id,
      payload: { status: isArchived ? "ACTIVE" : "ARCHIVED" },
    });
  };

  const handleDeleteGoal = async () => {
    await deleteGoal(goal._id);
    navigate(ROUTES.GOALS);
  };

  const handleDeleteContribution = async () => {
    if (!contributionToDelete) return;
    await deleteContribution({ goalId: goal._id, contributionId: contributionToDelete._id });
    setContributionToDelete(null);
    await goalQuery.refetch();
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <button
        onClick={() => navigate(ROUTES.GOALS)}
        className="flex items-center gap-1.5 text-xs font-medium text-appMuted transition-colors hover:text-appText"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Goals
      </button>

      <Card variant="bordered" className="border-appBorder/50">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Badge variant={statusVariant(goal.status)} size="sm">{goal.status}</Badge>
              <span className="rounded-md border border-appBorder bg-appBgSoft px-2.5 py-1 text-xs font-medium text-appMuted">
                {goal.progressPercent}% complete
              </span>
            </div>
            <h1 className="text-xl font-semibold text-appText">{goal.title}</h1>
            <p className="mt-2 max-w-2xl text-sm font-normal leading-6 text-appMuted">
              {goal.note || "Simple saving target"}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {!isArchived && (
              <Button
                variant="primary"
                size="sm"
                leftIcon={<HandCoins className="h-4 w-4" />}
                onClick={() => navigate(ROUTES.ADD_GOAL_CONTRIBUTION.replace(":id", goal._id))}
              >
                Add Money
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Edit className="h-4 w-4" />}
              onClick={() => navigate(ROUTES.EDIT_GOAL.replace(":id", goal._id))}
            >
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              leftIcon={isArchived ? <RotateCcw className="h-4 w-4" /> : <Archive className="h-4 w-4" />}
              onClick={handleStatusToggle}
              isLoading={isUpdatingGoal}
            >
              {isArchived ? "Restore" : "Archive"}
            </Button>
            <Button
              variant="danger"
              size="sm"
              leftIcon={<Trash2 className="h-4 w-4" />}
              onClick={() => setDeleteGoalOpen(true)}
            >
              Delete
            </Button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Metric label="Target" amount={goal.targetAmount} />
          <Metric label="Saved" amount={goal.savedAmount} tone="text-appSuccess" />
          <Metric label="Remaining" amount={goal.remainingAmount} tone={goal.remainingAmount > 0 ? "text-appPrimary" : "text-appSuccess"} />
        </div>

        <div className="mt-6 space-y-2">
          <div className="flex items-center justify-between text-xs font-medium text-appMuted">
            <span>Saving Progress</span>
            <span>{goal.progressPercent}%</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-appBorder">
            <div className="h-full rounded-full bg-appPrimary" style={{ width: `${goal.progressPercent}%` }} />
          </div>
        </div>

        {(isCompleted || goalMessage) && (
          <div className="mt-5 rounded-lg border border-appSuccess/25 bg-appSuccess/10 p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-appSuccess" />
              <div>
                <p className="text-sm font-semibold text-appText">Goal complete</p>
                <p className="mt-1 text-sm font-normal text-appMuted">
                  {goalMessage || `You have saved enough for ${goal.title}.`}
                </p>
              </div>
            </div>
          </div>
        )}
      </Card>

      <Card variant="bordered" className="border-appBorder/50">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-appText">Money Added</h2>
            <p className="text-xs font-normal text-appMuted">Small saved amounts over time.</p>
          </div>
          {!isArchived && (
            <Button
              variant="outline"
              size="sm"
              leftIcon={<HandCoins className="h-4 w-4" />}
              onClick={() => navigate(ROUTES.ADD_GOAL_CONTRIBUTION.replace(":id", goal._id))}
            >
              Add Money
            </Button>
          )}
        </div>

        {contributions.length === 0 ? (
          <EmptyState
            icon={<Target className="h-8 w-8" />}
            title="No money added yet"
            description="Add small amounts whenever you save for this goal."
            actionText={!isArchived ? "Add Money" : undefined}
            onAction={!isArchived ? () => navigate(ROUTES.ADD_GOAL_CONTRIBUTION.replace(":id", goal._id)) : undefined}
          />
        ) : (
          <div className="space-y-3">
            {contributions.map((contribution) => (
              <div key={contribution._id} className="rounded-lg border border-appBorder bg-appCard p-4 shadow-level1">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-base font-semibold text-appSuccess">
                      <AmountText amount={contribution.amount} />
                    </p>
                    <p className="mt-1 inline-flex items-center gap-1.5 text-xs font-normal text-appMuted">
                      <Calendar className="h-3.5 w-3.5" /> {formatDate(contribution.date)}
                    </p>
                    {contribution.note && <p className="mt-2 text-sm font-normal text-appText">{contribution.note}</p>}
                  </div>
                  <div className="flex gap-2">
                    {!isArchived && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          navigate(
                            ROUTES.EDIT_GOAL_CONTRIBUTION
                              .replace(":id", goal._id)
                              .replace(":contributionId", contribution._id),
                          )
                        }
                      >
                        Edit
                      </Button>
                    )}
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => setContributionToDelete(contribution)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <ConfirmDialog
        isOpen={deleteGoalOpen}
        onClose={() => setDeleteGoalOpen(false)}
        onConfirm={handleDeleteGoal}
        title="Delete goal?"
        message="This will delete the goal and its saved money history."
        confirmText="Delete"
        isDestructive
        isLoading={isDeletingGoal}
      />

      <ConfirmDialog
        isOpen={Boolean(contributionToDelete)}
        onClose={() => setContributionToDelete(null)}
        onConfirm={handleDeleteContribution}
        title="Delete saved money?"
        message="Goal progress will be recalculated after this entry is deleted."
        confirmText="Delete"
        isDestructive
        isLoading={isDeletingContribution}
      />
    </div>
  );
};

export default GoalDetail;
