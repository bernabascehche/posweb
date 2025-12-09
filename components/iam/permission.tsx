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
import type { Permission, CreatePermissionRequest, UpdatePermissionRequest } from "@/lib/types"
import { Plus, Edit, Trash2, Key, Eye } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"

export function Permission() {
  const router = useRouter()
  const { user } = useAuth()
  const isSystemUser = user?.is_system === true
  const { data: permissions, loading, refetch } = useApi<Permission[]>(() => iamAPI.getPermissions())
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPermission, setEditingPermission] = useState<Permission | null>(null)
  const [formData, setFormData] = useState<CreatePermissionRequest>({
    code: "",
    description: "",
  })
  const { toast } = useToast()

  const handleCreate = () => {
    setEditingPermission(null)
    setFormData({
      code: "",
      description: "",
    })
    setIsDialogOpen(true)
  }

  const handleEdit = (permission: Permission) => {
    setEditingPermission(permission)
    setFormData({
      code: permission.code,
      description: permission.description,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this permission?")) return

    try {
      const result = await iamAPI.deletePermission(id)
      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success",
          description: "Permission deleted successfully",
        })
        refetch()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete permission",
        variant: "destructive",
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingPermission) {
        const result = await iamAPI.updatePermission(editingPermission.id, formData)
        if (result.error) {
          toast({
            title: "Error",
            description: result.error,
            variant: "destructive",
          })
        } else {
          toast({
            title: "Success",
            description: "Permission updated successfully",
          })
          setIsDialogOpen(false)
          refetch()
        }
      } else {
        const result = await iamAPI.createPermission(formData)
        if (result.error) {
          toast({
            title: "Error",
            description: result.error,
            variant: "destructive",
          })
        } else {
          toast({
            title: "Success",
            description: "Permission created successfully",
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
          <Key className="h-5 w-5" />
          <h2 className="text-xl font-bold">Permissions</h2>
        </div>
        {isSystemUser && (
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Add Permission
          </Button>
        )}
      </div>

      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Description</TableHead>
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
              ) : permissions && permissions.length > 0 ? (
                permissions.map((permission) => (
                  <TableRow key={permission.id}>
                    <TableCell className="font-medium">{permission.code}</TableCell>
                    <TableCell>{permission.description}</TableCell>
                    <TableCell>
                      <Badge variant={permission.deleted_at ? "destructive" : "default"}>
                        {permission.deleted_at ? "Deleted" : "Active"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => router.push(`/permissions/${permission.id}`)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        {isSystemUser && (
                          <>
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(permission)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDelete(permission.id)}>
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
                    No permissions found
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
            <DialogTitle>{editingPermission ? "Edit Permission" : "Create Permission"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Code *</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                required
                placeholder="e.g., ma, read, write"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">{editingPermission ? "Update" : "Create"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

