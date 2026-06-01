import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { loansApi } from "../api/loans.api";
import { QUERY_KEYS } from "../constants/queryKeys";
import { Loan } from "../types";

export const useLoans = (loanId?: string, listParams?: Record<string, any>) => {
  const queryClient = useQueryClient();

  const loansQuery = useQuery({
    queryKey: [QUERY_KEYS.LOANS, listParams],
    queryFn: () => loansApi.getLoans(listParams),
    enabled: !loanId,
  });

  const loanDetailQuery = useQuery({
    queryKey: [QUERY_KEYS.LOAN_DETAIL, loanId],
    queryFn: () => loansApi.getLoan(loanId!),
    enabled: Boolean(loanId),
  });

  const createLoanMutation = useMutation({
    mutationFn: loansApi.createLoan,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LOANS] });
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DASHBOARD_SUMMARY] });
    },
  });

  const updateLoanMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Loan> }) =>
      loansApi.updateLoan(id, payload),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LOAN_DETAIL, variables.id] });
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LOANS] });
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DASHBOARD_SUMMARY] });
    },
  });

  const deleteLoanMutation = useMutation({
    mutationFn: loansApi.deleteLoan,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LOANS] });
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DASHBOARD_SUMMARY] });
    },
  });

  return {
    loans: loansQuery.data,
    loanDetail: loanDetailQuery.data,
    isLoading: loansQuery.isLoading || loanDetailQuery.isLoading,
    error: loansQuery.error || loanDetailQuery.error,
    refetch: async () => {
      await Promise.all([loansQuery.refetch(), loanDetailQuery.refetch()]);
    },
    createLoan: createLoanMutation.mutateAsync,
    isCreating: createLoanMutation.isPending,
    updateLoan: updateLoanMutation.mutateAsync,
    isUpdating: updateLoanMutation.isPending,
    deleteLoan: deleteLoanMutation.mutateAsync,
    isDeleting: deleteLoanMutation.isPending,
  };
};

export default useLoans;
