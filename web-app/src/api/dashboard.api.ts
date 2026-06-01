import { apiClient, unwrap } from "./axios";
import {
  DashboardSummary,
  MonthlyChartPoint,
  LoanTypeChartPoint,
  LoanStatusChartPoint,
  TopContact,
} from "../types";

export const dashboardApi = {
  getSummary: () => unwrap<DashboardSummary>(apiClient.get("/dashboard/summary")),
  
  getMonthlyChart: (months = 6) =>
    unwrap<MonthlyChartPoint[]>(apiClient.get("/dashboard/monthly-chart", { params: { months } })),
  
  getLoanTypeChart: () => unwrap<LoanTypeChartPoint[]>(apiClient.get("/dashboard/loan-type-chart")),
  
  getLoanStatusChart: () => unwrap<LoanStatusChartPoint[]>(apiClient.get("/dashboard/loan-status-chart")),
  
  getTopContacts: (limit = 5) =>
    unwrap<TopContact[]>(apiClient.get("/dashboard/top-contacts", { params: { limit } })),
};
