"use server";

import { revalidatePath } from "next/cache";
import { connectToDB } from "@/lib/mongoose";
import Category from "@/models/Category";
import Expense from "@/models/Expense";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Helper function to convert Mongoose document to plain object
function toPlainObject(doc) {
  if (!doc) return null;
  if (doc.toObject) {
    const obj = doc.toObject();
    // Convert ObjectId to string
    if (obj._id) {
      obj._id = obj._id.toString();
    }
    if (obj.user) {
      obj.user = obj.user.toString();
    }
    if (obj.category) {
      obj.category = obj.category.toString();
    }
    // Ensure budget is a number
    if (obj.budget !== undefined) {
      obj.budget = Number(obj.budget);
    }
    // Ensure spent is a number
    if (obj.spent !== undefined) {
      obj.spent = Number(obj.spent);
    }
    return obj;
  }
  return doc;
}

// Get all categories with their budgets and expenses
export async function getCategories() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      throw new Error("Not authenticated");
    }

    await connectToDB();
    const categories = await Category.find({ user: session.user.id });

    // Get total spent for each category
    const categoriesWithSpent = await Promise.all(
      categories.map(async (category) => {
        const expenses = await Expense.find({ category: category._id });
        const spent = expenses.reduce((sum, exp) => sum + exp.amount, 0);

        // Update category spent amount
        if (category.spent !== spent) {
          category.spent = spent;
          await category.save();
        }

        return {
          id: category._id.toString(),
          name: category.name,
          budget: category.budget,
          spent: category.spent,
          color: category.color,
        };
      })
    );

    return { categories: categoriesWithSpent };
  } catch (error) {
    console.error("Error in getCategories:", error);
    throw new Error("Failed to fetch categories");
  }
}

// Add new category
export async function addCategory(name, color, budget) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      throw new Error("Not authenticated");
    }

    await connectToDB();
    
    // Ensure budget is a valid number
    const budgetAmount = Number(budget);
    if (isNaN(budgetAmount) || budgetAmount < 0) {
      throw new Error("Invalid budget amount");
    }

    // Create the category with explicit budget
    const category = new Category({
      name,
      color,
      user: session.user.id,
      budget: budgetAmount,
      spent: 0,
    });

    // Save the category
    await category.save();
    
    console.log("Created category:", category.toObject());

    // Convert to plain object before returning
    const plainCategory = toPlainObject(category);

    revalidatePath("/budget");
    return {
      success: true,
      category: {
        _id: plainCategory._id,
        name: plainCategory.name,
        color: plainCategory.color,
        budget: plainCategory.budget,
        spent: plainCategory.spent,
        user: plainCategory.user,
        createdAt: plainCategory.createdAt,
      },
    };
  } catch (error) {
    console.error("Error in addCategory:", error);
    throw new Error("Failed to add category");
  }
}

// Update category budget
export async function updateCategoryBudget(categoryId, budget) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      throw new Error("Not authenticated");
    }

    await connectToDB();
    console.log(categoryId, budget);
    const category = await Category.findOneAndUpdate(
      { _id: categoryId, user: session.user.id },
      { budget: Number(budget) },
      { new: true }
    );

    if (!category) {
      throw new Error("Category not found");
    }

    // Convert to plain object before returning
    const plainCategory = toPlainObject(category);

    revalidatePath("/budget");
    return {
      success: true,
      category: {
        _id: plainCategory._id,
        name: plainCategory.name,
        color: plainCategory.color,
        budget: plainCategory.budget,
        spent: plainCategory.spent,
        user: plainCategory.user,
        createdAt: plainCategory.createdAt,
      },
    };
  } catch (error) {
    console.error("Error in updateCategoryBudget:", error);
    throw new Error("Failed to update budget");
  }
}

// Update category name
export async function updateCategoryName(categoryId, name) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      throw new Error("Not authenticated");
    }

    await connectToDB();
    const category = await Category.findOneAndUpdate(
      { _id: categoryId, user: session.user.id },
      { name },
      { new: true }
    );

    if (!category) {
      throw new Error("Category not found");
    }

    // Convert to plain object before returning
    const plainCategory = toPlainObject(category);

    revalidatePath("/budget");
    return {
      success: true,
      category: {
        _id: plainCategory._id,
        name: plainCategory.name,
        color: plainCategory.color,
        budget: plainCategory.budget,
        spent: plainCategory.spent,
        user: plainCategory.user,
        createdAt: plainCategory.createdAt,
      },
    };
  } catch (error) {
    console.error("Error in updateCategoryName:", error);
    throw new Error("Failed to update category name");
  }
}

