import { z } from "zod";
import { objectIdSchema } from "../contacts/contact.validation";
import { GOAL_STATUSES } from "./goal.model";

const goalBodySchema = z.object({
  title: z.string().trim().min(2, "Goal title is required").max(100),
  targetAmount: z.coerce.number().positive("Target amount must be greater than 0"),
  note: z.string().trim().max(500).optional().or(z.literal("")),
});

const goalUpdateBodySchema = goalBodySchema.partial().extend({
  status: z.enum(GOAL_STATUSES).optional(),
});

const contributionBodySchema = z.object({
  amount: z.coerce.number().positive("Contribution amount must be greater than 0"),
  date: z.coerce.date(),
  note: z.string().trim().max(500).optional().or(z.literal("")),
});

export const createGoalSchema = z.object({ body: goalBodySchema });
export const updateGoalSchema = z.object({
  params: z.object({ goalId: objectIdSchema }),
  body: goalUpdateBodySchema,
});

export const goalIdParamSchema = z.object({
  params: z.object({ goalId: objectIdSchema }),
});

export const goalListSchema = z.object({
  query: z.object({
    status: z.enum(GOAL_STATUSES).optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
  }),
});

export const createGoalContributionSchema = z.object({
  params: z.object({ goalId: objectIdSchema }),
  body: contributionBodySchema,
});

export const updateGoalContributionSchema = z.object({
  params: z.object({
    goalId: objectIdSchema,
    contributionId: objectIdSchema,
  }),
  body: contributionBodySchema.partial(),
});

export const deleteGoalContributionSchema = z.object({
  params: z.object({
    goalId: objectIdSchema,
    contributionId: objectIdSchema,
  }),
});
