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
import type { Role, CreateRoleRequest, UpdateRoleRequest } from "@/lib/types"
import { Plus, Edit, Trash2, Shield, Eye } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function Role() {
  const router = useRouter()
  const { user } = useAuth()
  const isSystemUser = user?.is_system === true
  const { data: roles, loading, refetch } = useApi<Role[]>(() => iamAPI.getRoles())
  const { data: organizations } = useApi(() => iamAPI.getOrganizations())
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [formData, setFormData] = useState<CreateRoleRequest>({
    name: "",
    organization_id: undefined,
    resource_permission_ids: [],
  })
  const { toast } = useToast()

  const handleCreate = () => {
    setEditingRole(null)
    setFormData({
      name: "",
      organization_id: undefined,
      resource_permission_ids: [],
    })
    setIsDialogOpen(true) 
  }

  const handleEdit = (role: Role) => {
    setEditingRole(role)
    setFormData({
      name: role.name,
      organization_id: role.organization_name || undefined,
      resource_permission_ids: [],
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this role?")) return

    try {
      const result = await iamAPI.deleteRole(id)
      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success",
          description: "Role deleted successfully",
        })
        refetch()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete role",
        variant: "destructive",
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingRole) {
        const result = await iamAPI.updateRole(editingRole.id, formData)
        if (result.error) {
          toast({
            title: "Error",
            description: result.error,
            variant: "destructive",
          })
        } else {
          toast({
            title: "Success",
            description: "Role updated successfully",
          })
          setIsDialogOpen(false)
          refetch()
        }
      } else {
        const result = await iamAPI.createRole(formData)
        if (result.error) {
          toast({
            title: "Error",
            description: result.error,
            variant: "destructive",
          })
        } else {
          toast({
            title: "Success",
            description: "Role created successfully",
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
          <Shield className="h-5 w-5" />
          <h2 className="text-xl font-bold">Roles</h2>
        </div>
        
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Add Role
          </Button>
    
      </div>

      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Organization</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : roles && roles.length > 0 ? (
                roles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell className="font-medium">{role.name}</TableCell>
                    <TableCell>{role.organization_name || "System"}</TableCell>
                    <TableCell>
                      <Badge variant={role.is_system ? "default" : "outline"}>
                        {role.is_system ? "System" : "Custom"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={role.deleted_at ? "destructive" : "default"}>
                        {role.deleted_at ? "Deleted" : "Active"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => router.push(`/roles/${role.id}`)}>
                          <Eye className="h-4 w-4" />
                        </Button>                        
                          <>
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(role)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDelete(role.id)}>
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </>
                        
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    No roles found
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
            <DialogTitle>{editingRole ? "Edit Role" : "Create Role"}</DialogTitle>
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
              <Label htmlFor="organization_id">Organization</Label>
              <Select
                value={formData.organization_id || undefined}
                onValueChange={(value) =>
                  setFormData({ ...formData, organization_id: value === "__none__" ? undefined : value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select organization (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">None</SelectItem>
                  {organizations?.map((org: any) => (
                    <SelectItem key={org.id} value={org.id}>
                      {org.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">{editingRole ? "Update" : "Create"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

