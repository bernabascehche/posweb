"use client"

import { useState } from "react"
import { useApi } from "@/hooks/use-api"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { AlertCircle } from "lucide-react"

export default function WarehouseList() {
  const { data: warehouses, loading: warehousesLoading, error: warehousesError } = useApi("/warehouse/warehouses")
  const { data: stock } = useApi("/inventory/stock")

  const [searchTerm, setSearchTerm] = useState("")

  // Filter warehouses
  const filteredWarehouses = (warehouses || []).filter((warehouse) => {
    const matchesSearch =
      warehouse.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      warehouse.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      warehouse.location?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-2">Total Warehouses</p>
              <p className="text-3xl font-bold text-blue-600">{(warehouses || []).length}</p>
            </div>
            <div className="text-4xl">🏭</div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-2">Active Warehouses</p>
              <p className="text-3xl font-bold text-purple-600">
                {(warehouses || []).filter((w) => w.status === "active" || !w.status).length}
              </p>
            </div>
            <div className="text-4xl">✅</div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-2">Total Stock Items</p>
              <p className="text-3xl font-bold text-green-600">{(stock || []).length}</p>
            </div>
            <div className="text-4xl">📦</div>
          </div>
        </Card>
      </div>

      {/* Search */}
      <div className="space-y-4">
        <Input
          placeholder="Search by name, code, or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
      </div>

      {/* Loading State */}
      {warehousesLoading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#e20074]"></div>
          <p className="mt-4 text-gray-600">Loading warehouses...</p>
        </div>
      )}

      {/* Error State */}
      {warehousesError && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
            <div className="ml-3">
              <p className="text-sm text-yellow-800">
                Using sample data. Ensure your API is running at {process.env.NEXT_PUBLIC_API_URL}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Warehouses Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Code</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Location</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredWarehouses.length > 0 ? (
              filteredWarehouses.map((warehouse) => (
                <tr key={warehouse.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{warehouse.name || "N/A"}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{warehouse.code || "N/A"}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{warehouse.location || "N/A"}</td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        warehouse.status === "active" || !warehouse.status
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {warehouse.status === "active" || !warehouse.status ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{warehouse.description || "—"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                  No warehouses found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export { WarehouseList }

