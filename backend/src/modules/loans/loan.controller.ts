import { cacheInvalidation } from "../../cache/cache.invalidation";
import { cacheKeys, cacheTtl } from "../../cache/cache.keys";
import { cacheService } from "../../cache/cache.service";
import { auditLogService } from "../audit/audit-log.service";
import { getAuditRequestMeta, serializeAuditValue } from "../audit/audit-log.utils";
import { sendResponse } from "../../utils/apiResponse";
import { asyncHandler } from "../../utils/asyncHandler";
import { loanService } from "./loan.service";
import { generateLoanPdf } from "../../utils/pdfGenerator";

const getDocumentId = (value: unknown) => {
  if (value && typeof value === "object" && "_id" in value) {
    return String((value as { _id: unknown })._id);
  }

  return String(value);
};

export const createLoan = asyncHandler(async (req, res) => {
  const userId = req.user!.id;
  const data = await loanService.createLoan(userId, req.body);
  const loanId = data._id.toString();
  const contactId = getDocumentId(data.contactId);
  await cacheInvalidation.loanChanged(userId, { loanId, contactId });
  await auditLogService.record({
    userId,
    action: "LOAN_CREATED",
    entityType: "LOAN",
    entityId: loanId,
    newValue: serializeAuditValue(data),
    ...getAuditRequestMeta(req),
  });
  return sendResponse(res, 201, "Loan created successfully", data);
});

export const getLoans = asyncHandler(async (req, res) => {
  const userId = req.user!.id;
  const key = cacheKeys.loans.list(userId, req.query as never);
  const cached = await cacheService.get(key);
  if (cached) {
    return sendResponse(res, 200, "Loans fetched successfully", cached);
  }

  const data = await loanService.getLoans(userId, req.query as never);
  await cacheService.set(key, data, cacheTtl.lists);
  return sendResponse(res, 200, "Loans fetched successfully", data);
});

export const getLoanDetail = asyncHandler(async (req, res) => {
  const userId = req.user!.id;
  const loanId = String(req.params.loanId);
  const key = cacheKeys.loans.detail(userId, loanId);
  const cached = await cacheService.get(key);
  if (cached) {
    return sendResponse(res, 200, "Loan detail fetched successfully", cached);
  }

  const data = await loanService.getLoanDetail(userId, loanId);
  await cacheService.set(key, data, cacheTtl.loanDetail);
  return sendResponse(res, 200, "Loan detail fetched successfully", data);
});

export const updateLoan = asyncHandler(async (req, res) => {
  const userId = req.user!.id;
  const loanId = String(req.params.loanId);
  const data = await loanService.updateLoan(userId, loanId, req.body);
  const contactId = getDocumentId(data.contactId);
  await cacheInvalidation.loanChanged(userId, { loanId, contactId });
  await auditLogService.record({
    userId,
    action: "LOAN_UPDATED",
    entityType: "LOAN",
    entityId: loanId,
    newValue: serializeAuditValue(data),
    ...getAuditRequestMeta(req),
  });
  return sendResponse(res, 200, "Loan updated successfully", data);
});

export const deleteLoan = asyncHandler(async (req, res) => {
  const userId = req.user!.id;
  const loanId = String(req.params.loanId);
  const data = await loanService.deleteLoan(userId, loanId);
  await cacheInvalidation.loanChanged(userId, { loanId, contactId: data.contactId });
  await auditLogService.record({
    userId,
    action: "LOAN_DELETED",
    entityType: "LOAN",
    entityId: loanId,
    oldValue: data,
    ...getAuditRequestMeta(req),
  });
  return sendResponse(res, 200, "Loan deleted successfully", data);
});

export const getLoanPdf = asyncHandler(async (req, res) => {
  const userId = req.user!.id;
  const loanId = String(req.params.loanId);
  const data = await loanService.getLoanDetail(userId, loanId);
  
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="loan-report-${loanId}.pdf"`);
  
  return generateLoanPdf(data.loan, data.payments, res);
});
