import { apiClient, unwrap } from "./axios";
import { Loan, LoanDetail, PaginatedLoans } from "../types";

export const loansApi = {
  getLoans: (params?: {
    search?: string;
    type?: string;
    status?: string;
    contactId?: string;
    minAmount?: number;
    maxAmount?: number;
    issueDateFrom?: string;
    issueDateTo?: string;
    dueDateFrom?: string;
    dueDateTo?: string;
    sortBy?: string;
    sortOrder?: string;
    page?: number;
    limit?: number;
  }) => unwrap<PaginatedLoans>(apiClient.get("/loans", { params })),

  getLoan: (loanId: string) => unwrap<LoanDetail>(apiClient.get(`/loans/${loanId}`)),

  createLoan: (payload: Partial<Loan>) => unwrap<Loan>(apiClient.post("/loans", payload)),

  updateLoan: (loanId: string, payload: Partial<Loan>) => unwrap<Loan>(apiClient.patch(`/loans/${loanId}`, payload)),

  deleteLoan: (loanId: string) => unwrap<{ id: string }>(apiClient.delete(`/loans/${loanId}`)),
};
