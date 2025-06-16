"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Edit, Trash2, Check, X } from "lucide-react"
import { useState } from "react"

interface Product {
  id: string
  name: string
  description: string
  categoryId: string
  categoryName?: string // For display purposes
}

interface ProductCardProps {
  product: Product
  isAdmin?: boolean
  onEdit?: (id: string, updatedProduct: Omit<Product, "id">) => void
  onDelete?: (id: string) => void
}

export function ProductCard({ product, isAdmin = false, onEdit, onDelete }: ProductCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(product.name)
  const [editDescription, setEditDescription] = useState(product.description)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleSaveEdit = () => {
    if (editName.trim() && editDescription.trim() && onEdit) {
      onEdit(product.id, {
        name: editName.trim(),
        description: editDescription.trim(),
      })
      setIsEditing(false)
    }
  }

  const handleCancelEdit = () => {
    setEditName(product.name)
    setEditDescription(product.description)
    setIsEditing(false)
  }

  const handleDelete = () => {
    if (onDelete) {
      onDelete(product.id)
      setShowDeleteConfirm(false)
    }
  }

  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        {isEditing ? (
          <Input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            className="text-lg font-semibold"
            placeholder="Product name"
          />
        ) : (
          <CardTitle className="text-lg">{product.name}</CardTitle>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {isEditing ? (
          <Textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            placeholder="Product description"
            rows={3}
          />
        ) : (
          <CardDescription className="text-gray-600">{product.description}</CardDescription>
        )}

        {!isEditing && (
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
              {product.categoryName || "Uncategorized"}
            </span>
          </div>
        )}

        {isAdmin && (
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
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
