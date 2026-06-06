import { Types } from "mongoose";
import { ApiError } from "../../utils/apiError";
import { buildPaginationMeta } from "../../utils/pagination";
import { GoalContributionModel, GoalModel, GoalStatus, IGoal } from "./goal.model";

const toObjectId = (id: string | Types.ObjectId) => typeof id === "string" ? new Types.ObjectId(id) : id;

const normalize = (payload: Record<string, unknown>) => {
  const next = { ...payload };
  if (next.note === "") next.note = undefined;
  return next;
};

const completionMessage = (goal: IGoal) =>
  goal.status === "COMPLETED"
    ? `Goal complete. Rs ${goal.targetAmount.toLocaleString("en-PK")} saved for ${goal.title}.`
    : undefined;

const goalSort = { status: 1, progressPercent: -1, updatedAt: -1 } as const;

export const goalService = {
  async recalculate(goal: IGoal) {
    const result = await GoalContributionModel.aggregate<{ total: number }>([
      { $match: { userId: goal.userId, goalId: goal._id } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const savedAmount = result[0]?.total || 0;
    const remainingAmount = Math.max(goal.targetAmount - savedAmount, 0);
    const progressPercent = goal.targetAmount > 0 ? Math.min(100, Math.round((savedAmount / goal.targetAmount) * 100)) : 0;
    const wasCompleted = goal.status === "COMPLETED";

    goal.savedAmount = savedAmount;
    goal.remainingAmount = remainingAmount;
    goal.progressPercent = progressPercent;

    if (goal.status !== "ARCHIVED") {
      goal.status = savedAmount >= goal.targetAmount ? "COMPLETED" : "ACTIVE";
      if (goal.status === "COMPLETED" && !goal.completedAt) {
        goal.completedAt = new Date();
      }
      if (wasCompleted && goal.status === "ACTIVE") {
        goal.completedAt = undefined;
      }
    }

    await goal.save();
    return goal;
  },

  async create(userId: string, payload: { title: string; targetAmount: number; note?: string }) {
    const goal = await GoalModel.create({
      ...normalize(payload),
      userId: toObjectId(userId),
      remainingAmount: payload.targetAmount,
    });
    return { goal, message: completionMessage(goal) };
  },

  async list(userId: string, filters: { status?: GoalStatus; page: number; limit: number }) {
    const query: Record<string, unknown> = { userId: toObjectId(userId) };
    if (filters.status) query.status = filters.status;
    const limit = Math.min(filters.limit, 100);
    const [goals, total] = await Promise.all([
      GoalModel.find(query)
        .sort(goalSort)
        .skip((filters.page - 1) * limit)
        .limit(limit),
      GoalModel.countDocuments(query),
    ]);
    return { goals, pagination: buildPaginationMeta(filters.page, limit, total) };
  },

  async summary(userId: string) {
    const userObjectId = toObjectId(userId);
    const [activeGoals, completedGoals, archivedGoals, nearestGoal] = await Promise.all([
      GoalModel.find({ userId: userObjectId, status: "ACTIVE" }).sort(goalSort),
      GoalModel.countDocuments({ userId: userObjectId, status: "COMPLETED" }),
      GoalModel.countDocuments({ userId: userObjectId, status: "ARCHIVED" }),
      GoalModel.findOne({ userId: userObjectId, status: "ACTIVE" }).sort({ progressPercent: -1, updatedAt: -1 }),
    ]);

    const totals = activeGoals.reduce(
      (acc, goal) => {
        acc.activeGoals += 1;
        acc.totalTargetAmount += goal.targetAmount;
        acc.totalSavedAmount += goal.savedAmount;
        acc.totalRemainingAmount += goal.remainingAmount;
        return acc;
      },
      { activeGoals: 0, totalTargetAmount: 0, totalSavedAmount: 0, totalRemainingAmount: 0 },
    );

    return {
      ...totals,
      completedGoals,
      archivedGoals,
      nearestGoal,
    };
  },

  async get(userId: string, goalId: string) {
    const goal = await GoalModel.findOne({ _id: goalId, userId: toObjectId(userId) });
    if (!goal) throw new ApiError(404, "Goal not found");
    const contributions = await GoalContributionModel.find({ userId: toObjectId(userId), goalId: goal._id }).sort({ date: -1, createdAt: -1 });
    return { goal, contributions };
  },

  async update(userId: string, goalId: string, payload: Record<string, unknown>) {
    const goal = await GoalModel.findOne({ _id: goalId, userId: toObjectId(userId) });
    if (!goal) throw new ApiError(404, "Goal not found");

    const nextPayload = normalize(payload);
    goal.set(nextPayload);
    if (nextPayload.status === "ARCHIVED") {
      goal.status = "ARCHIVED";
    } else if (nextPayload.status === "ACTIVE" && goal.status === "ARCHIVED") {
      goal.status = "ACTIVE";
      goal.completedAt = undefined;
    }

    await goal.save();
    await this.recalculate(goal);
    return { goal, message: completionMessage(goal) };
  },

  async delete(userId: string, goalId: string) {
    const goal = await GoalModel.findOne({ _id: goalId, userId: toObjectId(userId) });
    if (!goal) throw new ApiError(404, "Goal not found");
    await GoalContributionModel.deleteMany({ userId: toObjectId(userId), goalId: goal._id });
    await goal.deleteOne();
    return { id: goalId };
  },

  async createContribution(userId: string, goalId: string, payload: { amount: number; date: Date; note?: string }) {
    const goal = await GoalModel.findOne({ _id: goalId, userId: toObjectId(userId) });
    if (!goal) throw new ApiError(404, "Goal not found");
    if (goal.status === "ARCHIVED") throw new ApiError(400, "Archived goals cannot receive new money");

    const contribution = await GoalContributionModel.create({
      ...normalize(payload),
      userId: toObjectId(userId),
      goalId: goal._id,
    });
    await this.recalculate(goal);
    return { goal, contribution, message: completionMessage(goal) };
  },

  async updateContribution(userId: string, goalId: string, contributionId: string, payload: Record<string, unknown>) {
    const goal = await GoalModel.findOne({ _id: goalId, userId: toObjectId(userId) });
    if (!goal) throw new ApiError(404, "Goal not found");
    const contribution = await GoalContributionModel.findOne({
      _id: contributionId,
      goalId: goal._id,
      userId: toObjectId(userId),
    });
    if (!contribution) throw new ApiError(404, "Goal contribution not found");

    contribution.set(normalize(payload));
    await contribution.save();
    await this.recalculate(goal);
    return { goal, contribution, message: completionMessage(goal) };
  },

  async deleteContribution(userId: string, goalId: string, contributionId: string) {
    const goal = await GoalModel.findOne({ _id: goalId, userId: toObjectId(userId) });
    if (!goal) throw new ApiError(404, "Goal not found");
    const contribution = await GoalContributionModel.findOneAndDelete({
      _id: contributionId,
      goalId: goal._id,
      userId: toObjectId(userId),
    });
    if (!contribution) throw new ApiError(404, "Goal contribution not found");

    await this.recalculate(goal);
    return { goal, id: contributionId, message: completionMessage(goal) };
  },
};
