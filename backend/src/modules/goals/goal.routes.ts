import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware";
import { validateRequest } from "../../middleware/validateRequest";
import {
  createGoal,
  createGoalContribution,
  deleteGoal,
  deleteGoalContribution,
  getGoal,
  getGoalSummary,
  getGoals,
  updateGoal,
  updateGoalContribution,
} from "./goal.controller";
import {
  createGoalContributionSchema,
  createGoalSchema,
  deleteGoalContributionSchema,
  goalIdParamSchema,
  goalListSchema,
  updateGoalContributionSchema,
  updateGoalSchema,
} from "./goal.validation";

const router = Router();

router.use(requireAuth);
router.get("/", validateRequest(goalListSchema), getGoals);
router.post("/", validateRequest(createGoalSchema), createGoal);
router.get("/summary", getGoalSummary);
router.get("/:goalId", validateRequest(goalIdParamSchema), getGoal);
router.patch("/:goalId", validateRequest(updateGoalSchema), updateGoal);
router.delete("/:goalId", validateRequest(goalIdParamSchema), deleteGoal);
router.post("/:goalId/contributions", validateRequest(createGoalContributionSchema), createGoalContribution);
router.patch("/:goalId/contributions/:contributionId", validateRequest(updateGoalContributionSchema), updateGoalContribution);
router.delete("/:goalId/contributions/:contributionId", validateRequest(deleteGoalContributionSchema), deleteGoalContribution);

export default router;
