"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { ProductList } from "@/components/product-list";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, Loader2, Package } from "lucide-react";
import { useSession } from "@/lib/session";
import { useRouter } from "next/navigation";

interface Product {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  categoryName?: string;
}

interface Category {
  id: string;
  name: string;
}

export default function ProductsPage() {
  const session = useSession();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
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
    }

    // Load products from localStorage
    const storedProducts = localStorage.getItem("products");
    if (storedProducts) {
      const loadedProducts = JSON.parse(storedProducts);
      // Ensure products have categoryId, assign default if missing
      const updatedProducts = loadedProducts.map((product: any) => ({
        ...product,
        categoryId: product.categoryId || "1", // Default to first category
      }));
      setProducts(updatedProducts);
    }
  }, []);

  if (session === null) {
    return <div>Redirecting...</div>;
  }

  // Update products with category names for display
  const productsWithCategoryNames = products.map((product) => ({
    ...product,
    categoryName:
      categories.find((cat) => cat.id === product.categoryId)?.name ||
      "Uncategorized",
  }));

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

    if (
      !productName.trim() ||
      !productDescription.trim() ||
      !selectedCategoryId
    ) {
      setError("Please fill in all fields and select a category");
      setIsLoading(false);
      return;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const newProduct: Product = {
        id: Date.now().toString(),
        name: productName.trim(),
        description: productDescription.trim(),
        categoryId: selectedCategoryId,
      };

      const updatedProducts = [...products, newProduct];
      setProducts(updatedProducts);
      localStorage.setItem("products", JSON.stringify(updatedProducts));

      setProductName("");
      setProductDescription("");
      setSelectedCategoryId("");
      showMessage("Product added successfully!");
    } catch (err) {
      showMessage("Failed to add product. Please try again.", true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async (
    id: string,
    updatedProduct: Omit<Product, "id">
  ) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));

      const updatedProducts = products.map((product) =>
        product.id === id ? { ...product, ...updatedProduct } : product
      );
      setProducts(updatedProducts);
      localStorage.setItem("products", JSON.stringify(updatedProducts));
      showMessage("Product updated successfully!");
    } catch (err) {
      showMessage("Failed to update product. Please try again.", true);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));

      const updatedProducts = products.filter((product) => product.id !== id);
      setProducts(updatedProducts);
      localStorage.setItem("products", JSON.stringify(updatedProducts));
      showMessage("Product deleted successfully!");
    } catch (err) {
      showMessage("Failed to delete product. Please try again.", true);
    }
  };

  const hasCategories = categories.length > 0;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">
          Product Management
        </h2>
        <p className="text-gray-600 mt-1">Create and manage your products</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Add New Product</span>
          </CardTitle>
          <CardDescription>
            {hasCategories
              ? "Create a new product and assign it to a category"
              : "Please add a category before creating products"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!hasCategories ? (
            <Alert>
              <Package className="h-4 w-4" />
              <AlertDescription>
                Please add a category before creating products. Products must
                belong to a category.{" "}
                <a
                  href="/admin/categories"
                  className="underline text-blue-600 hover:text-blue-800"
                >
                  Go to Categories
                </a>
              </AlertDescription>
            </Alert>
          ) : (
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="productName">Product Name</Label>
                  <Input
                    id="productName"
                    type="text"
                    placeholder="Enter product name"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={selectedCategoryId}
                    onValueChange={setSelectedCategoryId}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="productDescription">Product Description</Label>
                <Textarea
                  id="productDescription"
                  placeholder="Enter product description"
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                  required
                  disabled={isLoading}
                  rows={3}
                />
              </div>

              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding Product...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Product
                  </>
                )}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          All Products ({products.length})
        </h3>
        <ProductList
          products={productsWithCategoryNames}
          isAdmin={true}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
