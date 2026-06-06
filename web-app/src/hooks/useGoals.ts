import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { goalsApi } from "../api/goals.api";
import { QUERY_KEYS } from "../constants/queryKeys";
import { Goal, GoalContribution, GoalStatus } from "../types";

const invalidateGoalQueries = async (queryClient: ReturnType<typeof useQueryClient>, goalId?: string) => {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GOALS] }),
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GOAL_SUMMARY] }),
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DASHBOARD_SUMMARY] }),
    goalId ? queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GOAL_DETAIL, goalId] }) : Promise.resolve(),
  ]);
};

export const useGoalSummary = () =>
  useQuery({
    queryKey: [QUERY_KEYS.GOAL_SUMMARY],
    queryFn: goalsApi.getGoalSummary,
  });

export const useGoals = (params?: { status?: GoalStatus; page?: number; limit?: number }) =>
  useQuery({
    queryKey: [QUERY_KEYS.GOALS, params],
    queryFn: () => goalsApi.getGoals(params),
  });

export const useGoalDetail = (goalId?: string) =>
  useQuery({
    queryKey: [QUERY_KEYS.GOAL_DETAIL, goalId],
    queryFn: () => goalsApi.getGoal(goalId!),
    enabled: Boolean(goalId),
  });

export const useGoalMutations = () => {
  const queryClient = useQueryClient();

  const createGoal = useMutation({
    mutationFn: goalsApi.createGoal,
    onSuccess: async (data) => invalidateGoalQueries(queryClient, data.goal._id),
  });

  const updateGoal = useMutation({
    mutationFn: ({ goalId, payload }: { goalId: string; payload: Partial<Goal> }) =>
      goalsApi.updateGoal(goalId, payload),
    onSuccess: async (data, variables) => invalidateGoalQueries(queryClient, data.goal?._id || variables.goalId),
  });

  const deleteGoal = useMutation({
    mutationFn: goalsApi.deleteGoal,
    onSuccess: async () => invalidateGoalQueries(queryClient),
  });

  const addContribution = useMutation({
    mutationFn: ({
      goalId,
      payload,
    }: {
      goalId: string;
      payload: Pick<GoalContribution, "amount" | "date"> & { note?: string };
    }) => goalsApi.addContribution(goalId, payload),
    onSuccess: async (data) => invalidateGoalQueries(queryClient, data.goal._id),
  });

  const updateContribution = useMutation({
    mutationFn: ({
      goalId,
      contributionId,
      payload,
    }: {
      goalId: string;
      contributionId: string;
      payload: Partial<Pick<GoalContribution, "amount" | "date" | "note">>;
    }) => goalsApi.updateContribution(goalId, contributionId, payload),
    onSuccess: async (data) => invalidateGoalQueries(queryClient, data.goal._id),
  });

  const deleteContribution = useMutation({
    mutationFn: ({ goalId, contributionId }: { goalId: string; contributionId: string }) =>
      goalsApi.deleteContribution(goalId, contributionId),
    onSuccess: async (data) => invalidateGoalQueries(queryClient, data.goal._id),
  });

  return {
    createGoal: createGoal.mutateAsync,
    isCreatingGoal: createGoal.isPending,
    updateGoal: updateGoal.mutateAsync,
    isUpdatingGoal: updateGoal.isPending,
    deleteGoal: deleteGoal.mutateAsync,
    isDeletingGoal: deleteGoal.isPending,
    addContribution: addContribution.mutateAsync,
    isAddingContribution: addContribution.isPending,
    updateContribution: updateContribution.mutateAsync,
    isUpdatingContribution: updateContribution.isPending,
    deleteContribution: deleteContribution.mutateAsync,
    isDeletingContribution: deleteContribution.isPending,
  };
};
