import { apiClient, unwrap } from "./axios";
import {
  Goal,
  GoalContribution,
  GoalContributionMutationResponse,
  GoalDetail,
  GoalMutationResponse,
  GoalStatus,
  GoalSummary,
  PaginatedGoals,
} from "../types";

export const goalsApi = {
  getGoals: (params?: { status?: GoalStatus; page?: number; limit?: number }) =>
    unwrap<PaginatedGoals>(apiClient.get("/goals", { params })),

  getGoalSummary: () => unwrap<GoalSummary>(apiClient.get("/goals/summary")),

  getGoal: (goalId: string) => unwrap<GoalDetail>(apiClient.get(`/goals/${goalId}`)),

  createGoal: (payload: Pick<Goal, "title" | "targetAmount"> & { note?: string }) =>
    unwrap<GoalMutationResponse>(apiClient.post("/goals", payload)),

  updateGoal: (goalId: string, payload: Partial<Pick<Goal, "title" | "targetAmount" | "note" | "status">>) =>
    unwrap<GoalMutationResponse>(apiClient.patch(`/goals/${goalId}`, payload)),

  deleteGoal: (goalId: string) => unwrap<{ id: string }>(apiClient.delete(`/goals/${goalId}`)),

  addContribution: (goalId: string, payload: Pick<GoalContribution, "amount" | "date"> & { note?: string }) =>
    unwrap<GoalContributionMutationResponse>(apiClient.post(`/goals/${goalId}/contributions`, payload)),

  updateContribution: (
    goalId: string,
    contributionId: string,
    payload: Partial<Pick<GoalContribution, "amount" | "date" | "note">>,
  ) =>
    unwrap<GoalContributionMutationResponse>(
      apiClient.patch(`/goals/${goalId}/contributions/${contributionId}`, payload),
    ),

  deleteContribution: (goalId: string, contributionId: string) =>
    unwrap<GoalContributionMutationResponse>(apiClient.delete(`/goals/${goalId}/contributions/${contributionId}`)),
};
