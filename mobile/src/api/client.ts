import axios from "axios";
import {
  ApiResponse,
  AuthPayload,
  BulkDeviceContactImportResult,
  Category,
  Contact,
  ContactDetail,
  ContactLedger,
  ContactMatchResult,
  DashboardSummary,
  DeviceContactImportPayload,
  DeviceContactImportResult,
  Loan,
  LoanDetail,
  LoanStatusChartPoint,
  LoanTypeChartPoint,
  MonthlyChartPoint,
  PaginatedContacts,
  PaginatedLoans,
  PaginatedTransactions,
  Payment,
  PaymentMethod,
  PaymentMutationResponse,
  TopContact,
  Transaction,
  TransactionType,
  User,
} from "./types";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 15_000,
});

export const setAuthToken = (token?: string | null) => {
  if (token) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common.Authorization;
  }
};

const unwrap = async <T>(promise: Promise<{ data: ApiResponse<T> }>) => {
  const response = await promise;
  return response.data.data;
};

export const api = {
  login: (payload: { email: string; password: string }) => unwrap<AuthPayload>(apiClient.post("/auth/login", payload)),
  register: (payload: { name: string; email: string; password: string }) => unwrap<AuthPayload>(apiClient.post("/auth/register", payload)),
  me: () => unwrap<User>(apiClient.get("/auth/me")),
  updateMe: (payload: Partial<Pick<User, "name" | "email">>) => unwrap<User>(apiClient.patch("/auth/me", payload)),

  getContacts: (params?: { search?: string; page?: number; limit?: number }) =>
    unwrap<PaginatedContacts>(apiClient.get("/contacts", { params })),
  importDeviceContact: (payload: DeviceContactImportPayload) =>
    unwrap<DeviceContactImportResult>(apiClient.post("/contacts/import-device-contact", payload)),
  bulkImportDeviceContacts: (contacts: DeviceContactImportPayload[]) =>
    unwrap<BulkDeviceContactImportResult>(apiClient.post("/contacts/bulk-import-device-contacts", { contacts })),
  matchContact: (params: { phone?: string; name?: string; deviceContactId?: string }) =>
    unwrap<ContactMatchResult>(apiClient.get("/contacts/match", { params })),
  touchContactLastUsed: (contactId: string) => unwrap<Contact>(apiClient.patch(`/contacts/${contactId}/last-used`)),
  getContact: (contactId: string) => unwrap<ContactDetail>(apiClient.get(`/contacts/${contactId}`)),
  getContactLedger: (contactId: string) => unwrap<ContactLedger>(apiClient.get(`/contacts/${contactId}/ledger`)),
  createContact: (payload: Partial<Contact>) => unwrap<Contact>(apiClient.post("/contacts", payload)),
  updateContact: (contactId: string, payload: Partial<Contact>) => unwrap<Contact>(apiClient.patch(`/contacts/${contactId}`, payload)),
  deleteContact: (contactId: string) => unwrap<{ id: string }>(apiClient.delete(`/contacts/${contactId}`)),

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
    paymentMethod?: string;
    sortBy?: string;
    sortOrder?: string;
    page?: number;
    limit?: number;
  }) => unwrap<PaginatedLoans>(apiClient.get("/loans", { params })),
  getLoan: (loanId: string) => unwrap<LoanDetail>(apiClient.get(`/loans/${loanId}`)),
  createLoan: (payload: Partial<Loan>) => unwrap<Loan>(apiClient.post("/loans", payload)),
  updateLoan: (loanId: string, payload: Partial<Loan>) => unwrap<Loan>(apiClient.patch(`/loans/${loanId}`, payload)),
  deleteLoan: (loanId: string) => unwrap<{ id: string }>(apiClient.delete(`/loans/${loanId}`)),

  addPayment: (payload: Partial<Payment>) => unwrap<PaymentMutationResponse>(apiClient.post("/payments", payload)),
  getPaymentsByLoan: (loanId: string) => unwrap<Payment[]>(apiClient.get(`/payments/loan/${loanId}`)),
  updatePayment: (paymentId: string, payload: Partial<Payment>) =>
    unwrap<PaymentMutationResponse>(apiClient.patch(`/payments/${paymentId}`, payload)),
  deletePayment: (paymentId: string) => unwrap<PaymentMutationResponse>(apiClient.delete(`/payments/${paymentId}`)),

  getSummary: () => unwrap<DashboardSummary>(apiClient.get("/dashboard/summary")),
  getMonthlyChart: (months = 6) => unwrap<MonthlyChartPoint[]>(apiClient.get("/dashboard/monthly-chart", { params: { months } })),
  getLoanTypeChart: () => unwrap<LoanTypeChartPoint[]>(apiClient.get("/dashboard/loan-type-chart")),
  getLoanStatusChart: () => unwrap<LoanStatusChartPoint[]>(apiClient.get("/dashboard/loan-status-chart")),
  getTopContacts: (limit = 5) => unwrap<TopContact[]>(apiClient.get("/dashboard/top-contacts", { params: { limit } })),

  getCategories: (params?: { type?: "INCOME" | "EXPENSE"; includeInactive?: boolean }) =>
    unwrap<Category[]>(apiClient.get("/categories", { params })),
  createCategory: (payload: Partial<Category>) => unwrap<Category>(apiClient.post("/categories", payload)),
  updateCategory: (categoryId: string, payload: Partial<Category>) => unwrap<Category>(apiClient.patch(`/categories/${categoryId}`, payload)),
  deleteCategory: (categoryId: string) => unwrap<{ id: string; deactivated: boolean }>(apiClient.delete(`/categories/${categoryId}`)),

  getTransactions: (params?: {
    type?: TransactionType;
    categoryId?: string;
    paymentMethod?: PaymentMethod;
    dateFrom?: string;
    dateTo?: string;
    minAmount?: number;
    maxAmount?: number;
    search?: string;
    linkedContactId?: string;
    page?: number;
    limit?: number;
    sortBy?: "date" | "amount" | "createdAt";
    sortOrder?: "asc" | "desc";
  }) => unwrap<PaginatedTransactions>(apiClient.get("/transactions", { params })),
  getTransaction: (transactionId: string) => unwrap<Transaction>(apiClient.get(`/transactions/${transactionId}`)),
  createTransaction: (payload: Partial<Transaction>) => unwrap<Transaction>(apiClient.post("/transactions", payload)),
  updateTransaction: (transactionId: string, payload: Partial<Transaction>) =>
    unwrap<Transaction>(apiClient.patch(`/transactions/${transactionId}`, payload)),
  deleteTransaction: (transactionId: string) => unwrap<{ id: string }>(apiClient.delete(`/transactions/${transactionId}`)),
};

export const getApiBaseUrl = () => API_URL;
