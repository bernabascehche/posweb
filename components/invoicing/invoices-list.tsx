"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus,AlertCircle, Download } from "lucide-react"
import { useState } from "react"
import { useApi } from "@/hooks/use-api"
import { invoicingAPI } from "@/lib/api-client"
import type { Invoice } from "@/lib/types"
import { Search } from "lucide-react"

export function InvoicesList() {
  const [searchTerm, setSearchTerm] = useState("")
  const { data: invoices, loading, error } = useApi<Invoice[]>(() => invoicingAPI.getInvoices())

  const filteredInvoices =
    invoices?.filter(
      (i: Invoice) =>
        i.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.client_name.toLowerCase().includes(searchTerm.toLowerCase()),
    ) || []

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-700"
      case "pending":
        return "bg-yellow-100 text-yellow-700"
      case "overdue":
        return "bg-red-100 text-red-700"
      case "draft":
        return "bg-gray-100 text-gray-700"
      case "cancelled":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const formatStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  // Calculate totals
  const totalPaid = invoices?.filter(i => i.status === "paid").reduce((sum, i) => sum + i.total_amount, 0) || 0
  const totalPending = invoices?.filter(i => i.status === "pending").reduce((sum, i) => sum + i.total_amount, 0) || 0
  const totalOverdue = invoices?.filter(i => i.status === "overdue").reduce((sum, i) => sum + i.total_amount, 0) || 0

  return (
    <div className="p-4 md:p-8 space-y-6">
      {error && (
        <Card className="p-6 border-l-4 border-l-yellow-500 bg-yellow-50">
          <div className="flex items-center gap-3">
            <AlertCircle className="text-yellow-600 flex-shrink-0" size={20} />
            <div className="min-w-0">
              <p className="font-semibold text-yellow-800">Using Sample Data</p>
              <p className="text-sm text-yellow-700 break-words">API unavailable - displaying mock invoices for demo</p>
            </div>
          </div>
        </Card>
      )}

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Invoicing</h1>
          <p className="text-sm md:text-base text-muted-foreground">Create and manage invoices</p>
        </div>
        <Button className="w-full md:w-auto bg-primary text-white hover:bg-primary/90 rounded-full flex items-center justify-center gap-2">
          <Plus size={18} />
          Create Invoice
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <p className="text-sm text-gray-600">Total Invoices</p>
          <p className="text-2xl font-bold text-blue-600">{invoices?.length || 0}</p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <p className="text-sm text-gray-600">Paid</p>
          <p className="text-2xl font-bold text-green-600">${totalPaid.toFixed(2)}</p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <p className="text-sm text-gray-600">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">${totalPending.toFixed(2)}</p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <p className="text-sm text-gray-600">Overdue</p>
          <p className="text-2xl font-bold text-red-600">${totalOverdue.toFixed(2)}</p>
        </Card>
      </div>

      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground flex-shrink-0"
          size={18}
        />
        <Input
          placeholder="Search invoices by number or client..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 rounded-full border-primary focus:ring-primary text-sm md:text-base"
        />
      </div>

      {loading && (
        <Card className="p-8">
          <p className="text-center text-muted-foreground">Loading invoices...</p>
        </Card>
      )}

      {!loading && (
        <>
          <div className="overflow-x-auto">
            <Card className="overflow-hidden">
              <table className="w-full text-sm md:text-base">
                <thead className="bg-secondary border-b border-border">
                  <tr>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-left font-semibold">Invoice #</th>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-left font-semibold hidden sm:table-cell">Client</th>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-left font-semibold hidden md:table-cell">Issue Date</th>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-left font-semibold hidden lg:table-cell">Due Date</th>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-left font-semibold">Amount</th>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-left font-semibold">Status</th>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-right font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.length > 0 ? (
                    filteredInvoices.map((invoice: Invoice, index: number) => (
                      <tr
                        key={invoice.id}
                        className={index !== filteredInvoices.length - 1 ? "border-b border-border" : ""}
                      >
                        <td className="px-4 md:px-6 py-3 md:py-4 font-semibold text-primary text-xs md:text-base">
                          {invoice.invoice_number}
                        </td>
                        <td className="px-4 md:px-6 py-3 md:py-4 font-medium hidden sm:table-cell truncate">
                          {invoice.client_name}
                        </td>
                        <td className="px-4 md:px-6 py-3 md:py-4 text-muted-foreground hidden md:table-cell text-xs md:text-base">
                          {new Date(invoice.issue_date).toLocaleDateString()}
                        </td>
                        <td className="px-4 md:px-6 py-3 md:py-4 text-muted-foreground hidden lg:table-cell text-xs md:text-base">
                          {new Date(invoice.due_date).toLocaleDateString()}
                        </td>
                        <td className="px-4 md:px-6 py-3 md:py-4 font-bold text-primary text-xs md:text-base">
                          ${invoice.total_amount.toFixed(2)}
                        </td>
                        <td className="px-4 md:px-6 py-3 md:py-4">
                          <span
                            className={`px-2 md:px-3 py-1 rounded-full text-xs font-medium inline-block ${getStatusColor(invoice.status)}`}
                          >
                            {formatStatus(invoice.status)}
                          </span>
                        </td>
                        <td className="px-4 md:px-6 py-3 md:py-4 text-right">
                          <Button size="sm" variant="ghost" className="text-primary hover:bg-primary/10">
                            <Download size={18} />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-4 md:px-6 py-8 text-center text-muted-foreground">
                        No invoices found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
