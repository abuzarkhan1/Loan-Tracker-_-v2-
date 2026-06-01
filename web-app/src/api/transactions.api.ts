import { apiClient, unwrap } from "./axios";
import {
  PaginatedTransactions,
  Transaction,
  Category,
  PaymentMethod,
  TransactionType,
} from "../types";

export const transactionsApi = {
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
    sortBy?: string;
    sortOrder?: string;
  }) => unwrap<PaginatedTransactions>(apiClient.get("/transactions", { params })),
  
  getTransaction: (id: string) => unwrap<Transaction>(apiClient.get(`/transactions/${id}`)),
  
  createTransaction: (payload: Partial<Transaction>) => unwrap<Transaction>(apiClient.post("/transactions", payload)),
  
  updateTransaction: (id: string, payload: Partial<Transaction>) => unwrap<Transaction>(apiClient.patch(`/transactions/${id}`, payload)),
  
  deleteTransaction: (id: string) => unwrap<{ id: string }>(apiClient.delete(`/transactions/${id}`)),

  // Categories
  getCategories: (params?: { type?: "INCOME" | "EXPENSE"; includeInactive?: boolean }) =>
    unwrap<Category[]>(apiClient.get("/categories", { params })),
  
  createCategory: (payload: Partial<Category>) => unwrap<Category>(apiClient.post("/categories", payload)),
  
  updateCategory: (id: string, payload: Partial<Category>) => unwrap<Category>(apiClient.patch(`/categories/${id}`, payload)),
  
  deleteCategory: (id: string) => unwrap<{ id: string; deactivated: boolean }>(apiClient.delete(`/categories/${id}`)),
};
