"use client"

import { useState, useEffect } from "react"
import { ProductList } from "@/components/product-list"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Product {
  id: string
  name: string
  description: string
  categoryId: string
  categoryName?: string
}

interface Category {
  id: string
  name: string
}

// Mock data - in a real app, this would come from an API or database
const initialProducts: Product[] = [
  {
    id: "1",
    name: "Chocolate Cake",
    description: "Rich and moist chocolate cake with chocolate frosting.",
    categoryId: "1",
  },
  {
    id: "2",
    name: "Vanilla Cupcakes",
    description: "Light and fluffy vanilla cupcakes with buttercream frosting.",
    categoryId: "2",
  },
  {
    id: "3",
    name: "Chocolate Chip Cookies",
    description: "Classic chocolate chip cookies, crispy on the outside and chewy on the inside.",
    categoryId: "3",
  },
  {
    id: "4",
    name: "Croissant",
    description: "Buttery, flaky French pastry perfect for breakfast.",
    categoryId: "4",
  },
  {
    id: "5",
    name: "Danish",
    description: "Sweet pastry with fruit filling and glaze.",
    categoryId: "4",
  },
  {
    id: "6",
    name: "Eclair",
    description: "Choux pastry filled with cream and topped with chocolate.",
    categoryId: "4",
  },
]

const initialCategories = [
  { id: "1", name: "Cakes" },
  { id: "2", name: "Cupcakes" },
  { id: "3", name: "Cookies" },
  { id: "4", name: "Pastries" },
]

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading products from an API
    const loadProducts = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Check for products in localStorage (added by admin)
      const storedProducts = localStorage.getItem("products")
      const storedCategories = localStorage.getItem("categories")

      if (storedProducts && storedCategories) {
        const loadedProducts = JSON.parse(storedProducts)
        const loadedCategories = JSON.parse(storedCategories)

        // Map category names to products
        const productsWithCategories = loadedProducts.map((product: any) => ({
          ...product,
          categoryName: loadedCategories.find((cat: any) => cat.id === product.categoryId)?.name || "Uncategorized",
        }))

        setProducts(productsWithCategories)
        setCategories(loadedCategories)
      } else {
        // Use initial data and set up localStorage
        const productsWithCategories = initialProducts.map((product) => ({
          ...product,
          categoryName: initialCategories.find((cat) => cat.id === product.categoryId)?.name || "Uncategorized",
        }))

        setProducts(productsWithCategories)
        setCategories(initialCategories)
        localStorage.setItem("products", JSON.stringify(initialProducts))
        localStorage.setItem("categories", JSON.stringify(initialCategories))
      }
      setIsLoading(false)
    }

    loadProducts()
  }, [])

  const filteredProducts = selectedCategoryId
    ? products.filter((product) => product.categoryId === selectedCategoryId)
    : products

  const getProductCountForCategory = (categoryId: string): number => {
    return products.filter((product) => product.categoryId === categoryId).length
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Our Products</h1>
          <p className="text-gray-600">Discover our amazing collection</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg border p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Our Products</h1>
        <p className="text-gray-600">Discover our amazing collection</p>
      </div>

      {/* Category Filter */}
      {categories.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm font-medium text-gray-700 mr-2">Filter by category:</span>
              <Button
                variant={selectedCategoryId === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategoryId(null)}
                className="flex items-center space-x-1"
              >
                <span>All</span>
                <Badge variant="secondary" className="ml-1">
                  {products.length}
                </Badge>
              </Button>
              {categories.map((category) => {
                const productCount = getProductCountForCategory(category.id)
                return (
                  <Button
                    key={category.id}
                    variant={selectedCategoryId === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategoryId(category.id)}
                    className="flex items-center space-x-1"
                  >
                    <span>{category.name}</span>
                    <Badge variant="secondary" className="ml-1">
                      {productCount}
                    </Badge>
                  </Button>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Products Display */}
      <div>
        {selectedCategoryId && (
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {categories.find((cat) => cat.id === selectedCategoryId)?.name} ({filteredProducts.length})
            </h2>
          </div>
        )}
        <ProductList products={filteredProducts} />
      </div>
    </div>
  )
}
