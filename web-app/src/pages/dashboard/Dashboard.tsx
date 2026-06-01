import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowDownLeft, ArrowUpRight, CheckCircle, Clock, Coins, Plus } from "lucide-react";
import { Bar, BarChart as ReBarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import useDashboard from "../../hooks/useDashboard";
import AmountText from "../../components/common/AmountText";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import ErrorState from "../../components/common/ErrorState";
import LoadingState from "../../components/common/LoadingState";
import { ROUTES } from "../../config/routes.config";

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { summary, monthlyChart, loanTypeChart, isLoading, error, refetch } = useDashboard();

  if (isLoading) return <LoadingState message="Loading dashboard..." type="card-skeletons" count={3} />;
  if (error) return <ErrorState onRetry={refetch} message="Could not fetch dashboard summary." />;

  const chartData = monthlyChart?.length ? monthlyChart : [];
  const pieData = loanTypeChart?.length
    ? loanTypeChart.map((item) => ({ name: item.type === "GIVEN" ? "Given" : "Taken", value: item.amount }))
    : [];
  const pieColors = ["#f36f56", "#6f6577"];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="border-l-4 border-l-appPrimary">
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-appMuted flex items-center gap-1.5">
            <ArrowUpRight className="h-3.5 w-3.5 text-appPrimary" /> Mujhe Lene Hain
          </p>
          <AmountText amount={summary?.netReceivable || 0} className="mt-2 block text-2xl font-extrabold text-appText" />
        </Card>
        <Card className="border-l-4 border-l-appWarning">
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-appMuted flex items-center gap-1.5">
            <ArrowDownLeft className="h-3.5 w-3.5 text-appWarning" /> Mujhe Dene Hain
          </p>
          <AmountText amount={summary?.netPayable || 0} className="mt-2 block text-2xl font-extrabold text-appText" />
        </Card>
        <Card className="border-l-4 border-l-appSuccess">
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-appMuted flex items-center gap-1.5">
            <CheckCircle className="h-3.5 w-3.5 text-appSuccess" /> Total Wapis Mila
          </p>
          <AmountText amount={summary?.totalReceivedBack || 0} className="mt-2 block text-2xl font-extrabold text-appText" />
        </Card>
        <Card className="border-l-4 border-l-appDanger">
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-appMuted flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-appDanger" /> Overdue Loans
          </p>
          <p className="mt-2 text-2xl font-extrabold text-appText">{summary?.overdueLoans || 0}</p>
        </Card>
      </div>

      <Card variant="flat" className="grid grid-cols-1 md:grid-cols-3 gap-4 border border-appBorder/30">
        <Button onClick={() => navigate(ROUTES.ADD_LOAN)} leftIcon={<Plus className="h-4 w-4" />}>Add Loan</Button>
        <Button variant="secondary" onClick={() => navigate(ROUTES.ADD_PAYMENT)} leftIcon={<Coins className="h-4 w-4" />}>Add Payment</Button>
        <Button variant="outline" onClick={() => navigate(ROUTES.ADD_TRANSACTION)} leftIcon={<Plus className="h-4 w-4" />}>Add Expense / Income</Button>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-bold text-appText">Monthly Loan Activity</h3>
            <span className="text-xs text-appMuted">Last 6 months</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ReBarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.35} />
                <XAxis dataKey="month" fontSize={11} />
                <YAxis fontSize={11} />
                <Tooltip />
                <Legend />
                <Bar name="Given" dataKey="given" fill="#f36f56" radius={[4, 4, 0, 0]} />
                <Bar name="Taken" dataKey="taken" fill="#6f6577" radius={[4, 4, 0, 0]} />
                <Bar name="Received" dataKey="received" fill="#16A34A" radius={[4, 4, 0, 0]} />
                <Bar name="Paid" dataKey="paid" fill="#F59E0B" radius={[4, 4, 0, 0]} />
              </ReBarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-bold text-appText mb-1">Loan Type Split</h3>
          <p className="text-xs text-appMuted mb-4">Given vs taken principal.</p>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={4}>
                  {pieData.map((_item, index) => <Cell key={index} fill={pieColors[index % pieColors.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
