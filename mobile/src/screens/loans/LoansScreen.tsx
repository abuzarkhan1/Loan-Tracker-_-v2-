import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useQuery } from "@tanstack/react-query";
import { Plus, Search } from "lucide-react-native";
import { useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { api } from "../../api/client";
import { LoanStatus, LoanType } from "../../api/types";
import { LoanCard } from "../../components/LoanCard";
import { Screen } from "../../components/Screen";
import { EmptyState, ErrorState, LoadingState } from "../../components/StateViews";
import { RootStackParamList } from "../../navigation/types";
import { useAppTheme } from "../../providers/ThemeProvider";
import { fontFamily } from "../../utils/theme";

type Navigation = NativeStackNavigationProp<RootStackParamList>;
type LoanFilter = "ALL" | LoanType | Extract<LoanStatus, "OVERDUE" | "COMPLETED">;

const filters: Array<{ label: string; value: LoanFilter }> = [
  { label: "Sab", value: "ALL" },
  { label: "Lena Hai", value: "GIVEN" },
  { label: "Dena Hai", value: "TAKEN" },
  { label: "Overdue", value: "OVERDUE" },
  { label: "Mukammal", value: "COMPLETED" },
];

const FilterChip = ({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) => {
  const { theme } = useAppTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.86}
      onPress={onPress}
      style={[
        {
          minHeight: 34,
          borderRadius: 6,
          borderWidth: 1,
          borderColor: active ? theme.primary : theme.border,
          backgroundColor: active ? theme.primary : theme.pill,
          paddingHorizontal: 12,
          alignItems: "center",
          justifyContent: "center",
        },
        active
          ? {
              shadowColor: theme.primary,
              shadowOpacity: 0.14,
              shadowRadius: 10,
              shadowOffset: { width: 0, height: 4 },
              elevation: 3,
            }
          : null,
      ]}
    >
      <Text style={{ color: active ? "#000000" : theme.muted, fontFamily: fontFamily.medium, fontSize: 13 }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export const LoansScreen = () => {
  const navigation = useNavigation<Navigation>();
  const { theme } = useAppTheme();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<LoanFilter>("ALL");
  const type = filter === "GIVEN" || filter === "TAKEN" ? filter : undefined;
  const status = filter === "OVERDUE" || filter === "COMPLETED" ? filter : undefined;

  const loansQuery = useQuery({
    queryKey: ["loans", search, filter],
    queryFn: () =>
      api.getLoans({
        search,
        type,
        status,
        limit: 50,
      }),
  });

  return (
    <Screen className="pt-1">
      <View className="flex-row items-start justify-between gap-4">
        <View className="flex-1">
          <Text style={{ color: theme.text, fontFamily: fontFamily.bold, fontSize: 32, lineHeight: 40 }}>Loans</Text>
          <Text style={{ color: theme.textSecondary, fontFamily: fontFamily.regular, fontSize: 15, lineHeight: 22, marginTop: 2 }}>
            Tamam Loans
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.86}
          onPress={() => navigation.navigate("LoanForm")}
          style={{
            height: 40,
            width: 40,
            borderRadius: 6,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: theme.primary,
            shadowColor: theme.primary,
            shadowOpacity: 0.18,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: 4 },
            elevation: 4,
          }}
        >
          <Plus color="#000000" size={22} strokeWidth={2.1} />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mt-6 -mx-6"
        contentContainerStyle={{ gap: 8, paddingHorizontal: 24 }}
      >
        {filters.map((item) => (
          <FilterChip
            key={item.value}
            label={item.label}
            active={filter === item.value}
            onPress={() => setFilter(item.value)}
          />
        ))}
      </ScrollView>

      <View
        className="mt-4 flex-row items-center gap-3 border px-3"
        style={[
          {
            minHeight: 40,
            borderRadius: 6,
            borderColor: theme.border,
            backgroundColor: theme.surface,
          },
          theme.mode === "dark"
            ? null
            : {
                shadowColor: theme.secondary,
                shadowOpacity: 0.04,
                shadowRadius: 4,
                shadowOffset: { width: 0, height: 2 },
                elevation: 1,
              },
        ]}
      >
        <Search color={theme.muted} size={18} />
        <TextInput
          value={search}
          onChangeText={setSearch}
          autoCorrect={false}
          placeholder="Loan talash karein..."
          placeholderTextColor={theme.placeholder}
          returnKeyType="search"
          style={{ flex: 1, color: theme.text, fontFamily: fontFamily.regular, fontSize: 15, paddingVertical: 0 }}
        />
      </View>

      <View className="mt-5 gap-3">
        {loansQuery.isLoading ? <LoadingState label="Loading loans..." /> : null}
        {loansQuery.isError ? <ErrorState message="Loans load nahi ho sake." onRetry={loansQuery.refetch} /> : null}
        {loansQuery.data?.loans.length === 0 ? (
          <EmptyState title="No loans yet" subtitle="Naya Loan se paise diye ya liye hue amount ka record start karein." />
        ) : null}
        {loansQuery.data?.loans.map((loan) => (
          <LoanCard key={loan._id} loan={loan} onPress={() => navigation.navigate("LoanDetail", { loanId: loan._id })} />
        ))}
      </View>
    </Screen>
  );
};
