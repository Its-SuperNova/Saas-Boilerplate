"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Edit, Trash2, Check, X, Package } from "lucide-react"
import { useState } from "react"

interface Category {
  id: string
  name: string
}

interface CategoryCardProps {
  category: Category
  productCount: number
  onEdit: (id: string, updatedCategory: Omit<Category, "id">) => void
  onDelete: (id: string) => void
}

export function CategoryCard({ category, productCount, onEdit, onDelete }: CategoryCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(category.name)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleSaveEdit = () => {
    if (editName.trim()) {
      onEdit(category.id, { name: editName.trim() })
      setIsEditing(false)
    }
  }

  const handleCancelEdit = () => {
    setEditName(category.name)
    setIsEditing(false)
  }

  const handleDelete = () => {
    onDelete(category.id)
    setShowDeleteConfirm(false)
  }

  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        {isEditing ? (
          <Input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            className="text-lg font-semibold"
            placeholder="Category name"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSaveEdit()
              if (e.key === "Escape") handleCancelEdit()
            }}
            autoFocus
          />
        ) : (
          <CardTitle className="text-lg flex items-center space-x-2">
            <Package className="w-5 h-5 text-blue-600" />
            <span>{category.name}</span>
          </CardTitle>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-gray-600">
          <span className="font-medium">{productCount}</span> product{productCount !== 1 ? "s" : ""}
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          {isEditing ? (
            <div className="flex space-x-2">
              <Button size="sm" onClick={handleSaveEdit} className="flex items-center space-x-1">
                <Check className="w-4 h-4" />
                <span>Save</span>
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancelEdit} className="flex items-center space-x-1">
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </Button>
            </div>
          ) : (
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-1"
              >
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </Button>
              {showDeleteConfirm ? (
                <div className="flex space-x-1">
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={handleDelete}
                    className="flex items-center space-x-1"
                  >
                    <Check className="w-4 h-4" />
                    <span>Confirm</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex items-center space-x-1"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </Button>
                </div>
              ) : (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center space-x-1"
                  disabled={productCount > 0}
                  title={
                    productCount > 0 ? `Cannot delete category with ${productCount} product(s)` : "Delete category"
                  }
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </Button>
              )}
            </div>
          )}
        </div>

        {productCount > 0 && showDeleteConfirm && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 text-sm">
            <p className="text-yellow-800 font-medium">⚠️ Warning</p>
            <p className="text-yellow-700 mt-1">
              This category has {productCount} product{productCount !== 1 ? "s" : ""}. Deleting it will also remove all
              associated products.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
