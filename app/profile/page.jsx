"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [settings, setSettings] = useState({
    theme: "light"
  });
  const [name, setName] = useState(session?.user?.name || "");
  const [isEditingName, setIsEditingName] = useState(false);
  const [isSavingName, setIsSavingName] = useState(false);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: "", color: "#000000" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isInitialLoading, setIsInitialLoading] = useState(true);

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
    if (!newCategory.name.trim()) return;

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
      setCategories(categories.filter(category => category._id !== id));
    } catch (error) {
      setError("Failed to remove category");
      console.error("Error removing category:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNameSave = async (e) => {
    e.preventDefault();
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
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-8">Profile Settings</h1>

      {/* Edit Name Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Edit Name</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleNameSave} className="flex items-center space-x-4">
            <Input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              disabled={isSavingName}
              className="max-w-xs"
            />
            <Button type="submit" disabled={isSavingName || !name.trim()}>
              {isSavingName ? "Saving..." : "Save"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="grid gap-6">
        {/* Theme Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Theme Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground">Choose your preferred theme</p>
              <ThemeToggle />
            </div>
          </CardContent>
        </Card>

        {/* Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Categories</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Add Category Form */}
            <form onSubmit={addCategory} className="mb-6">
              <div className="flex space-x-4">
                <Input
                  type="text"
                  placeholder="Category name"
                  value={newCategory.name}
                  onChange={(e) =>
                    setNewCategory({ ...newCategory, name: e.target.value })
                  }
                  className="flex-1"
                  disabled={isLoading}
                />
                <Input
                  type="color"
                  value={newCategory.color}
                  onChange={(e) =>
                    setNewCategory({ ...newCategory, color: e.target.value })
                  }
                  className="w-20"
                  disabled={isLoading}
                />
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Adding..." : "Add"}
                </Button>
              </div>
            </form>

            {/* Categories List */}
            <div className="space-y-4">
              {categories.map((category) => (
                <div
                  key={category._id}
                  className="flex items-center justify-between p-4 bg-muted rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-foreground">{category.name}</span>
                  </div>
                  <Button
                    onClick={() => removeCategory(category._id)}
                    variant="ghost"
                    className="text-destructive hover:text-destructive/90"
                    disabled={isLoading}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              {categories.length === 0 && (
                <p className="text-muted-foreground text-center py-4">
                  No categories added yet. Add your first category above.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 