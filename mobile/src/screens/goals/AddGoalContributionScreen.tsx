import { zodResolver } from "@hookform/resolvers/zod";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { HandCoins } from "lucide-react-native";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Text, View } from "react-native";
import { z } from "zod";
import { api } from "../../api/client";
import { AppButton } from "../../components/AppButton";
import { DatePickerField } from "../../components/DatePickerField";
import { FormInput } from "../../components/FormInput";
import { Screen } from "../../components/Screen";
import { LoadingState } from "../../components/StateViews";
import { RootStackParamList } from "../../navigation/types";
import { showAlert } from "../../providers/AlertProvider";
import { getErrorMessage } from "../../utils/errors";
import { toDateInput } from "../../utils/format";
import { fontFamily } from "../../utils/theme";

const schema = z.object({
  amount: z.string().min(1, "Amount required").refine((value) => Number(value) > 0, "Amount must be greater than 0"),
  date: z.string().min(1, "Date required"),
  note: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;
type Props = NativeStackScreenProps<RootStackParamList, "AddGoalContribution">;

export const AddGoalContributionScreen = ({ navigation, route }: Props) => {
  const queryClient = useQueryClient();
  const { goalId, contributionId } = route.params;
  const isEditing = Boolean(contributionId);

  const goalQuery = useQuery({
    queryKey: ["goal", goalId],
    queryFn: () => api.getGoal(goalId),
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { amount: "", date: toDateInput(new Date()), note: "" },
  });

  useEffect(() => {
    const contribution = goalQuery.data?.contributions.find((item) => item._id === contributionId);
    if (contribution) {
      reset({
        amount: String(contribution.amount),
        date: toDateInput(contribution.date),
        note: contribution.note || "",
      });
    }
  }, [contributionId, goalQuery.data?.contributions, reset]);

  const mutation = useMutation({
    mutationFn: (values: FormValues) => {
      const payload = {
        amount: Number(values.amount),
        date: values.date,
        note: values.note || undefined,
      };
      return contributionId
        ? api.updateGoalContribution(goalId, contributionId, payload)
        : api.addGoalContribution(goalId, payload);
    },
    onSuccess: async (data) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["goals"] }),
        queryClient.invalidateQueries({ queryKey: ["goal", goalId] }),
        queryClient.invalidateQueries({ queryKey: ["dashboard"] }),
      ]);
      if (data.message && data.goal.status === "COMPLETED") {
        showAlert({
          title: "Goal Complete",
          message: data.message,
          buttons: [{ text: "Great" }],
        });
      }
      navigation.goBack();
    },
  });

  if (goalQuery.isLoading) return <Screen><LoadingState label="Loading goal..." /></Screen>;

  return (
    <Screen className="gap-4 pt-5">
      <View>
        <Text className="text-2xl font-bold text-dark" style={{ fontFamily: fontFamily.bold }}>
          {isEditing ? "Edit Money" : "Add Money"}
        </Text>
        <Text className="mt-1 text-sm font-medium text-muted">
          {goalQuery.data?.goal.title || "Goal"} ke liye saved amount update karein.
        </Text>
      </View>

      <FormInput control={control} name="amount" label="Amount" keyboardType="numeric" placeholder="1000" error={errors.amount?.message} />
      <Controller
        control={control}
        name="date"
        render={({ field: { onChange, value } }) => (
          <DatePickerField label="Date" value={value} onChange={onChange} error={errors.date?.message} />
        )}
      />
      <FormInput control={control} name="note" label="Note" placeholder="Optional note" multiline />

      {mutation.isError ? <Text className="text-sm font-semibold text-danger">{getErrorMessage(mutation.error)}</Text> : null}
      <AppButton
        title={isEditing ? "Save Money" : "Add Money"}
        icon={HandCoins}
        loading={mutation.isPending}
        onPress={handleSubmit((values) => mutation.mutate(values))}
      />
    </Screen>
  );
};
