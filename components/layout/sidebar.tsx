"use client"

import { BarChart3, Box, FileText, ShoppingCart, ShoppingBag, Warehouse, Settings, LogOut } from "lucide-react"

const MENU_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: BarChart3 },
  { id: "inventory", label: "Inventory", icon: Box },
  { id: "sales", label: "POS", icon: ShoppingCart },
  { id: "purchase", label: "Purchase", icon: ShoppingBag },
  { id: "warehouse", label: "Warehouse", icon: Warehouse },
  { id: "invoicing", label: "Invoicing", icon: FileText },
]

interface SidebarProps {
  activeModule: string
  setActiveModule: (module: string) => void
}

export function Sidebar({ activeModule, setActiveModule }: SidebarProps) {
  return (
    <div className="w-64 bg-white border-r border-border flex flex-col h-full">
      {/* Brand Header */}
      <div className="p-6 border-b border-border">
        <h1 className="text-2xl font-bold text-primary">POS.</h1>
        <p className="text-sm text-muted-foreground">Point of Sale System</p>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon
            const isActive = activeModule === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActiveModule(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive ? "bg-primary text-white" : "text-foreground hover:bg-secondary"
                }`}
              >
                <span suppressHydrationWarning>
                  <Icon size={20} />
                </span>
                <span className="font-medium">{item.label}</span>
              </button>
            )
          })}
        </div>
      </nav>

      {/* Footer Menu */}
      <div className="border-t border-border p-4 space-y-2">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-foreground hover:bg-secondary rounded-lg transition-colors">
          <span suppressHydrationWarning>
            <Settings size={20} />
          </span>
          <span>Settings</span>
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 text-foreground hover:bg-secondary rounded-lg transition-colors">
          <span suppressHydrationWarning>
            <LogOut size={20} />
          </span>
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}
