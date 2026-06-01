import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { transactionsApi } from "../api/transactions.api";
import { QUERY_KEYS } from "../constants/queryKeys";
import { Transaction } from "../types";

export const useTransactions = (transactionId?: string, listParams?: Record<string, any>) => {
  const queryClient = useQueryClient();

  // Queries
  const transactionsQuery = useQuery({
    queryKey: [QUERY_KEYS.TRANSACTIONS, listParams],
    queryFn: () => transactionsApi.getTransactions(listParams),
    enabled: !transactionId,
  });

  const transactionDetailQuery = useQuery({
    queryKey: [QUERY_KEYS.TRANSACTION_DETAIL, transactionId],
    queryFn: () => transactionsApi.getTransaction(transactionId!),
    enabled: !!transactionId,
  });

  const categoriesQuery = useQuery({
    queryKey: [QUERY_KEYS.CATEGORIES],
    queryFn: () => transactionsApi.getCategories(),
  });

  // Mutations
  const createTransactionMutation = useMutation({
    mutationFn: transactionsApi.createTransaction,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TRANSACTIONS] });
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DASHBOARD_SUMMARY] });
    },
  });

  const updateTransactionMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Transaction> }) =>
      transactionsApi.updateTransaction(id, payload),
    onSuccess: (data, variables) => {
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TRANSACTION_DETAIL, variables.id] });
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TRANSACTIONS] });
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DASHBOARD_SUMMARY] });
    },
  });

  const deleteTransactionMutation = useMutation({
    mutationFn: transactionsApi.deleteTransaction,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TRANSACTIONS] });
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DASHBOARD_SUMMARY] });
    },
  });

  const createCategoryMutation = useMutation({
    mutationFn: transactionsApi.createCategory,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CATEGORIES] });
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      transactionsApi.updateCategory(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CATEGORIES] });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: transactionsApi.deleteCategory,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CATEGORIES] });
    },
  });

  return {
    transactions: transactionsQuery.data,
    transactionDetail: transactionDetailQuery.data,
    categories: categoriesQuery.data,
    isLoading: transactionsQuery.isLoading || categoriesQuery.isLoading,
    
    // Mutations
    createTransaction: createTransactionMutation.mutateAsync,
    isCreating: createTransactionMutation.isPending,
    updateTransaction: updateTransactionMutation.mutateAsync,
    isUpdating: updateTransactionMutation.isPending,
    deleteTransaction: deleteTransactionMutation.mutateAsync,
    isDeleting: deleteTransactionMutation.isPending,
    
    // Category Mutations
    createCategory: createCategoryMutation.mutateAsync,
    updateCategory: updateCategoryMutation.mutateAsync,
    deleteCategory: deleteCategoryMutation.mutateAsync,
  };
};

export default useTransactions;
