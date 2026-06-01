import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware";
import { validateRequest } from "../../middleware/validateRequest";
import {
  createLoan,
  deleteLoan,
  getLoanDetail,
  getLoans,
  updateLoan,
  getLoanPdf,
} from "./loan.controller";
import {
  createLoanSchema,
  getLoansSchema,
  loanIdParamSchema,
  updateLoanSchema,
} from "./loan.validation";

const router = Router();

router.use(requireAuth);
router.post("/", validateRequest(createLoanSchema), createLoan);
router.get("/", validateRequest(getLoansSchema), getLoans);
router.get("/:loanId", validateRequest(loanIdParamSchema), getLoanDetail);
router.get("/:loanId/pdf", validateRequest(loanIdParamSchema), getLoanPdf);
router.patch("/:loanId", validateRequest(updateLoanSchema), updateLoan);
router.delete("/:loanId", validateRequest(loanIdParamSchema), deleteLoan);

export default router;
