import mongoose, { Document, Schema, Types } from "mongoose";

export const GOAL_STATUSES = ["ACTIVE", "COMPLETED", "ARCHIVED"] as const;
export type GoalStatus = (typeof GOAL_STATUSES)[number];

export interface IGoal extends Document {
  userId: Types.ObjectId;
  title: string;
  targetAmount: number;
  savedAmount: number;
  remainingAmount: number;
  progressPercent: number;
  status: GoalStatus;
  note?: string;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IGoalContribution extends Document {
  userId: Types.ObjectId;
  goalId: Types.ObjectId;
  amount: number;
  date: Date;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

const goalSchema = new Schema<IGoal>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 100 },
    targetAmount: { type: Number, required: true, min: 0.01 },
    savedAmount: { type: Number, required: true, default: 0, min: 0 },
    remainingAmount: { type: Number, required: true, default: 0, min: 0 },
    progressPercent: { type: Number, required: true, default: 0, min: 0, max: 100 },
    status: { type: String, enum: GOAL_STATUSES, required: true, default: "ACTIVE", index: true },
    note: { type: String, trim: true, maxlength: 500 },
    completedAt: { type: Date },
  },
  { timestamps: true },
);

const goalContributionSchema = new Schema<IGoalContribution>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    goalId: { type: Schema.Types.ObjectId, ref: "Goal", required: true, index: true },
    amount: { type: Number, required: true, min: 0.01 },
    date: { type: Date, required: true, default: Date.now, index: true },
    note: { type: String, trim: true, maxlength: 500 },
  },
  { timestamps: true },
);

goalSchema.index({ userId: 1, status: 1, updatedAt: -1 });
goalContributionSchema.index({ userId: 1, goalId: 1, date: -1 });

export const GoalModel = mongoose.model<IGoal>("Goal", goalSchema);
export const GoalContributionModel = mongoose.model<IGoalContribution>("GoalContribution", goalContributionSchema);
