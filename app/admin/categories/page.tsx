"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { CategoryList } from "@/components/category-list";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, Loader2, FolderPlus } from "lucide-react";
import { useSession } from "@/lib/session";
import { useRouter } from "next/navigation";

interface Product {
  id: string;
  name: string;
  description: string;
  categoryId: string;
}

interface Category {
  id: string;
  name: string;
}

// Initial categories data
const initialCategories: Category[] = [
  { id: "1", name: "Cakes" },
  { id: "2", name: "Cupcakes" },
  { id: "3", name: "Cookies" },
  { id: "4", name: "Pastries" },
];

export default function CategoriesPage() {
  const session = useSession();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categoryName, setCategoryName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (session === null) {
      router.push("/login");
    }
  }, [session, router]);

  useEffect(() => {
    // Load categories from localStorage
    const storedCategories = localStorage.getItem("categories");
    if (storedCategories) {
      setCategories(JSON.parse(storedCategories));
    } else {
      setCategories(initialCategories);
      localStorage.setItem("categories", JSON.stringify(initialCategories));
    }

    // Load products to track relationships
    const storedProducts = localStorage.getItem("products");
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    }
  }, []);

  if (session === null) {
    return <div>Redirecting...</div>;
  }

  const showMessage = (message: string, isError = false) => {
    if (isError) {
      setError(message);
      setSuccess("");
    } else {
      setSuccess(message);
      setError("");
    }
    setTimeout(() => {
      setError("");
      setSuccess("");
    }, 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    if (!categoryName.trim()) {
      setError("Please enter a category name");
      setIsLoading(false);
      return;
    }

    // Check for duplicate category names
    if (
      categories.some(
        (cat) => cat.name.toLowerCase() === categoryName.trim().toLowerCase()
      )
    ) {
      setError("A category with this name already exists");
      setIsLoading(false);
      return;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 300));

      const newCategory: Category = {
        id: Date.now().toString(),
        name: categoryName.trim(),
      };

      const updatedCategories = [...categories, newCategory];
      setCategories(updatedCategories);
      localStorage.setItem("categories", JSON.stringify(updatedCategories));

      setCategoryName("");
      showMessage("Category added successfully!");
    } catch (err) {
      showMessage("Failed to add category. Please try again.", true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async (
    id: string,
    updatedCategory: Omit<Category, "id">
  ) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));

      const updatedCategories = categories.map((category) =>
        category.id === id ? { ...category, ...updatedCategory } : category
      );
      setCategories(updatedCategories);
      localStorage.setItem("categories", JSON.stringify(updatedCategories));
      showMessage("Category updated successfully!");
    } catch (err) {
      showMessage("Failed to update category. Please try again.", true);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Remove category and all associated products
      const updatedCategories = categories.filter(
        (category) => category.id !== id
      );
      const updatedProducts = products.filter(
        (product) => product.categoryId !== id
      );

      setCategories(updatedCategories);
      setProducts(updatedProducts);
      localStorage.setItem("categories", JSON.stringify(updatedCategories));
      localStorage.setItem("products", JSON.stringify(updatedProducts));

      const deletedProductsCount = products.filter(
        (p) => p.categoryId === id
      ).length;
      if (deletedProductsCount > 0) {
        showMessage(
          `Category and ${deletedProductsCount} associated product(s) deleted successfully!`
        );
      } else {
        showMessage("Category deleted successfully!");
      }
    } catch (err) {
      showMessage("Failed to delete category. Please try again.", true);
    }
  };

  const getProductCountForCategory = (categoryId: string): number => {
    return products.filter((product) => product.categoryId === categoryId)
      .length;
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">
          Category Management
        </h2>
        <p className="text-gray-600 mt-1">
          Create and manage product categories
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FolderPlus className="w-5 h-5" />
            <span>Add New Category</span>
          </CardTitle>
          <CardDescription>
            Create categories to organize your products
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="border-green-200 bg-green-50">
                <AlertDescription className="text-green-800">
                  {success}
                </AlertDescription>
              </Alert>
            )}

            <div className="flex space-x-4">
              <div className="flex-1">
                <Label htmlFor="categoryName">Category Name</Label>
                <Input
                  id="categoryName"
                  type="text"
                  placeholder="e.g., Cakes, Cupcakes, Cookies"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="flex items-end">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Category
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          All Categories ({categories.length})
        </h3>
        <CategoryList
          categories={categories}
          getProductCountForCategory={getProductCountForCategory}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