// Delete category
export async function deleteCategory(categoryId) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      throw new Error("Not authenticated");
    }

    await connectToDB();

    // Delete all expenses in this category
    await Expense.deleteMany({ category: categoryId });

    // Delete the category
    const category = await Category.findOneAndDelete({
      _id: categoryId,
      user: session.user.id,
    });

    if (!category) {
      throw new Error("Category not found");
    }

    revalidatePath("/budget");
    return { success: true };
  } catch (error) {
    console.error("Error in deleteCategory:", error);
    throw new Error("Failed to delete category");
  }
}

// Add new expense
export async function addExpense(amount, description, categoryId) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      throw new Error("Not authenticated");
    }

    await connectToDB();

    // Check if category exists and has a budget set
    const category = await Category.findById(categoryId);
    if (!category) {
      throw new Error("Category not found");
    }

    if (category.budget <= 0) {
      return {
        success: false,
        error: "Please set a budget for this category before adding expenses",
      };
    }

    // Create the expense
    const expense = await Expense.create({
      amount: Number(amount),
      description,
      category: categoryId,
      user: session.user.id,
    });

    // Update category spent amount
    category.spent += Number(amount);
    await category.save();

    // Convert to plain object before returning
    const plainExpense = toPlainObject(expense);

    revalidatePath("/budget");
    return {
      success: true,
      expense: {
        _id: plainExpense._id,
        amount: plainExpense.amount,
        description: plainExpense.description,
        category: plainExpense.category.toString(),
        user: plainExpense.user,
        date: plainExpense.date,
      },
    };
  } catch (error) {
    console.error("Error in addExpense:", error);
    throw new Error("Failed to add expense");
  }
}

// Delete expense
export async function deleteExpense(expenseId) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      throw new Error("Not authenticated");
    }

    await connectToDB();

    // Get the expense to know its amount and category
    const expense = await Expense.findOne({
      _id: expenseId,
      user: session.user.id,
    });

    if (!expense) {
      throw new Error("Expense not found");
    }

    // Update category spent amount
    const category = await Category.findById(expense.category);
    if (category) {
      category.spent = Math.max(0, category.spent - expense.amount);
      await category.save();
    }

    // Delete the expense
    await Expense.deleteOne({ _id: expenseId });

    revalidatePath("/budget");
    return { success: true };
  } catch (error) {
    console.error("Error in deleteExpense:", error);
    throw new Error("Failed to delete expense");
  }
}

// Get expenses for a category
export async function getCategoryExpenses(categoryId) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      throw new Error("Not authenticated");
    }

    await connectToDB();
    const expenses = await Expense.find({
      category: categoryId,
      user: session.user.id,
    }).sort({ date: -1 });

    return {
      expenses: expenses.map((exp) => ({
        id: exp._id.toString(),
        amount: exp.amount,
        description: exp.description,
        date: exp.date.toISOString().split("T")[0],
        categoryId: exp.category.toString(),
      })),
    };
  } catch (error) {
    console.error("Error in getCategoryExpenses:", error);
    throw new Error("Failed to fetch expenses");
  }
}

// Get all expenses for a user
export async function getAllExpenses() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      throw new Error("Not authenticated");
    }

    await connectToDB();
    const expenses = await Expense.find({ user: session.user.id })
      .sort({ date: -1 })
      .populate('category', 'name');

    return {
      expenses: expenses.map((exp) => ({
        id: exp._id.toString(),
        amount: exp.amount,
        description: exp.description,
        date: exp.date.toISOString().split('T')[0],
        categoryId: exp.category._id.toString(),
        categoryName: exp.category.name,
      })),
    };
  } catch (error) {
    console.error("Error in getAllExpenses:", error);
    throw new Error("Failed to fetch expenses");
  }
}
