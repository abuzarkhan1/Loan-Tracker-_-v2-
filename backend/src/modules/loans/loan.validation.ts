import { z } from "zod";
import { LoanStatus, LoanType, PaymentMethod } from "../../constants/enums";
import { objectIdSchema } from "../contacts/contact.validation";

const optionalDate = z.coerce.date().optional();

export const loanIdParamSchema = z.object({
  params: z.object({
    loanId: objectIdSchema,
  }),
});

export const createLoanSchema = z.object({
  body: z.object({
    contactId: objectIdSchema,
    type: z.enum(LoanType),
    amount: z.coerce.number().positive("Loan amount must be greater than 0"),
    issueDate: z.coerce.date().optional(),
    dueDate: optionalDate,
    description: z.string().trim().max(500).optional().or(z.literal("")),
  }),
});

export const getLoansSchema = z.object({
  query: z.object({
    search: z.string().trim().optional(),
    type: z.enum(LoanType).optional(),
    status: z.enum(LoanStatus).optional(),
    contactId: objectIdSchema.optional(),
    minAmount: z.coerce.number().min(0).optional(),
    maxAmount: z.coerce.number().min(0).optional(),
    issueDateFrom: z.coerce.date().optional(),
    issueDateTo: z.coerce.date().optional(),
    dueDateFrom: z.coerce.date().optional(),
    dueDateTo: z.coerce.date().optional(),
    paymentMethod: z.enum(PaymentMethod).optional(),
    sortBy: z.enum(["issueDate", "dueDate", "amount", "remainingAmount", "createdAt"]).default("issueDate"),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
  }),
});

export const updateLoanSchema = z.object({
  params: z.object({
    loanId: objectIdSchema,
  }),
  body: z.object({
    contactId: objectIdSchema.optional(),
    type: z.enum(LoanType).optional(),
    amount: z.coerce.number().positive("Loan amount must be greater than 0").optional(),
    issueDate: z.coerce.date().optional(),
    dueDate: optionalDate.or(z.literal("")),
    description: z.string().trim().max(500).optional().or(z.literal("")),
  }),
});
