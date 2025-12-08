"use client"

import { useState } from "react"
import { useApi } from "@/hooks/use-api"
import { inventoryAPI } from "@/lib/api-client"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { AlertCircle, Plus } from "lucide-react"
import type { ProductTemplate, Category, Brand, StockQuant } from "@/lib/types"

export default function InventoryList() {
  const { data: products, loading: productsLoading, error: productsError } = useApi<ProductTemplate[]>(
    () => inventoryAPI.getProducts()
  )
  const { data: categories } = useApi<Category[]>(() => inventoryAPI.getCategories())
  const { data: brands } = useApi<Brand[]>(() => inventoryAPI.getBrands())
  const { data: stock } = useApi<StockQuant[]>(() => inventoryAPI.getStock())

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedBrand, setSelectedBrand] = useState("")
  const [barcodeSearch, setBarcodeSearch] = useState("")

  // Filter products
  const filteredProducts = (products || []).filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.default_code || "").toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || product.category_id?.toString() === selectedCategory
    const matchesBrand = !selectedBrand || product.brand_id?.toString() === selectedBrand
    const matchesBarcode = !barcodeSearch || product.barcode === barcodeSearch
    return matchesSearch && matchesCategory && matchesBrand && matchesBarcode
  })

  // Get category name by ID
  const getCategoryName = (categoryId: number | null) => {
    if (!categoryId) return "N/A"
    const category = (categories || []).find((c) => c.id === categoryId)
    return category?.name || "N/A"
  }

  // Get brand name by ID
  const getBrandName = (brandId: number | null) => {
    if (!brandId) return "N/A"
    const brand = (brands || []).find((b) => b.id === brandId)
    return brand?.name || "N/A"
  }

  // Get stock quantity for a product
  const getStockQuantity = (productId: number) => {
    const stockItem = (stock || []).find((s) => s.product_id === productId)
    return stockItem?.quantity || 0
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Info Cards - Now at TOP */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-2">Total Products</p>
              <p className="text-3xl font-bold text-blue-600">{(products || []).length}</p>
            </div>
            <div className="text-4xl">📦</div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-2">Categories</p>
              <p className="text-3xl font-bold text-purple-600">{(categories || []).length}</p>
            </div>
            <div className="text-4xl">🏷️</div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-2">Stock Items</p>
              <p className="text-3xl font-bold text-green-600">{(stock || []).length}</p>
            </div>
            <div className="text-4xl">📊</div>
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <Input
            placeholder="Search by name or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <Input
            placeholder="Search by barcode..."
            value={barcodeSearch}
            onChange={(e) => setBarcodeSearch(e.target.value)}
            className="flex-1"
          />
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#e20074]"
          >
            <option value="">All Categories</option>
            {(categories || []).map((cat) => (
              <option key={cat.id} value={cat.id.toString()}>
                {cat.name}
              </option>
            ))}
          </select>

          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#e20074]"
          >
            <option value="">All Brands</option>
            {(brands || []).map((brand) => (
              <option key={brand.id} value={brand.id.toString()}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading State */}
      {productsLoading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#e20074]"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      )}

      {/* Error State */}
      {productsError && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
            <div className="ml-3">
              <p className="text-sm text-yellow-800">
                Using sample data. Ensure your API is running at {process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">SKU</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Category</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Brand</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Price</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Stock</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => {
                const stockQty = getStockQuantity(product.id)
                return (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{product.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{product.default_code}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {product.category?.name || getCategoryName(product.category_id)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {product.brand?.name || getBrandName(product.brand_id)}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">${product.list_price.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{product.qty_available || stockQty}</td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          (product.qty_available || stockQty) > 0 
                            ? "bg-green-100 text-green-800" 
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {(product.qty_available || stockQty) > 0 ? "In Stock" : "Out of Stock"}
                      </span>
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export { InventoryList }
