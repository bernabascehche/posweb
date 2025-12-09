"use client"

import { useState } from "react"
import { useApi } from "@/hooks/use-api"
import { iamAPI } from "@/lib/api-client"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import type { Organization, CreateOrganizationRequest, UpdateOrganizationRequest } from "@/lib/types"
import { Plus, Edit, Trash2, Building2, Eye } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Badge } from "@/components/ui/badge"

export function Organization() {
  const router = useRouter()
  const { user } = useAuth()
  const isSystemUser = user?.is_system === true
  const { data: organizations, loading, refetch } = useApi<Organization[]>(() => iamAPI.getOrganizations())
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null)
  const [formData, setFormData] = useState<CreateOrganizationRequest>({
    name: "",
    tenant_id: "",
  })
  const { toast } = useToast()

  const handleCreate = () => {
    setEditingOrg(null)
    setFormData({
      name: "",
      tenant_id: "",
    })
    setIsDialogOpen(true)
  }

  const handleEdit = (org: Organization) => {
    setEditingOrg(org)
    setFormData({
      name: org.name,
      tenant_id: org.tenant_id || "",
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this organization?")) return

    try {
      const result = await iamAPI.deleteOrganization(id)
      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success",
          description: "Organization deleted successfully",
        })
        refetch()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete organization",
        variant: "destructive",
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingOrg) {
        const result = await iamAPI.updateOrganization(editingOrg.id.toString(), formData)
        if (result.error) {
          toast({
            title: "Error",
            description: result.error,
            variant: "destructive",
          })
        } else {
          toast({
            title: "Success",
            description: "Organization updated successfully",
          })
          setIsDialogOpen(false)
          refetch()
        }
      } else {
        const result = await iamAPI.createOrganization(formData)
        if (result.error) {
          toast({
            title: "Error",
            description: result.error,
            variant: "destructive",
          })
        } else {
          toast({
            title: "Success",
            description: "Organization created successfully",
          })
          setIsDialogOpen(false)
          refetch()
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Operation failed",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          <h2 className="text-xl font-bold">Organizations</h2>
        </div>
        {isSystemUser && (
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Add Organization
          </Button>
        )}
      </div>

      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Tenant ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : organizations && organizations.length > 0 ? (
                organizations.map((org) => (
                  <TableRow key={org.id}>
                    <TableCell className="font-medium">{org.name}</TableCell>
                    <TableCell>{org.tenant_id}</TableCell>
                    <TableCell>
                      <Badge variant={org.deleted_at ? "destructive" : "default"}>
                        {org.deleted_at ? "Deleted" : "Active"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => router.push(`/organizations/${org.id}`)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        {isSystemUser && (
                          <>
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(org)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDelete(org.id.toString())}>
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                    No organizations found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingOrg ? "Edit Organization" : "Create Organization"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tenant_id">Tenant ID *</Label>
              <Input
                id="tenant_id"
                value={formData.tenant_id}
                onChange={(e) => setFormData({ ...formData, tenant_id: e.target.value })}
                required
                placeholder="e.g., default-tenant, CC-tenant-123"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">{editingOrg ? "Update" : "Create"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
