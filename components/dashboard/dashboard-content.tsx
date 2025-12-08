import { DashboardOverview } from "@/components/dashboard/overview"
import { InventoryList } from "@/components/inventory/inventory-list"
import { SalesList } from "@/components/sales/sales-list"
import { PurchaseList } from "@/components/purchase/purchase-list"
import { WarehouseList } from "@/components/warehouse/warehouse-list"
import { InvoicesList } from "@/components/invoicing/invoices-list"

interface DashboardContentProps {
  module: string
}

export function DashboardContent({ module }: DashboardContentProps) {
  const getContent = () => {
    switch (module) {
      case "dashboard":
        return <DashboardOverview />
      case "inventory":
        return <InventoryList />
      case "sales":
        return <SalesList /> // ensure sales module uses SalesList which now renders POSInterface
      case "purchase":
        return <PurchaseList />
      case "warehouse":
        return <WarehouseList />
      case "invoicing":
        return <InvoicesList />
      default:
        return <DashboardOverview />
    }
  }

  return <div className="flex-1">{getContent()}</div>
}
