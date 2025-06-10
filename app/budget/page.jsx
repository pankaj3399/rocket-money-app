"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import {
  getCategories,
  addCategory,
  updateCategoryBudget,
  updateCategoryName,
  deleteCategory,
  addExpense,
  deleteExpense,
  getCategoryExpenses,
  getAllExpenses,
} from "../actions/budget";

// Dummy nodemailer function
const sendBudgetExceededEmail = async (categoryName, spent, budget) => {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        categoryName,
        spent,
        budget,
      }),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message);
    }

    console.log(`📧 Email Alert: Budget exceeded for ${categoryName}!`);
    console.log(
      `💰 Spent: $${spent} | Budget: $${budget} | Over by: $${spent - budget}`
    );
    toast.error(
      `Budget exceeded for ${categoryName}! Over by $${(spent - budget).toFixed(
        2
      )}`,
      {
        duration: 5000,
        icon: "🚨",
      }
    );
  } catch (error) {
    console.error('Failed to send email:', error);
    toast.error('Failed to send budget alert email', {
      duration: 5000,
      icon: "❌",
    });
  }
};

const BudgetPage = () => {
  const [categories, setCategories] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [newCategory, setNewCategory] = useState({
    name: "",
    budget: "",
  });
  const [editingCategory, setEditingCategory] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [newExpense, setNewExpense] = useState({
    amount: "",
    description: "",
    categoryId: "",
  });
  const [previousSpent, setPreviousSpent] = useState({});
  const [loading, setLoading] = useState(true);
  const [editingBudgets, setEditingBudgets] = useState({});

  useEffect(() => {
    fetchCategories();
    fetchAllExpenses();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { categories: fetchedCategories } = await getCategories();
      setCategories(fetchedCategories);

      // Initialize previous spent amounts
      const newPreviousSpent = {};
      fetchedCategories.forEach((category) => {
        newPreviousSpent[category.id] = category.spent;
      });
      setPreviousSpent(newPreviousSpent);
    } catch (error) {
      toast.error("Failed to fetch categories");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllExpenses = async () => {
    try {
      const { expenses: fetchedExpenses } = await getAllExpenses();
      setExpenses(fetchedExpenses);
    } catch (error) {
      toast.error("Failed to fetch expenses");
      console.error(error);
    }
  };

  // Check for budget exceeded whenever categories change
  useEffect(() => {
    categories.forEach((category) => {
      const prevSpent = previousSpent[category.id] || 0;
      if (
        category.spent > category.budget &&
        category.budget > 0 &&
        category.spent > prevSpent
      ) {
        sendBudgetExceededEmail(category.name, category.spent, category.budget);
      }
    });

    // Update previous spent amounts
    const newPreviousSpent = {};
    categories.forEach((category) => {
      newPreviousSpent[category.id] = category.spent;
    });
    setPreviousSpent(newPreviousSpent);
  }, [categories]);

  const handleAddCategory = async () => {
    if (!newCategory.name.trim()) {
      toast.error("Please enter a category name", {
        icon: "❌",
      });
      return;
    }

    const budgetAmount = Number(newCategory.budget);
    if (isNaN(budgetAmount) || budgetAmount < 0) {
      toast.error("Budget must be a positive number", {
        icon: "❌",
      });
      return;
    }

    try {
      const { category } = await addCategory(
        newCategory.name.trim(),
        "#000000",
        budgetAmount
      );
      console.log(category);
      setCategories([
        ...categories,
        {
          id: category._id,
          name: category.name,
          budget: category.budget,
          spent: category.spent,
          color: category.color,
        },
      ]);
      setNewCategory({ name: "", budget: "" });
      toast.success(`Category "${category.name}" added successfully!`, {
        icon: "✅",
      });
    } catch (error) {
      toast.error("Failed to add category");
      console.error(error);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      const category = categories.find((cat) => cat.id === id);
      await deleteCategory(id);
      setCategories(categories.filter((cat) => cat.id !== id));
      setExpenses(expenses.filter((exp) => exp.categoryId !== id));
      toast.success(`Category "${category.name}" deleted successfully!`, {
        icon: "🗑️",
      });
    } catch (error) {
      toast.error("Failed to delete category");
      console.error(error);
    }
  };

  const handleUpdateBudget = async (id, newBudget) => {
    try {
      const category = categories.find((cat) => cat.id === id);
      if (!category) {
        toast.error("Category not found");
        return;
      }

      const budgetAmount = Number(newBudget);
      if (isNaN(budgetAmount) || budgetAmount < 0) {
        toast.error("Budget must be a positive number");
        return;
      }

      const { category: updatedCategory } = await updateCategoryBudget(
        id,
        budgetAmount
      );

      if (!updatedCategory) {
        throw new Error("Failed to update budget");
      }

      // Update categories with the returned data from the server
      setCategories(
        categories.map((cat) =>
          cat.id === id
            ? {
                ...cat,
                budget: updatedCategory.budget,
                spent: updatedCategory.spent,
              }
            : cat
        )
      );

      toast.success(
        `Budget updated for "${category.name}" to $${budgetAmount.toFixed(2)}`,
        {
          icon: "💰",
        }
      );
    } catch (error) {
      toast.error("Failed to update budget");
      console.error(error);
    }
  };

  const handleEditCategory = async (id, newName) => {
    if (newName.trim()) {
      try {
        const oldName = categories.find((cat) => cat.id === id)?.name;
        await updateCategoryName(id, newName.trim());
        setCategories(
          categories.map((cat) =>
            cat.id === id ? { ...cat, name: newName.trim() } : cat
          )
        );
        setEditingCategory(null);
        toast.success(
          `Category renamed from "${oldName}" to "${newName.trim()}"`,
          {
            icon: "✏️",
          }
        );
      } catch (error) {
        toast.error("Failed to update category name");
        console.error(error);
      }
    } else {
      toast.error("Category name cannot be empty", {
        icon: "❌",
      });
    }
  };

  const handleAddExpense = async () => {
    if (
      !newExpense.amount ||
      !newExpense.description ||
      !newExpense.categoryId
    ) {
      toast.error("Please fill in all fields", {
        icon: "❌",
      });
      return;
    }

    if (Number(newExpense.amount) <= 0) {
      toast.error("Amount must be greater than 0", {
        icon: "❌",
      });
      return;
    }

    try {
      const category = categories.find(
        (cat) => cat.id === newExpense.categoryId
      );

      if (!category) {
        toast.error("Category not found");
        return;
      }

      if (category.budget <= 0) {
        toast.error(
          "Please set a budget for this category before adding expenses"
        );
        return;
      }

      const { expense } = await addExpense(
        newExpense.amount,
        newExpense.description,
        newExpense.categoryId
      );

      console.log(expense)

      // Update local state
      setExpenses([
        {
          id: expense._id,
          categoryId: expense.category,
          amount: expense.amount,
          description: expense.description,
          date: expense.date,
        },
        ...expenses,
      ]);

      // Update category spent amount
      setCategories(
        categories.map((cat) =>
          cat.id === newExpense.categoryId
            ? {
                ...cat,
                spent: cat.spent + Number(newExpense.amount),
              }
            : cat
        )
      );

      // Reset form
      setNewExpense({
        amount: "",
        description: "",
        categoryId: "",
      });

      toast.success("Expense added successfully!", {
        icon: "✅",
      });
    } catch (error) {
      toast.error("Failed to add expense");
      console.error(error);
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    try {
      const expense = expenses.find((exp) => exp.id === expenseId);
      if (expense) {
        const category = categories.find(
          (cat) => cat.id === expense.categoryId
        );
        await deleteExpense(expenseId);

        // Update local state
        setExpenses(expenses.filter((exp) => exp.id !== expenseId));
        setCategories(
          categories.map((cat) =>
            cat.id === expense.categoryId
              ? { ...cat, spent: Math.max(0, cat.spent - expense.amount) }
              : cat
          )
        );

        toast.success(
          `Expense "$${expense.amount.toFixed(2)}" deleted from ${
            category.name
          }`,
          {
            icon: "🗑️",
          }
        );
      }
    } catch (error) {
      toast.error("Failed to delete expense");
      console.error(error);
    }
  };

  const handleViewCategoryExpenses = async (categoryId) => {
    try {
      setSelectedCategory(categoryId);
      const { expenses: categoryExpenses } = await getCategoryExpenses(
        categoryId
      );
      setExpenses(categoryExpenses);
    } catch (error) {
      toast.error("Failed to fetch category expenses");
      console.error(error);
    }
  };

  const getBudgetStatus = (spent, budget) => {
    if (budget === 0) return { percentage: 0, status: "neutral" };
    const percentage = (spent / budget) * 100;
    if (percentage >= 100) return { percentage, status: "exceeded" };
    if (percentage >= 80) return { percentage, status: "warning" };
    return { percentage, status: "good" };
  };

  const totalBudget = categories.reduce(
    (sum, cat) => sum + (Number(cat.budget) || 0),
    0
  );
  const totalSpent = categories.reduce(
    (sum, cat) => sum + (Number(cat.spent) || 0),
    0
  );
  const totalRemaining = totalBudget - totalSpent;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <div className="container mx-auto p-6 max-w-7xl">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "hsl(var(--background))",
              color: "hsl(var(--foreground))",
              border: "1px solid hsl(var(--border))",
            },
          }}
        />
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Budget Planning</h1>
          <p className="text-muted-foreground">
            Manage your categories, set budgets, and track expenses
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  ${isNaN(totalBudget) ? "0.00" : totalBudget.toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total Budget
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  ${isNaN(totalSpent) ? "0.00" : totalSpent.toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground">Total Spent</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div
                  className={`text-2xl font-bold ${
                    totalSpent > totalBudget ? "text-red-600" : "text-green-600"
                  }`}
                >
                  ${isNaN(totalRemaining) ? "0.00" : totalRemaining.toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground">Remaining</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Categories and Budget Management */}
          <div className="space-y-6">
            {/* Add New Category */}
            <Card>
              <CardHeader>
                <CardTitle>Add New Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Category Name
                    </label>
                    <Input
                      placeholder="Enter category name"
                      value={newCategory.name}
                      onChange={(e) =>
                        setNewCategory({ ...newCategory, name: e.target.value })
                      }
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleAddCategory()
                      }
                      className="flex-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Budget Amount ($)
                    </label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={newCategory.budget}
                      onChange={(e) =>
                        setNewCategory({
                          ...newCategory,
                          budget: e.target.value,
                        })
                      }
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleAddCategory()
                      }
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <Button
                    onClick={handleAddCategory}
                    className="w-full cursor-pointer"
                    disabled={!newCategory.name.trim() || !newCategory.budget}
                  >
                    Add Category
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Categories List */}
            <Card>
              <CardHeader>
                <CardTitle>Budget Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {categories.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No categories added yet
                  </p>
                ) : (
                  categories.map((category) => {
                    const { percentage, status } = getBudgetStatus(
                      category.spent,
                      category.budget
                    );
                    return (
                      <div
                        key={category.id}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex-1">
                            {editingCategory === category.id ? (
                              <Input
                                defaultValue={category.name}
                                onBlur={(e) =>
                                  handleEditCategory(
                                    category.id,
                                    e.target.value
                                  )
                                }
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    handleEditCategory(
                                      category.id,
                                      e.target.value
                                    );
                                  } else if (e.key === "Escape") {
                                    setEditingCategory(null);
                                  }
                                }}
                                autoFocus
                                className="text-lg font-semibold"
                              />
                            ) : (
                              <div className="flex items-center gap-2">
                                <h3 className="text-lg font-semibold">
                                  {category.name}
                                </h3>
                                {status === "exceeded" && (
                                  <Badge variant="destructive">
                                    Over Budget
                                  </Badge>
                                )}
                                {status === "warning" && (
                                  <Badge variant="secondary">Near Limit</Badge>
                                )}
                              </div>
                            )}
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="cursor-pointer"
                              >
                                ⋮
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem
                                onClick={() => setEditingCategory(category.id)}
                                className="cursor-pointer"
                              >
                                Edit Name
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleViewCategoryExpenses(category.id)
                                }
                                className="cursor-pointer"
                              >
                                View Expenses
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600 cursor-pointer"
                                onClick={() =>
                                  handleDeleteCategory(category.id)
                                }
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>
                              Spent: ${(category.spent || 0).toFixed(2)}
                            </span>
                            <span>
                              Budget: ${(category.budget || 0).toFixed(2)}
                            </span>
                          </div>
                          <Progress
                            value={Math.min(percentage, 100)}
                            className={`h-2 ${
                              status === "exceeded"
                                ? "bg-red-100 dark:bg-red-900"
                                : status === "warning"
                                ? "bg-yellow-100 dark:bg-yellow-900"
                                : "bg-green-100 dark:bg-green-900"
                            }`}
                          />
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                              Budget:
                            </span>
                            <Input
                              type="number"
                              value={
                                editingBudgets[category.id] !== undefined
                                  ? editingBudgets[category.id]
                                  : category.budget ?? ""
                              }
                              onChange={(e) => {
                                const value = e.target.value;
                                setEditingBudgets((prev) => ({
                                  ...prev,
                                  [category.id]: value,
                                }));
                              }}
                              className="w-32 h-8"
                              min="0"
                              step="0.01"
                            />
                            {editingBudgets[category.id] !== undefined &&
                              Number(editingBudgets[category.id]) !==
                                Number(category.budget) && (
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    handleUpdateBudget(
                                      category.id,
                                      editingBudgets[category.id]
                                    );
                                    setEditingBudgets((prev) => ({
                                      ...prev,
                                      [category.id]: undefined,
                                    }));
                                  }}
                                  className="ml-2"
                                >
                                  Save
                                </Button>
                              )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Expense Management */}
          <div className="space-y-6">
            {/* Add New Expense */}
            <Card>
              <CardHeader>
                <CardTitle>Add New Expense</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Amount ($)
                    </label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={newExpense.amount}
                      onChange={(e) =>
                        setNewExpense({ ...newExpense, amount: e.target.value })
                      }
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Category
                    </label>
                    <Select
                      value={newExpense.categoryId}
                      onValueChange={(value) =>
                        setNewExpense({ ...newExpense, categoryId: value })
                      }
                    >
                      <SelectTrigger className="cursor-pointer">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem
                            key={cat.id}
                            value={cat.id}
                            className="cursor-pointer"
                          >
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Description
                  </label>
                  <Textarea
                    placeholder="What was this expense for?"
                    value={newExpense.description}
                    onChange={(e) =>
                      setNewExpense({
                        ...newExpense,
                        description: e.target.value,
                      })
                    }
                    rows={3}
                  />
                </div>
                <Button
                  onClick={handleAddExpense}
                  className="w-full cursor-pointer"
                  disabled={
                    !newExpense.amount ||
                    !newExpense.description ||
                    !newExpense.categoryId
                  }
                >
                  Add Expense
                </Button>
              </CardContent>
            </Card>

            {/* Recent Expenses */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {selectedCategory
                    ? `${categories.find((c) => c.id === selectedCategory)?.name} Expenses`
                    : "Recent Expenses"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {expenses.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">
                      No expenses added yet
                    </p>
                  ) : (
                    expenses.map((expense) => (
                      <div
                        key={expense.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="flex-1">
                          <div className="font-medium">
                            {expense.description}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {expense.categoryName} •
                             {/* {expense.date} */}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">
                            ${expense.amount.toFixed(2)}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteExpense(expense.id)}
                            className="text-red-600 hover:text-red-700 cursor-pointer"
                          >
                            ×
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default BudgetPage;
