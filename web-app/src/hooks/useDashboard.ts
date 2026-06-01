import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "../api/dashboard.api";
import { QUERY_KEYS } from "../constants/queryKeys";

export const useDashboard = () => {
  const summaryQuery = useQuery({
    queryKey: [QUERY_KEYS.DASHBOARD_SUMMARY],
    queryFn: dashboardApi.getSummary,
  });

  const monthlyChartQuery = useQuery({
    queryKey: [QUERY_KEYS.DASHBOARD_MONTHLY_CHART],
    queryFn: () => dashboardApi.getMonthlyChart(6),
  });

  const loanTypeQuery = useQuery({
    queryKey: [QUERY_KEYS.DASHBOARD_LOAN_TYPE],
    queryFn: dashboardApi.getLoanTypeChart,
  });

  const loanStatusQuery = useQuery({
    queryKey: [QUERY_KEYS.DASHBOARD_LOAN_STATUS],
    queryFn: dashboardApi.getLoanStatusChart,
  });

  const topContactsQuery = useQuery({
    queryKey: [QUERY_KEYS.DASHBOARD_TOP_CONTACTS],
    queryFn: () => dashboardApi.getTopContacts(5),
  });

  return {
    summary: summaryQuery.data,
    monthlyChart: monthlyChartQuery.data,
    loanTypeChart: loanTypeQuery.data,
    loanStatusChart: loanStatusQuery.data,
    topContacts: topContactsQuery.data,
    isLoading:
      summaryQuery.isLoading ||
      monthlyChartQuery.isLoading ||
      loanTypeQuery.isLoading ||
      loanStatusQuery.isLoading ||
      topContactsQuery.isLoading,
    error: summaryQuery.error,
    isRefetching:
      summaryQuery.isRefetching ||
      monthlyChartQuery.isRefetching ||
      loanTypeQuery.isRefetching ||
      loanStatusQuery.isRefetching,
    refetch: async () => {
      await Promise.all([
        summaryQuery.refetch(),
        monthlyChartQuery.refetch(),
        loanTypeQuery.refetch(),
        loanStatusQuery.refetch(),
        topContactsQuery.refetch(),
      ]);
    },
  };
};

export default useDashboard;
