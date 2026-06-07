import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Edit3, Eye, EyeOff, FolderOpen, Layers, Plus, Save, Trash2, X } from "lucide-react";
import AmountText from "../../components/common/AmountText";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import LoadingState from "../../components/common/LoadingState";
import PageHeader from "../../components/common/PageHeader";
import Select from "../../components/common/Select";
import { useTransactions } from "../../hooks/useTransactions";
import type { Category } from "../../types";

const categorySchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters"),
  type: z.enum(["INCOME", "EXPENSE"]),
  icon: z.string().max(60).optional(),
  color: z.string().max(20).optional(),
  monthlyBudget: z.coerce.number().min(0, "Budget cannot be negative").optional(),
});

type CategoryFormInputs = z.infer<typeof categorySchema>;

export const Categories: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"EXPENSE" | "INCOME">("EXPENSE");
  const [formOpen, setFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const { categories, isLoading, createCategory, deleteCategory, updateCategory } = useTransactions();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CategoryFormInputs>({
    resolver: zodResolver(categorySchema) as any,
    defaultValues: {
      type: "EXPENSE",
      color: "#635BFF",
      monthlyBudget: 0,
    },
  });

  const openCreate = () => {
    setEditingCategory(null);
    setFormError(null);
    reset({ type: activeTab, color: "#635BFF", monthlyBudget: 0, icon: "", name: "" });
    setFormOpen(true);
  };

  const openEdit = (category: Category) => {
    setEditingCategory(category);
    setFormError(null);
    reset({
      name: category.name,
      type: category.type,
      icon: category.icon || "",
      color: category.color || "#635BFF",
      monthlyBudget: category.monthlyBudget || 0,
    });
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditingCategory(null);
    setFormError(null);
    reset({ type: activeTab, color: "#635BFF", monthlyBudget: 0, icon: "", name: "" });
  };

  const onSubmit = async (data: CategoryFormInputs) => {
    setFormError(null);
    const payload = {
      ...data,
      icon: data.icon || undefined,
      color: data.color || undefined,
      monthlyBudget: Number(data.monthlyBudget || 0),
    };

    try {
      if (editingCategory) {
        await updateCategory({ id: editingCategory._id, payload });
      } else {
        await createCategory(payload);
      }
      setActiveTab(data.type);
      closeForm();
    } catch (err: any) {
      setFormError(err.response?.data?.message || "Failed to save category.");
    }
  };

  const handleToggleActive = async (category: Category) => {
    try {
      await updateCategory({
        id: category._id,
        payload: { isActive: !category.isActive },
      });
    } catch {
      alert("Failed to update category status.");
    }
  };

  const handleDelete = async (category: Category) => {
    if (!window.confirm("Deactivate/delete this category? Existing transactions will stay preserved.")) return;
    try {
      await deleteCategory(category._id);
    } catch {
      alert("Failed to delete category.");
    }
  };

  if (isLoading) {
    return <LoadingState message="Loading finance categories..." />;
  }

  const expenseCategories = (categories || []).filter((category) => category.type === "EXPENSE");
  const incomeCategories = (categories || []).filter((category) => category.type === "INCOME");
  const displayList = activeTab === "EXPENSE" ? expenseCategories : incomeCategories;
  const budgetTotal = expenseCategories.reduce((sum, category) => sum + Number(category.monthlyBudget || 0), 0);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <PageHeader
        kicker="Money setup"
        title="Categories"
        description="Manage income and expense categories, including monthly budgets for expense tracking."
        icon={<Layers className="h-6 w-6" />}
        actions={
          <Button variant="primary" size="sm" leftIcon={<Plus className="h-4 w-4" />} onClick={openCreate}>
            Create Category
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-xs font-semibold uppercase tracking-[0.05em] text-appMuted">Expense Categories</p>
          <p className="mt-2 text-2xl font-semibold text-appDanger">{expenseCategories.length}</p>
        </Card>
        <Card>
          <p className="text-xs font-semibold uppercase tracking-[0.05em] text-appMuted">Income Categories</p>
          <p className="mt-2 text-2xl font-semibold text-appSuccess">{incomeCategories.length}</p>
        </Card>
        <Card>
          <p className="text-xs font-semibold uppercase tracking-[0.05em] text-appMuted">Monthly Budget</p>
          <AmountText amount={budgetTotal} className="mt-2 block text-2xl font-semibold text-appPrimary" />
        </Card>
      </div>

      {formOpen && (
        <Card className="border-appPrimary/30">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-appText">{editingCategory ? "Edit Category" : "Create Category"}</h3>
              <p className="mt-1 text-sm text-appTextSecondary">Budgets are used on the Expenses overview.</p>
            </div>
            <button type="button" className="rounded-md p-2 text-appMuted hover:bg-appSurface hover:text-appText" onClick={closeForm} aria-label="Close form">
              <X className="h-4 w-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Category Name" placeholder="Health, Utilities, Fuel" error={errors.name?.message} {...register("name")} />
              <Select
                label="Category Type"
                error={errors.type?.message}
                {...register("type")}
                onChange={(event) => setValue("type", event.target.value as "EXPENSE" | "INCOME")}
                options={[
                  { label: "Expense", value: "EXPENSE" },
                  { label: "Income", value: "INCOME" },
                ]}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <Input label="Icon Key" placeholder="utensils, wallet..." error={errors.icon?.message} {...register("icon")} />
              <Input label="Color" placeholder="#635BFF" error={errors.color?.message} {...register("color")} />
              <Input label="Monthly Budget" type="number" min={0} placeholder="0" error={errors.monthlyBudget?.message} {...register("monthlyBudget")} />
            </div>

            {formError ? <p className="text-sm font-medium text-appDanger">{formError}</p> : null}

            <div className="flex flex-col-reverse gap-2 border-t border-appBorder pt-4 sm:flex-row sm:justify-end">
              <Button type="button" variant="outline" onClick={closeForm}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" leftIcon={<Save className="h-4 w-4" />}>
                {editingCategory ? "Save Changes" : "Save Category"}
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="flex border-b border-appBorder">
        <button
          onClick={() => setActiveTab("EXPENSE")}
          className={`border-b-2 px-4 py-2.5 text-sm font-semibold transition-all ${activeTab === "EXPENSE" ? "border-appDanger text-appDanger" : "border-transparent text-appMuted hover:text-appText"}`}
        >
          Expense Categories ({expenseCategories.length})
        </button>
        <button
          onClick={() => setActiveTab("INCOME")}
          className={`border-b-2 px-4 py-2.5 text-sm font-semibold transition-all ${activeTab === "INCOME" ? "border-appSuccess text-appSuccess" : "border-transparent text-appMuted hover:text-appText"}`}
        >
          Income Categories ({incomeCategories.length})
        </button>
      </div>

      {displayList.length === 0 ? (
        <Card className="py-12 text-center">
          <p className="text-sm font-semibold text-appText">No categories found.</p>
          <p className="mt-1 text-sm text-appMuted">Create a category to start organizing cash flow.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {displayList.map((category) => (
            <Card key={category._id} className={`relative overflow-hidden transition-shadow hover:shadow-level2 ${!category.isActive ? "opacity-60" : ""}`}>
              <div className="absolute inset-x-0 top-0 h-1" style={{ backgroundColor: category.color || "#635BFF" }} />
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-appBorder bg-appSurface text-appPrimary">
                    <FolderOpen className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="truncate text-sm font-semibold text-appText">{category.name}</h4>
                    <p className="mt-1 text-xs capitalize text-appMuted">{category.type.toLowerCase()} category</p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button className="rounded-lg p-1.5 text-appMuted transition-colors hover:bg-appSurface hover:text-appText" onClick={() => openEdit(category)} title="Edit">
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button className="rounded-lg p-1.5 text-appMuted transition-colors hover:bg-appSurface hover:text-appText" onClick={() => handleToggleActive(category)} title={category.isActive ? "Deactivate" : "Activate"}>
                    {category.isActive ? <Eye className="h-4 w-4 text-appSuccess" /> : <EyeOff className="h-4 w-4" />}
                  </button>
                  <button className="rounded-lg p-1.5 text-appDanger transition-colors hover:bg-appSurface" onClick={() => handleDelete(category)} title="Delete">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-appBorder pt-3 text-xs">
                <div>
                  <p className="text-appMuted">Budget</p>
                  <AmountText amount={Number(category.monthlyBudget || 0)} className="mt-1 block text-sm font-semibold text-appText" />
                </div>
                <Badge variant={category.isActive ? "success" : "muted"}>
                  {category.isActive ? "Active" : "Disabled"}
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
