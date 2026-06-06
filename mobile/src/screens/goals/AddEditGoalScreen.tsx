import { zodResolver } from "@hookform/resolvers/zod";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Save } from "lucide-react-native";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Text, View } from "react-native";
import { z } from "zod";
import { api } from "../../api/client";
import { AppButton } from "../../components/AppButton";
import { FormInput } from "../../components/FormInput";
import { Screen } from "../../components/Screen";
import { LoadingState } from "../../components/StateViews";
import { RootStackParamList } from "../../navigation/types";
import { getErrorMessage } from "../../utils/errors";
import { fontFamily } from "../../utils/theme";

const schema = z.object({
  title: z.string().trim().min(2, "Goal title required").max(100),
  targetAmount: z.string().min(1, "Target amount required").refine((value) => Number(value) > 0, "Target must be greater than 0"),
  note: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;
type Props = NativeStackScreenProps<RootStackParamList, "AddEditGoal">;

export const AddEditGoalScreen = ({ navigation, route }: Props) => {
  const queryClient = useQueryClient();
  const goalId = route.params?.goalId;
  const isEditing = Boolean(goalId);

  const goalQuery = useQuery({
    queryKey: ["goal", goalId],
    queryFn: () => api.getGoal(goalId!),
    enabled: Boolean(goalId),
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { title: "", targetAmount: "", note: "" },
  });

  useEffect(() => {
    if (goalQuery.data?.goal) {
      const goal = goalQuery.data.goal;
      reset({
        title: goal.title,
        targetAmount: String(goal.targetAmount),
        note: goal.note || "",
      });
    }
  }, [goalQuery.data?.goal, reset]);

  const mutation = useMutation({
    mutationFn: (values: FormValues) => {
      const payload = {
        title: values.title.trim(),
        targetAmount: Number(values.targetAmount),
        note: values.note || undefined,
      };
      return goalId ? api.updateGoal(goalId, payload) : api.createGoal(payload);
    },
    onSuccess: async (data) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["goals"] }),
        queryClient.invalidateQueries({ queryKey: ["goal", data.goal._id] }),
        queryClient.invalidateQueries({ queryKey: ["dashboard"] }),
      ]);
      if (isEditing) {
        navigation.goBack();
      } else {
        navigation.replace("GoalDetail", { goalId: data.goal._id });
      }
    },
  });

  if (goalQuery.isLoading) return <Screen><LoadingState label="Loading goal..." /></Screen>;

  return (
    <Screen className="gap-4 pt-5">
      <View>
        <Text className="text-2xl font-black text-dark" style={{ fontFamily: fontFamily.extraBold }}>
          {isEditing ? "Edit Goal" : "Add Goal"}
        </Text>
        <Text className="mt-1 text-sm font-medium text-muted">
          Set a clear target and add money slowly.
        </Text>
      </View>

      <FormInput control={control} name="title" label="Goal Name" placeholder="Mobile phone" error={errors.title?.message} />
      <FormInput control={control} name="targetAmount" label="Target Amount" keyboardType="numeric" placeholder="25000" error={errors.targetAmount?.message} />
      <FormInput control={control} name="note" label="Note" placeholder="Optional note" multiline />

      {mutation.isError ? <Text className="text-sm font-semibold text-danger">{getErrorMessage(mutation.error)}</Text> : null}
      <AppButton
        title={isEditing ? "Save Goal" : "Create Goal"}
        icon={Save}
        loading={mutation.isPending}
        onPress={handleSubmit((values) => mutation.mutate(values))}
      />
    </Screen>
  );
};
