import { CategoryCard } from "./category-card"

interface Category {
  id: string
  name: string
}

interface CategoryListProps {
  categories: Category[]
  getProductCountForCategory: (categoryId: string) => number
  onEdit: (id: string, updatedCategory: Omit<Category, "id">) => void
  onDelete: (id: string) => void
}

export function CategoryList({ categories, getProductCountForCategory, onEdit, onDelete }: CategoryListProps) {
  if (categories.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No categories available yet.</p>
        <p className="text-gray-400 text-sm mt-2">Add your first category using the form above.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category) => (
        <CategoryCard
          key={category.id}
          category={category}
          productCount={getProductCountForCategory(category.id)}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
