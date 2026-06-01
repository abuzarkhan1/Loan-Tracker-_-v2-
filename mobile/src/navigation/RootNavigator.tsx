import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LoadingState } from "../components/StateViews";
import { useAuth } from "../providers/AuthProvider";
import { useAppTheme } from "../providers/ThemeProvider";
import { fontFamily } from "../utils/theme";
import { AuthStackParamList, MainTabParamList, RootStackParamList } from "./types";
import { LoginScreen } from "../screens/auth/LoginScreen";
import { RegisterScreen } from "../screens/auth/RegisterScreen";
import { DashboardScreen } from "../screens/dashboard/DashboardScreen";
import { ContactsScreen } from "../screens/contacts/ContactsScreen";
import { ContactFormScreen } from "../screens/contacts/ContactFormScreen";
import { ContactLedgerScreen } from "../screens/contacts/ContactLedgerScreen";
import { ContactLoanProfileScreen } from "../screens/contacts/ContactLoanProfileScreen";
import { LoansScreen } from "../screens/loans/LoansScreen";
import { LoanFormScreen } from "../screens/loans/LoanFormScreen";
import { LoanDetailScreen } from "../screens/loans/LoanDetailScreen";
import { PaymentFormScreen } from "../screens/payments/PaymentFormScreen";
import { QuickAddPaymentScreen } from "../screens/payments/QuickAddPaymentScreen";
import { TransactionsScreen } from "../screens/transactions/TransactionsScreen";
import { TransactionDetailScreen } from "../screens/transactions/TransactionDetailScreen";
import { AddExpenseScreen, AddIncomeScreen, AddTransactionScreen } from "../screens/transactions/AddTransactionScreen";
import { CategoriesScreen } from "../screens/categories/CategoriesScreen";
import { AddEditCategoryScreen } from "../screens/categories/AddEditCategoryScreen";
import { SettingsScreen } from "../screens/settings/SettingsScreen";
import { FloatingTabBar } from "./FloatingTabBar";

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const RootStack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabs = () => (
  <Tab.Navigator
    tabBar={(props) => <FloatingTabBar {...props} />}
    screenOptions={{ headerShown: false }}
  >
    <Tab.Screen name="Dashboard" component={DashboardScreen} />
    <Tab.Screen name="Loans" component={LoansScreen} />
    <Tab.Screen name="Contacts" component={ContactsScreen} />
    <Tab.Screen name="Expenses" component={TransactionsScreen} />
    <Tab.Screen name="SettingsTab" component={SettingsScreen} />
  </Tab.Navigator>
);

const AuthNavigator = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="Register" component={RegisterScreen} />
  </AuthStack.Navigator>
);

const AppNavigator = () => {
  const { theme } = useAppTheme();

  return (
    <RootStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.background },
        headerTitleStyle: { color: theme.text, fontWeight: "800", fontFamily: fontFamily.extraBold },
        headerShadowVisible: false,
        headerTintColor: theme.text,
        contentStyle: { backgroundColor: theme.background },
      }}
    >
      <RootStack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
      <RootStack.Screen name="ContactForm" component={ContactFormScreen} options={{ title: "Contact" }} />
      <RootStack.Screen name="ContactLedger" component={ContactLedgerScreen} options={{ title: "Contact Ledger" }} />
      <RootStack.Screen name="ContactLoanProfile" component={ContactLoanProfileScreen} options={{ title: "Loan Profile" }} />
      <RootStack.Screen name="LoanForm" component={LoanFormScreen} options={{ title: "Naya Loan" }} />
      <RootStack.Screen name="LoanDetail" component={LoanDetailScreen} options={{ title: "Loan Detail" }} />
      <RootStack.Screen name="PaymentForm" component={PaymentFormScreen} options={{ title: "Nayi Payment" }} />
      <RootStack.Screen name="QuickAddPayment" component={QuickAddPaymentScreen} options={{ title: "Quick Payment" }} />
      <RootStack.Screen name="Transactions" component={TransactionsScreen} options={{ title: "Expenses & Income" }} />
      <RootStack.Screen name="TransactionDetail" component={TransactionDetailScreen} options={{ title: "Transaction Detail" }} />
      <RootStack.Screen name="AddTransaction" component={AddTransactionScreen} options={{ title: "Add Transaction" }} />
      <RootStack.Screen name="AddExpense" component={AddExpenseScreen} options={{ title: "Add Expense" }} />
      <RootStack.Screen name="AddIncome" component={AddIncomeScreen} options={{ title: "Add Income" }} />
      <RootStack.Screen name="Categories" component={CategoriesScreen} options={{ title: "Categories" }} />
      <RootStack.Screen name="AddEditCategory" component={AddEditCategoryScreen} options={{ title: "Category" }} />
      <RootStack.Screen name="Settings" component={SettingsScreen} options={{ title: "Settings" }} />
    </RootStack.Navigator>
  );
};

export const RootNavigator = () => {
  const { token, isBootstrapping } = useAuth();
  const { theme, mode } = useAppTheme();

  const navigationTheme = {
    ...DefaultTheme,
    dark: mode === "dark",
    colors: {
      ...DefaultTheme.colors,
      background: theme.background,
      card: theme.card,
      text: theme.text,
      border: theme.border,
      primary: theme.primary,
    },
  };

  if (isBootstrapping) {
    return <LoadingState label="Preparing your wallet..." />;
  }

  return (
    <NavigationContainer theme={navigationTheme}>
      {token ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};
