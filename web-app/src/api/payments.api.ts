import { apiClient, unwrap } from "./axios";
import { Payment, PaymentMutationResponse } from "../types";

export const paymentsApi = {
  addPayment: (payload: Partial<Payment>) => unwrap<PaymentMutationResponse>(apiClient.post("/payments", payload)),

  getPaymentsByLoan: (loanId: string) => unwrap<Payment[]>(apiClient.get(`/payments/loan/${loanId}`)),

  getPayment: (paymentId: string) => unwrap<Payment>(apiClient.get(`/payments/${paymentId}`)),

  updatePayment: (paymentId: string, payload: Partial<Payment>) =>
    unwrap<PaymentMutationResponse>(apiClient.patch(`/payments/${paymentId}`, payload)),

  deletePayment: (paymentId: string) =>
    unwrap<PaymentMutationResponse>(apiClient.delete(`/payments/${paymentId}`)),
};
