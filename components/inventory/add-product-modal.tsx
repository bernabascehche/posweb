"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { inventoryAPI } from "@/lib/api-client"
import type { CreateProductTemplateRequest, Category, Brand, Uom } from "@/lib/types"

interface AddProductModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  categories: Category[]
  brands: Brand[]
}

export function AddProductModal({ isOpen, onClose, onSuccess, categories, brands }: AddProductModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uoms, setUoms] = useState<Uom[]>([])
  const [formData, setFormData] = useState<Partial<CreateProductTemplateRequest>>({
    name: "",
    type: "storable",
    default_code: "",
    barcode: "",
    description: "",
    category_id: undefined,
    brand_id: undefined,
    list_price: 0,
    standard_price: 0,
    uom_id: 1,
    sale_ok: true,
    purchase_ok: true,
    is_published: true,
    active: true,
    min_stock_qty: 0,
    max_stock_qty: 100,
  })

  // Fetch UOMs when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchUoms()
    }
  }, [isOpen])

  const fetchUoms = async () => {
    try {
      const result = await inventoryAPI.getUoms()
      if (result.data) {
        setUoms(result.data)
        // Set default UOM if available
        if (result.data.length > 0) {
          setFormData(prev => ({ ...prev, uom_id: result.data[0].id }))
        }
      }
    } catch (err) {
      console.error("Failed to fetch UOMs:", err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Validate required fields
      if (!formData.name) {
        setError("Product name is required")
        setLoading(false)
        return
      }

      if (!formData.uom_id) {
        setError("Unit of measure is required")
        setLoading(false)
        return
      }

      // Create the product
      const result = await inventoryAPI.createProduct(formData as CreateProductTemplateRequest)
      
      if (result.error) {
        setError(result.error)
      } else {
        // Success - reset form and close modal
        setFormData({
          name: "",
          type: "storable",
          default_code: "",
          barcode: "",
          description: "",
          category_id: undefined,
          brand_id: undefined,
          list_price: 0,
          standard_price: 0,
          uom_id: 1,
          sale_ok: true,
          purchase_ok: true,
          is_published: true,
          active: true,
          min_stock_qty: 0,
          max_stock_qty: 100,
        })
        onSuccess()
        onClose()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create product")
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Add New Product</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Basic Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Laptop, T-Shirt, Coffee"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">SKU</label>
                <Input
                  value={formData.default_code}
                  onChange={(e) => setFormData({ ...formData, default_code: e.target.value })}
                  placeholder="e.g., PROD-001"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Barcode</label>
                <Input
                  value={formData.barcode}
                  onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                  placeholder="e.g., 1234567890"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Product description..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="storable">Storable</option>
                  <option value="consumable">Consumable</option>
                  <option value="service">Service</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={formData.category_id || ""}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value ? Number(e.target.value) : undefined })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">None</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                <select
                  value={formData.brand_id || ""}
                  onChange={(e) => setFormData({ ...formData, brand_id: e.target.value ? Number(e.target.value) : undefined })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">None</option>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Pricing</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sale Price <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.list_price}
                  onChange={(e) => setFormData({ ...formData, list_price: parseFloat(e.target.value) || 0 })}
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cost Price</label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.standard_price}
                  onChange={(e) => setFormData({ ...formData, standard_price: parseFloat(e.target.value) || 0 })}
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          {/* Inventory */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Inventory</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unit of Measure <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.uom_id}
                  onChange={(e) => setFormData({ ...formData, uom_id: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  {uoms.map((uom) => (
                    <option key={uom.id} value={uom.id}>
                      {uom.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Min Stock</label>
                <Input
                  type="number"
                  min="0"
                  value={formData.min_stock_qty}
                  onChange={(e) => setFormData({ ...formData, min_stock_qty: parseFloat(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Stock</label>
                <Input
                  type="number"
                  min="0"
                  value={formData.max_stock_qty}
                  onChange={(e) => setFormData({ ...formData, max_stock_qty: parseFloat(e.target.value) || 0 })}
                  placeholder="100"
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-primary text-white hover:bg-primary/90"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Product"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

