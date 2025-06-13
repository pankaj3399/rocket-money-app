"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "next-themes";
import { Moon, Sun, Plus, Trash2 } from "lucide-react";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [settings, setSettings] = useState({
    theme: "light",
  });
  const [name, setName] = useState(session?.user?.name || "");
  const [isEditingName, setIsEditingName] = useState(false);
  const [isSavingName, setIsSavingName] = useState(false);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({
    name: "",
    color: "#000000",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (status === "authenticated") {
      fetchSettings();
      fetchCategories();
      setName(session?.user?.name || "");
    }
  }, [status, session]);

  const fetchSettings = async () => {
    try {
      setIsInitialLoading(true);
      const response = await fetch("/api/user/settings");
      if (!response.ok) {
        throw new Error("Failed to fetch settings");
      }
      const data = await response.json();
      setSettings(data.settings);
      setName(data.name || "");
    } catch (error) {
      setError("Failed to load settings");
      console.error("Error fetching settings:", error);
    } finally {
      setIsInitialLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      setError("Failed to load categories");
      console.error("Error fetching categories:", error);
    }
  };

  const addCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.name.trim()) {
      setError("Category name is required");
      return;
    }

    setIsLoading(true);
    setError("");
    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCategory),
      });
      if (!response.ok) {
        throw new Error("Failed to add category");
      }
      const data = await response.json();
      setCategories([...categories, data]);
      setNewCategory({ name: "", color: "#000000" });
      setShowAddCategory(false);
    } catch (error) {
      setError("Failed to add category");
      console.error("Error adding category:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeCategory = async (id) => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to remove category");
      }
      setCategories(categories.filter((category) => category._id !== id));
    } catch (error) {
      setError("Failed to remove category");
      console.error("Error removing category:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNameSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    setIsSavingName(true);
    setError("");
    try {
      const response = await fetch("/api/user/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!response.ok) {
        throw new Error("Failed to update name");
      }
      setIsEditingName(false);
      router.refresh && router.refresh();
    } catch (error) {
      setError("Failed to update name");
      console.error("Error updating name:", error);
    } finally {
      setIsSavingName(false);
    }
  };

  if (status === "loading" || isInitialLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-inherit">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Settings
        </h1>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {/* Profile Information */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
            Profile Information
          </h2>
          <form onSubmit={handleNameSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Name
              </label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSavingName}
                className="max-w-xs"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <Input
                type="email"
                value={session?.user?.email || ""}
                disabled
                className="max-w-xs"
              />
            </div>
            <Button type="submit" disabled={isSavingName || !name.trim()}>
              {isSavingName ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </Card>

        {/* Theme Settings */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
            Display Settings
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">
                Theme
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Choose your preferred theme
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="flex items-center gap-2"
            >
              {theme === "dark" ? (
                <>
                  <Sun className="h-4 w-4" />
                  Light Mode
                </>
              ) : (
                <>
                  <Moon className="h-4 w-4" />
                  Dark Mode
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Category Management */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Categories
            </h2>
            <Button
              onClick={() => setShowAddCategory(!showAddCategory)}
              className="flex items-center gap-2"
              variant={showAddCategory ? "secondary" : "default"}
            >
              <Plus className="h-4 w-4" />
              {showAddCategory ? "Cancel" : "Add Category"}
            </Button>
          </div>

          {/* Add Category Form */}
          {showAddCategory && (
            <form
              onSubmit={addCategory}
              className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border"
            >
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category Name
                  </label>
                  <Input
                    type="text"
                    value={newCategory.name}
                    onChange={(e) =>
                      setNewCategory({ ...newCategory, name: e.target.value })
                    }
                    placeholder="Enter category name"
                    disabled={isLoading}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Color
                  </label>
                  <input
                    type="color"
                    value={newCategory.color}
                    onChange={(e) =>
                      setNewCategory({ ...newCategory, color: e.target.value })
                    }
                    className="w-12 h-10 rounded border border-gray-300 dark:border-gray-600"
                    disabled={isLoading}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isLoading || !newCategory.name.trim()}
                >
                  {isLoading ? "Adding..." : "Add"}
                </Button>
              </div>
            </form>
          )}

          {/* Categories List */}
          <div className="space-y-4">
            {categories.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                No categories yet. Add your first category above.
              </p>
            ) : (
              categories.map((category) => (
                <div
                  key={category._id}
                  className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="font-medium text-gray-900 dark:text-white">
                      {category.name}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-600"
                    onClick={() => removeCategory(category._id)}
                    disabled={isLoading}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
