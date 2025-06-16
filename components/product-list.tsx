import { ProductCard } from "./product-card"

interface Product {
  id: string
  name: string
  description: string
  categoryId: string
  categoryName?: string
}

interface ProductListProps {
  products: Product[]
  isAdmin?: boolean
  onEdit?: (id: string, updatedProduct: Omit<Product, "id">) => void
  onDelete?: (id: string) => void
}

export function ProductList({ products, isAdmin = false, onEdit, onDelete }: ProductListProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No products available yet.</p>
        {isAdmin && <p className="text-gray-400 text-sm mt-2">Add your first product using the form above.</p>}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} isAdmin={isAdmin} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  )
}
