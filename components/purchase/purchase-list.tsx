"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Eye, AlertCircle } from "lucide-react"
import { useApi } from "@/hooks/use-api"
import { purchaseAPI } from "@/lib/api-client"
import type { PurchaseOrder } from "@/lib/types"

export function PurchaseList() {
  const { data: purchases, loading, error } = useApi<PurchaseOrder[]>(() => purchaseAPI.getPurchases())

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-700"
      case "in_transit":
        return "bg-blue-100 text-blue-700"
      case "confirmed":
        return "bg-purple-100 text-purple-700"
      case "draft":
        return "bg-gray-100 text-gray-700"
      case "cancelled":
        return "bg-red-100 text-red-700"
      default:
        return "bg-yellow-100 text-yellow-700"
    }
  }

  const formatStatus = (status: string) => {
    return status.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      {error && (
        <Card className="p-6 border-l-4 border-l-yellow-500 bg-yellow-50">
          <div className="flex items-center gap-3">
            <AlertCircle className="text-yellow-600 flex-shrink-0" size={20} />
            <div className="min-w-0">
              <p className="font-semibold text-yellow-800">Using Sample Data</p>
              <p className="text-sm text-yellow-700 break-words">
                API unavailable - displaying mock purchases for demo
              </p>
            </div>
          </div>
        </Card>
      )}

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Purchases</h1>
          <p className="text-sm md:text-base text-muted-foreground">Manage purchase orders</p>
        </div>
        <Button className="w-full md:w-auto bg-primary text-white hover:bg-primary/90 rounded-full flex items-center justify-center gap-2">
          <Plus size={18} />
          New Purchase
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <p className="text-sm text-gray-600">Total Orders</p>
          <p className="text-2xl font-bold text-blue-600">{purchases?.length || 0}</p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <p className="text-sm text-gray-600">Delivered</p>
          <p className="text-2xl font-bold text-green-600">
            {purchases?.filter(p => p.status === "delivered").length || 0}
          </p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <p className="text-sm text-gray-600">In Transit</p>
          <p className="text-2xl font-bold text-blue-600">
            {purchases?.filter(p => p.status === "in_transit").length || 0}
          </p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <p className="text-sm text-gray-600">Total Value</p>
          <p className="text-2xl font-bold text-purple-600">
            ${purchases?.reduce((sum, p) => sum + (p.total_amount || 0), 0).toLocaleString() || 0}
          </p>
        </Card>
      </div>

      {loading && (
        <Card className="p-8">
          <p className="text-center text-muted-foreground">Loading purchases...</p>
        </Card>
      )}

      {/* Purchase Orders List */}
      {!loading && (
        <div className="space-y-4">
          {purchases && purchases.length > 0 ? (
            purchases.map((purchase: PurchaseOrder) => (
              <Card key={purchase.id} className="p-4 md:p-6">
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-foreground">{purchase.name}</p>
                    </div>
                    <p className="text-sm text-primary font-medium">{purchase.supplier_name}</p>
                    <p className="text-sm text-muted-foreground">
                      Ordered: {new Date(purchase.order_date).toLocaleDateString()}
                      {purchase.expected_date && (
                        <span className="ml-2">
                          • Expected: {new Date(purchase.expected_date).toLocaleDateString()}
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="w-full sm:w-auto sm:text-right">
                    <p className="text-lg md:text-xl font-bold text-primary">
                      ${(purchase.total_amount ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
                    <span
                      className={`px-3 py-1 rounded-full text-xs md:text-sm font-medium whitespace-nowrap ${getStatusColor(purchase.status)}`}
                    >
                      {formatStatus(purchase.status)}
                    </span>
                    <Button size="sm" variant="ghost" className="text-primary hover:bg-primary/10 flex-shrink-0">
                      <Eye size={18} />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card className="p-8">
              <p className="text-center text-muted-foreground">No purchases found</p>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
