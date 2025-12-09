"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Menu, X } from "lucide-react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-background">
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 md:hidden" onClick={() => setSidebarOpen(false)}>
            <div className="absolute inset-0 bg-black/50" />
          </div>
        )}

        <div
          className={`fixed inset-y-0 left-0 z-50 md:static md:z-auto transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
        >
          <Sidebar />
        </div>

        <main className="flex-1 overflow-auto flex flex-col">
          <div className="md:hidden flex items-center gap-4 p-4 border-b border-border bg-white">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-foreground">
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h1 className="text-xl font-bold text-primary">POS</h1>
          </div>
          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}

