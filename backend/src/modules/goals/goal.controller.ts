import { cacheInvalidation } from "../../cache/cache.invalidation";
import { cacheKeys, cacheTtl } from "../../cache/cache.keys";
import { cacheService } from "../../cache/cache.service";
import { auditLogService } from "../audit/audit-log.service";
import { getAuditRequestMeta, serializeAuditValue } from "../audit/audit-log.utils";
import { sendResponse } from "../../utils/apiResponse";
import { asyncHandler } from "../../utils/asyncHandler";
import { goalService } from "./goal.service";

export const createGoal = asyncHandler(async (req, res) => {
  const userId = req.user!.id;
  const data = await goalService.create(userId, req.body);
  await cacheInvalidation.goalChanged(userId);
  await auditLogService.record({
    userId,
    action: "GOAL_CREATED",
    entityType: "GOAL",
    entityId: data.goal._id.toString(),
    newValue: serializeAuditValue(data.goal),
    ...getAuditRequestMeta(req),
  });
  return sendResponse(res, 201, "Goal created successfully", data);
});

export const getGoals = asyncHandler(async (req, res) => {
  const userId = req.user!.id;
  const key = cacheKeys.goals.list(userId, req.query as never);
  const cached = await cacheService.get(key);
  if (cached) return sendResponse(res, 200, "Goals fetched successfully", cached);
  const data = await goalService.list(userId, req.query as never);
  await cacheService.set(key, data, cacheTtl.lists);
  return sendResponse(res, 200, "Goals fetched successfully", data);
});

export const getGoalSummary = asyncHandler(async (req, res) => {
  const userId = req.user!.id;
  const key = cacheKeys.goals.summary(userId);
  const cached = await cacheService.get(key);
  if (cached) return sendResponse(res, 200, "Goal summary fetched successfully", cached);
  const data = await goalService.summary(userId);
  await cacheService.set(key, data, cacheTtl.dashboardSummary);
  return sendResponse(res, 200, "Goal summary fetched successfully", data);
});

export const getGoal = asyncHandler(async (req, res) => {
  const userId = req.user!.id;
  const goalId = String(req.params.goalId);
  const key = cacheKeys.goals.detail(userId, goalId);
  const cached = await cacheService.get(key);
  if (cached) return sendResponse(res, 200, "Goal fetched successfully", cached);
  const data = await goalService.get(userId, goalId);
  await cacheService.set(key, data, cacheTtl.loanDetail);
  return sendResponse(res, 200, "Goal fetched successfully", data);
});

export const updateGoal = asyncHandler(async (req, res) => {
  const userId = req.user!.id;
  const data = await goalService.update(userId, String(req.params.goalId), req.body);
  await cacheInvalidation.goalChanged(userId, String(req.params.goalId));
  await auditLogService.record({
    userId,
    action: "GOAL_UPDATED",
    entityType: "GOAL",
    entityId: data.goal._id.toString(),
    newValue: serializeAuditValue(data.goal),
    ...getAuditRequestMeta(req),
  });
  return sendResponse(res, 200, "Goal updated successfully", data);
});

export const deleteGoal = asyncHandler(async (req, res) => {
  const userId = req.user!.id;
  const data = await goalService.delete(userId, String(req.params.goalId));
  await cacheInvalidation.goalChanged(userId, String(req.params.goalId));
  await auditLogService.record({
    userId,
    action: "GOAL_DELETED",
    entityType: "GOAL",
    entityId: String(req.params.goalId),
    oldValue: serializeAuditValue(data),
    ...getAuditRequestMeta(req),
  });
  return sendResponse(res, 200, "Goal deleted successfully", data);
});

export const createGoalContribution = asyncHandler(async (req, res) => {
  const userId = req.user!.id;
  const data = await goalService.createContribution(userId, String(req.params.goalId), req.body);
  await cacheInvalidation.goalChanged(userId, String(req.params.goalId));
  await auditLogService.record({
    userId,
    action: "GOAL_CONTRIBUTION_CREATED",
    entityType: "GOAL_CONTRIBUTION",
    entityId: data.contribution._id.toString(),
    newValue: serializeAuditValue(data.contribution),
    ...getAuditRequestMeta(req),
  });
  return sendResponse(res, 201, data.message || "Goal money added successfully", data);
});

export const updateGoalContribution = asyncHandler(async (req, res) => {
  const userId = req.user!.id;
  const data = await goalService.updateContribution(
    userId,
    String(req.params.goalId),
    String(req.params.contributionId),
    req.body,
  );
  await cacheInvalidation.goalChanged(userId, String(req.params.goalId));
  await auditLogService.record({
    userId,
    action: "GOAL_CONTRIBUTION_UPDATED",
    entityType: "GOAL_CONTRIBUTION",
    entityId: data.contribution._id.toString(),
    newValue: serializeAuditValue(data.contribution),
    ...getAuditRequestMeta(req),
  });
  return sendResponse(res, 200, data.message || "Goal money updated successfully", data);
});

export const deleteGoalContribution = asyncHandler(async (req, res) => {
  const userId = req.user!.id;
  const data = await goalService.deleteContribution(
    userId,
    String(req.params.goalId),
    String(req.params.contributionId),
  );
  await cacheInvalidation.goalChanged(userId, String(req.params.goalId));
  await auditLogService.record({
    userId,
    action: "GOAL_CONTRIBUTION_DELETED",
    entityType: "GOAL_CONTRIBUTION",
    entityId: String(req.params.contributionId),
    oldValue: serializeAuditValue(data),
    ...getAuditRequestMeta(req),
  });
  return sendResponse(res, 200, data.message || "Goal money deleted successfully", data);
});
