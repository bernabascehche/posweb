"use client"

import React from "react"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart3, TrendingUp, Package, DollarSign, Loader2 } from "lucide-react"
import { useApi } from "@/hooks/use-api"
import { inventoryAPI, invoicingAPI, purchaseAPI } from "@/lib/api-client"
import type { ProductTemplate, Invoice, PurchaseOrder } from "@/lib/types"

export function DashboardOverview() {
  const { data: products, loading: productsLoading } = useApi<ProductTemplate[]>(() => inventoryAPI.getProducts())
  const { data: invoices, loading: invoicesLoading } = useApi<Invoice[]>(() => invoicingAPI.getInvoices())
  const { data: purchases, loading: purchasesLoading } = useApi<PurchaseOrder[]>(() => purchaseAPI.getPurchases())

  const isLoading = productsLoading || invoicesLoading || purchasesLoading

  // Calculate stats
  const totalProducts = products?.length || 0
  const totalRevenue = invoices?.filter(i => i.status === "paid").reduce((sum, i) => sum + i.total_amount, 0) || 0
  const totalOrders = purchases?.length || 0
  const pendingInvoices = invoices?.filter(i => i.status === "pending" || i.status === "overdue").length || 0

  // Recent orders from purchases
  const recentPurchases = purchases?.slice(0, 4) || []

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to Cheche POS system</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<Package className="text-primary" size={24} />}
          label="Total Products"
          value={isLoading ? "..." : totalProducts.toLocaleString()}
          change="+12%"
          loading={productsLoading}
        />
        <StatCard
          icon={<DollarSign className="text-primary" size={24} />}
          label="Total Revenue"
          value={isLoading ? "..." : `$${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
          change="+8%"
          loading={invoicesLoading}
        />
        <StatCard
          icon={<TrendingUp className="text-primary" size={24} />}
          label="Total Orders"
          value={isLoading ? "..." : totalOrders.toLocaleString()}
          change="+23%"
          loading={purchasesLoading}
        />
        <StatCard
          icon={<BarChart3 className="text-primary" size={24} />}
          label="Pending Invoices"
          value={isLoading ? "..." : pendingInvoices.toLocaleString()}
          change="-5%"
          loading={invoicesLoading}
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6">
          <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
          <div className="space-y-3">
            {purchasesLoading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : recentPurchases.length > 0 ? (
              recentPurchases.map((purchase) => (
                <div key={purchase.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div>
                    <p className="font-medium">{purchase.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(purchase.order_date).toLocaleDateString()} • {purchase.supplier_name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">${purchase.total_amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      purchase.status === "delivered" 
                        ? "bg-green-100 text-green-700" 
                        : purchase.status === "in_transit"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {purchase.status.replace(/_/g, " ")}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">No recent orders</p>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Button className="w-full bg-primary text-white hover:bg-primary/90 rounded-full">New Sale</Button>
            <Button
              variant="outline"
              className="w-full rounded-full border-primary text-primary hover:bg-primary/5 bg-transparent"
            >
              New Purchase
            </Button>
            <Button
              variant="outline"
              className="w-full rounded-full border-primary text-primary hover:bg-primary/5 bg-transparent"
            >
              Create Invoice
            </Button>
          </div>

          {/* Low Stock Alert */}
          <div className="mt-6 pt-6 border-t border-border">
            <h3 className="font-semibold mb-3">Low Stock Alert</h3>
            {productsLoading ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : (
              <div className="space-y-2">
                {products?.filter(p => (p.qty_available || 0) < (p.min_stock_qty || 10)).slice(0, 3).map(product => (
                  <div key={product.id} className="flex items-center justify-between text-sm">
                    <span className="truncate">{product.name}</span>
                    <span className="text-red-600 font-medium">{product.qty_available || 0} left</span>
                  </div>
                ))}
                {products?.filter(p => (p.qty_available || 0) < (p.min_stock_qty || 10)).length === 0 && (
                  <p className="text-sm text-muted-foreground">All products well stocked!</p>
                )}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}

interface StatCardProps {
  icon: React.ReactNode
  label: string
  value: string
  change: string
  loading?: boolean
}

function StatCard({ icon, label, value, change, loading }: StatCardProps) {
  return (
    <Card className="p-6 border-l-4 border-l-primary">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{label}</p>
          {loading ? (
            <div className="h-8 w-20 bg-gray-200 animate-pulse rounded"></div>
          ) : (
            <p className="text-2xl font-bold">{value}</p>
          )}
        </div>
        <div className="p-3 bg-secondary rounded-lg">{icon}</div>
      </div>
      <p className="text-sm text-primary mt-3">{change} this month</p>
    </Card>
  )
}
