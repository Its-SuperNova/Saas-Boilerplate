"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, FolderOpen, TrendingUp } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface Product {
  id: string
  name: string
  description: string
  categoryId: string
}

interface Category {
  id: string
  name: string
}

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    // Load data from localStorage
    const storedProducts = localStorage.getItem("products")
    const storedCategories = localStorage.getItem("categories")

    if (storedProducts) {
      setProducts(JSON.parse(storedProducts))
    }

    if (storedCategories) {
      setCategories(JSON.parse(storedCategories))
    }
  }, [])

  const getProductCountForCategory = (categoryId: string): number => {
    return products.filter((product) => product.categoryId === categoryId).length
  }

  const stats = [
    {
      title: "Total Products",
      value: products.length,
      icon: Package,
      description: "Active products in store",
      href: "/admin/products",
    },
    {
      title: "Categories",
      value: categories.length,
      icon: FolderOpen,
      description: "Product categories",
      href: "/admin/categories",
    },
    {
      title: "Most Popular Category",
      value:
        categories.length > 0
          ? categories.reduce((prev, current) =>
              getProductCountForCategory(prev.id) > getProductCountForCategory(current.id) ? prev : current,
            ).name
          : "None",
      icon: TrendingUp,
      description: "Category with most products",
      href: "/admin/categories",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Overview</h2>
        <p className="text-gray-600 mt-1">Quick stats and navigation to manage your store</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                <Link href={stat.href} className="mt-3 inline-block">
                  <Button variant="outline" size="sm">
                    Manage
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Categories</CardTitle>
            <CardDescription>Your latest product categories</CardDescription>
          </CardHeader>
          <CardContent>
            {categories.length === 0 ? (
              <div className="text-center py-6">
                <FolderOpen className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No categories</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating a new category.</p>
                <div className="mt-6">
                  <Link href="/admin/categories">
                    <Button size="sm">Add Category</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {categories.slice(0, 5).map((category) => (
                  <div key={category.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{category.name}</p>
                      <p className="text-sm text-gray-500">
                        {getProductCountForCategory(category.id)} product
                        {getProductCountForCategory(category.id) !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                ))}
                {categories.length > 5 && (
                  <Link href="/admin/categories">
                    <Button variant="outline" size="sm" className="w-full mt-4">
                      View All Categories
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Products</CardTitle>
            <CardDescription>Your latest products</CardDescription>
          </CardHeader>
          <CardContent>
            {products.length === 0 ? (
              <div className="text-center py-6">
                <Package className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No products</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating a new product.</p>
                <div className="mt-6">
                  <Link href="/admin/products">
                    <Button size="sm">Add Product</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {products.slice(0, 5).map((product) => {
                  const category = categories.find((cat) => cat.id === product.categoryId)
                  return (
                    <div key={product.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-500">{category?.name || "Uncategorized"}</p>
                      </div>
                    </div>
                  )
                })}
                {products.length > 5 && (
                  <Link href="/admin/products">
                    <Button variant="outline" size="sm" className="w-full mt-4">
                      View All Products
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
