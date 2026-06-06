import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Trash2, Eye, EyeOff, FolderOpen, Layers, CheckCircle2 } from "lucide-react";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import Badge from "../../components/common/Badge";
import LoadingState from "../../components/common/LoadingState";
import { useTransactions } from "../../hooks/useTransactions";

const categorySchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters"),
  type: z.enum(["INCOME", "EXPENSE"]),
  icon: z.string().optional(),
  color: z.string().optional(),
});

type CategoryFormInputs = z.infer<typeof categorySchema>;

export const Categories: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"EXPENSE" | "INCOME">("EXPENSE");
  const [formOpen, setFormOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const { categories, isLoading, createCategory, deleteCategory, updateCategory } = useTransactions();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormInputs>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      type: "EXPENSE",
      color: "#6366F1",
    },
  });

  const onSubmit = async (data: CategoryFormInputs) => {
    setFormError(null);
    try {
      await createCategory(data);
      setFormOpen(false);
      reset();
    } catch (err: any) {
      setFormError(err.response?.data?.message || "Failed to create category.");
    }
  };

  const handleToggleActive = async (id: string, currentIsActive: boolean) => {
    try {
      await updateCategory({
        id,
        payload: { isActive: !currentIsActive },
      });
    } catch (err: any) {
      alert("Failed to update status.");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to deactivate/delete this category? Transactions using it will be preserved but category won't show in new selections.")) {
      try {
        await deleteCategory(id);
      } catch (err: any) {
        alert("Failed to delete category.");
      }
    }
  };

  if (isLoading) {
    return <LoadingState message="Loading finance categories..." />;
  }

  const expenseCategories = (categories || []).filter((cat) => cat.type === "EXPENSE");
  const incomeCategories = (categories || []).filter((cat) => cat.type === "INCOME");
  const displayList = activeTab === "EXPENSE" ? expenseCategories : incomeCategories;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-appText">Categories</h1>
          <p className="text-sm text-appMuted">Customize simple expense and income categories.</p>
        </div>
        <Button
          variant="primary"
          size="sm"
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={() => setFormOpen(!formOpen)}
        >
          {formOpen ? "Close Drawer" : "Create Category"}
        </Button>
      </div>

      {/* Add New Category Card */}
      {formOpen && (
        <Card variant="bordered" className="border-appBorder/50 bg-appCard">
          <h3 className="font-bold text-appText mb-4">Create New Category</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
            <div className="sm:col-span-2">
              <Input
                label="Category Name"
                placeholder="e.g. Health, Utilities, Fuel"
                error={errors.name?.message}
                {...register("name")}
              />
            </div>
            <div>
              <Select
                label="Category Type"
                error={errors.type?.message}
                {...register("type")}
                options={[
                  { label: "Expense (-)", value: "EXPENSE" },
                  { label: "Income (+)", value: "INCOME" },
                ]}
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" variant="primary" className="w-full">
                Save
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setFormOpen(false);
                  reset();
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
          {formError && (
            <p className="text-xs text-rose-500 mt-2 font-medium">{formError}</p>
          )}
        </Card>
      )}

      {/* Tab controls */}
      <div className="flex border-b border-appBorder">
        <button
          onClick={() => setActiveTab("EXPENSE")}
          className={`px-4 py-2.5 font-semibold text-sm border-b-2 transition-all ${activeTab === "EXPENSE" ? "border-rose-500 text-rose-600 dark:text-rose-400" : "border-transparent text-appMuted hover:text-appText"}`}
        >
          Expense Categories ({expenseCategories.length})
        </button>
        <button
          onClick={() => setActiveTab("INCOME")}
          className={`px-4 py-2.5 font-semibold text-sm border-b-2 transition-all ${activeTab === "INCOME" ? "border-emerald-500 text-emerald-600 dark:text-emerald-400" : "border-transparent text-appMuted hover:text-appText"}`}
        >
          Income Categories ({incomeCategories.length})
        </button>
      </div>

      {/* Categories grid */}
      {displayList.length === 0 ? (
        <div className="py-12 text-center text-appMuted">
          No categories found. Click "Create Category" to build one.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {displayList.map((cat) => (
            <Card
              key={cat._id}
              variant="bordered"
              className={`hover:shadow-md transition-shadow relative overflow-hidden ${!cat.isActive ? "opacity-60 bg-appBgSoft" : ""}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-appBgSoft border border-appBorder flex items-center justify-center text-appMuted shrink-0">
                    <FolderOpen className="h-4 w-4 text-indigo-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-appText text-sm sm:text-base">{cat.name}</h4>
                    <span className="text-[10px] text-appMuted capitalize">{cat.type.toLowerCase()} envelope</span>
                  </div>
                </div>

                {/* Badging & Actions */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleToggleActive(cat._id, cat.isActive ?? true)}
                    className="p-1.5 hover:bg-appBgSoft rounded-lg text-appMuted transition-colors"
                    title={cat.isActive ? "Deactivate" : "Activate"}
                  >
                    {cat.isActive ? <Eye className="h-4 w-4 text-emerald-500" /> : <EyeOff className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => handleDelete(cat._id)}
                    className="p-1.5 hover:bg-appBgSoft rounded-lg text-rose-500 hover:text-rose-600 transition-colors"
                    title="Deactivate / Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Status footer pill */}
              <div className="mt-3 pt-2 border-t border-appBorder flex justify-between items-center text-[10px]">
                <span className="text-appMuted">Created: {new Date(cat.createdAt).toLocaleDateString()}</span>
                <Badge variant={cat.isActive ? "success" : "muted"}>
                  {cat.isActive ? "Active" : "Disabled"}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Categories;
