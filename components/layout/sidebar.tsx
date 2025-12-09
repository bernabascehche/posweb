"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { BarChart3, Box, FileText, ShoppingCart, ShoppingBag, Warehouse, Settings, LogOut, Users, Building2, Shield, Key, Folder, ChevronDownIcon, ChevronRightIcon } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const MENU_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: BarChart3, path: "/" },
  { id: "inventory", label: "Inventory", icon: Box, path: "/" },
  { id: "sales", label: "POS", icon: ShoppingCart, path: "/" },
  { id: "purchase", label: "Purchase", icon: ShoppingBag, path: "/" },
  { id: "warehouse", label: "Warehouse", icon: Warehouse, path: "/" },
  { id: "invoicing", label: "Invoicing", icon: FileText, path: "/" },
]

const IAM_ITEMS = [
  { id: "users", label: "Users", icon: Users, path: "/users" },
  { id: "organizations", label: "Organizations", icon: Building2, path: "/organizations" },
  { id: "roles", label: "Roles", icon: Shield, path: "/roles" },
  { id: "permissions", label: "Permissions", icon: Key, path: "/permissions" },
  { id: "resources", label: "Resources", icon: Folder, path: "/resources" },
]

interface SidebarProps {
  activeModule?: string
  setActiveModule?: (module: string) => void
}

export function Sidebar({ activeModule, setActiveModule }: SidebarProps) {
  const { logout, user, switchOrganization } = useAuth()
  const pathname = usePathname()
  const [iamOpen, setIamOpen] = useState(true)
  const [isOrgDialogOpen, setIsOrgDialogOpen] = useState(false)
  const [selectedOrgId, setSelectedOrgId] = useState<string>("")
  const [isDefault, setIsDefault] = useState(false)
  const [password, setPassword] = useState("")
  const { toast } = useToast()

  const handleLogout = async () => {
    await logout()
  }

  const handleSwitchOrganization = async () => {
    if (!selectedOrgId || !password) {
      toast({
        title: "Error",
        description: "Please select an organization and enter your password",
        variant: "destructive",
      })
      return
    }

    const success = await switchOrganization(selectedOrgId, password, isDefault)
    if (success) {
      toast({
        title: "Success",
        description: "Organization switched successfully",
      })
      setIsOrgDialogOpen(false)
      setPassword("")
      setSelectedOrgId("")
      setIsDefault(false)
    } else {
      toast({
        title: "Error",
        description: "Failed to switch organization. Please check your password.",
        variant: "destructive",
      })
    }
  }

  const handleModuleClick = (module: string) => {
    if (setActiveModule) {
      setActiveModule(module)
    }
  }

  const isActive = (path: string, moduleId?: string) => {
    if (pathname === path) return true
    if (activeModule && moduleId && activeModule === moduleId) return true
    return false
  }

  // Auto-expand IAM section if any IAM route is active
  useEffect(() => {
    const isIamRouteActive = IAM_ITEMS.some(item => pathname === item.path)
    if (isIamRouteActive && !iamOpen) {
      setIamOpen(true)
    }
  }, [pathname, iamOpen])

  return (
    <div className="w-64 bg-white border-r border-border flex flex-col h-full">
      {/* Brand Header */}
      <div className="p-6 border-b border-border">
        <Link href="/" className="block">
          <h1 className="text-2xl font-bold text-primary">POS.</h1>
          <p className="text-sm text-muted-foreground">Point of Sale System</p>
        </Link>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-2">
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon
            const active = isActive(item.path, item.id)
            
            if (item.path === "/" && setActiveModule) {
              return (
                <button
                  key={item.id}
                  onClick={() => handleModuleClick(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    active ? "bg-primary text-white" : "text-foreground hover:bg-secondary"
                  }`}
                >
                  <span suppressHydrationWarning>
                    <Icon size={20} />
                  </span>
                  <span className="font-medium">{item.label}</span>
                </button>
              )
            }
            
            return (
              <Link
                key={item.id}
                href={item.path}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  active ? "bg-primary text-white" : "text-foreground hover:bg-secondary"
                }`}
              >
                <span suppressHydrationWarning>
                  <Icon size={20} />
                </span>
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>

        {/* IAM Section */}
        {/* <div className="mt-6 pt-6 border-t border-border">
          <Collapsible open={iamOpen} onOpenChange={setIamOpen}>
            <CollapsibleTrigger className="w-full flex items-center justify-between px-4 py-2 rounded-lg hover:bg-secondary transition-colors">
             <span suppressHydrationWarning>
                <Shield size={16} />
              </span>
              <p className="text-xs font-semibold text-muted-foreground uppercase">Identity and Access Management</p>
              <span suppressHydrationWarning>
                {iamOpen ? <ChevronDownIcon size={16} /> : <ChevronRightIcon size={16} />}
              </span>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2 mt-2">
              {IAM_ITEMS.map((item) => {
                const Icon = item.icon
                const active = isActive(item.path, item.id)
                return (
                  <Link
                    key={item.id}
                    href={item.path}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      active ? "bg-primary text-white" : "text-foreground hover:bg-secondary"
                    }`}
                  >
                    <span suppressHydrationWarning>
                      <Icon size={20} />
                    </span>
                    <span className="font-medium">{item.label}</span>
                  </Link>
                )
              })}
            </CollapsibleContent>
          </Collapsible>
        </div> */}
      </nav>

      {/* Footer Menu */}
      <div className="border-t border-border p-4 space-y-2">
        <Link
          href="/settings"
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            pathname === "/settings" ? "bg-primary text-white" : "text-foreground hover:bg-secondary"
          }`}
        >
          <span suppressHydrationWarning>
            <Settings size={20} />
          </span>
          <span>Settings</span>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-foreground hover:bg-secondary rounded-lg transition-colors"
        >
          <span suppressHydrationWarning>
            <LogOut size={20} />
          </span>
          <span>Logout</span>
        </button>
        {user && (
          <div className="px-4 py-2 text-xs text-muted-foreground border-t border-border mt-2 space-y-2">
            <div>
              <p className="font-medium">{user.phone}</p>
              <p className="text-xs">{user.organization_name || user.organization?.name || "System Organization"}</p>
            </div>
            {user.organizations && user.organizations.length > 1 && (
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs"
                onClick={() => {
                  setSelectedOrgId(user.organization_id || "")
                  setIsDefault(user.is_default || false)
                  setIsOrgDialogOpen(true)
                }}
              >
                Switch Organization
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Organization Switch Dialog */}
      <Dialog open={isOrgDialogOpen} onOpenChange={setIsOrgDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Switch Organization</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="organization">Select Organization</Label>
              <Select value={selectedOrgId} onValueChange={setSelectedOrgId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select organization" />
                </SelectTrigger>
                <SelectContent>
                  {user?.organizations?.map((org) => (
                    <SelectItem key={org.id} value={org.id}>
                      {org.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_default"
                checked={isDefault}
                onCheckedChange={(checked) => setIsDefault(checked === true)}
              />
              <Label htmlFor="is_default" className="text-sm font-normal cursor-pointer">
                Set as default organization
              </Label>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => {
                setIsOrgDialogOpen(false)
                setPassword("")
                setSelectedOrgId("")
                setIsDefault(false)
              }}>
                Cancel
              </Button>
              <Button onClick={handleSwitchOrganization}>
                Switch
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
