import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { paymentsApi } from "../api/payments.api";
import { QUERY_KEYS } from "../constants/queryKeys";

export const usePayments = (loanId?: string, paymentId?: string) => {
  const queryClient = useQueryClient();

  const paymentsQuery = useQuery({
    queryKey: [QUERY_KEYS.PAYMENTS, loanId],
    queryFn: () => paymentsApi.getPaymentsByLoan(loanId!),
    enabled: Boolean(loanId),
  });

  const paymentQuery = useQuery({
    queryKey: [QUERY_KEYS.PAYMENTS, "detail", paymentId],
    queryFn: () => paymentsApi.getPayment(paymentId!),
    enabled: Boolean(paymentId),
  });

  const addPaymentMutation = useMutation({
    mutationFn: paymentsApi.addPayment,
    onSuccess: () => {
      if (loanId) {
        void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PAYMENTS, loanId] });
        void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LOAN_DETAIL, loanId] });
      }
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LOANS] });
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TRANSACTIONS] });
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DASHBOARD_SUMMARY] });
    },
  });

  const updatePaymentMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      paymentsApi.updatePayment(id, payload),
    onSuccess: () => {
      if (loanId) {
        void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PAYMENTS, loanId] });
        void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LOAN_DETAIL, loanId] });
      }
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LOANS] });
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TRANSACTIONS] });
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DASHBOARD_SUMMARY] });
    },
  });

  const deletePaymentMutation = useMutation({
    mutationFn: paymentsApi.deletePayment,
    onSuccess: () => {
      if (loanId) {
        void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PAYMENTS, loanId] });
        void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LOAN_DETAIL, loanId] });
      }
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LOANS] });
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TRANSACTIONS] });
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DASHBOARD_SUMMARY] });
    },
  });

  return {
    payments: paymentsQuery.data,
    payment: paymentQuery.data,
    isLoading: paymentsQuery.isLoading,
    isPaymentLoading: paymentQuery.isLoading,
    addPayment: addPaymentMutation.mutateAsync,
    isAdding: addPaymentMutation.isPending,
    updatePayment: updatePaymentMutation.mutateAsync,
    isUpdating: updatePaymentMutation.isPending,
    deletePayment: deletePaymentMutation.mutateAsync,
    isDeleting: deletePaymentMutation.isPending,
  };
};

export default usePayments;
