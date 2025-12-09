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
import type { User, CreateUserRequest } from "@/lib/types"
import { Plus, Users, Eye, Edit, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import type { UpdateUserRequest } from "@/lib/types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface OrganizationUsersProps {
  organizationId: string
}

export function OrganizationUsers({ organizationId }: OrganizationUsersProps) {
  const router = useRouter()
  const { user: currentUser } = useAuth()
  const isSystemUser = currentUser?.is_system === true
  // Use system endpoint if system user, otherwise filter all users
  const { data: organizationUsers, loading, refetch } = useApi<User[]>(() =>
    isSystemUser
      ? iamAPI.getUsersByOrganization(organizationId)
      : Promise.resolve(iamAPI.getUsers()).then((result) => ({
          data: result.data?.filter((user) => user.organization_id === organizationId) || [],
          error: result.error,
        }))
  )
  const { data: roles } = useApi(() => iamAPI.getRoles())
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [formData, setFormData] = useState<CreateUserRequest>({
    phone: "",
    password: "",
    firstname: "",
    middlename: "",
    lastname: "",
    organization_id: organizationId,
    role_ids: [],
  })
  const { toast } = useToast()

  const handleCreate = () => {
    setEditingUser(null)
    setFormData({
      phone: "",
      password: "",
      firstname: "",
      middlename: "",
      lastname: "",
      organization_id: organizationId,
    })
    setIsDialogOpen(true)
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setFormData({
      phone: user.phone,
      password: "",
      firstname: (user as any).firstname || "",
      middlename: (user as any).middlename || "",
      lastname: (user as any).lastname || "",
      organization_id: user.organization_id || organizationId,
    //   role_ids: user.roles?.map((r) => r.id.toString()) || [],
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return

    try {
      const result = await iamAPI.deleteUser(id)
      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success",
          description: "User deleted successfully",
        })
        refetch()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete user",
        variant: "destructive",
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingUser) {
        const updateData: UpdateUserRequest = { ...formData }
        if (!updateData.password) {
          delete updateData.password
        }
        const result = await iamAPI.updateUser(editingUser.id.toString(), updateData)
        if (result.error) {
          toast({
            title: "Error",
            description: result.error,
            variant: "destructive",
          })
        } else {
          toast({
            title: "Success",
            description: "User updated successfully",
          })
          setIsDialogOpen(false)
          refetch()
        }
      } else {
        const result = await iamAPI.createUser(formData, isSystemUser)
        if (result.error) {
          toast({
            title: "Error",
            description: result.error,
            variant: "destructive",
          })
        } else {
          toast({
            title: "Success",
            description: "User created successfully",
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
          <Users className="h-5 w-5" />
          <h2 className="text-xl font-bold">Users ({organizationUsers ? organizationUsers.length : 0})</h2>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Phone</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead>Type</TableHead>
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
            ) : organizationUsers && organizationUsers.length > 0 ? (
              organizationUsers.map((user: any) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.phone}</TableCell>
                  <TableCell>
                    {user.firstname || user.middlename || user.lastname
                      ? `${user.firstname || ""} ${user.middlename || ""} ${user.lastname || ""}`.trim()
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {user.roles && user.roles.length > 0 ? (
                        user.roles.map((role: any) => (
                          <Badge key={role.id} variant="secondary">
                            {role.name}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-gray-400">No roles</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.is_system ? "default" : "outline"}>
                      {user.is_system ? "System" : "User"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => router.push(`/users/${user.id}`)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      {isSystemUser && (
                        <>
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(user)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(user.id)}>
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
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  No users found in this organization
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingUser ? "Edit User" : isSystemUser ? "Add Admin User" : "Add User"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="firstname">First Name</Label>
              <Input
                id="firstname"
                value={formData.firstname || ""}
                onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="middlename">Middle Name</Label>
              <Input
                id="middlename"
                value={formData.middlename || ""}
                onChange={(e) => setFormData({ ...formData, middlename: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="lastname">Last Name</Label>
              <Input
                id="lastname"
                value={formData.lastname || ""}
                onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="password">{editingUser ? "New Password (leave empty to keep current)" : "Password *"}</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required={!editingUser}
              />
            </div>
            {isSystemUser && (
              <div>
                <Label htmlFor="organization_id">Organization ID</Label>
                <Input
                  id="organization_id"
                  value={formData.organization_id || ""}
                  disabled
                  className="bg-gray-100"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Organization ID is automatically set for system users
                </p>
              </div>
            )}
            <div>
              <Label htmlFor="role_ids">Roles</Label>
              <Select
                value={formData.role_ids?.[0] || ""}
                onValueChange={(value) => {
                  if (value) {
                    setFormData({
                      ...formData,
                      role_ids: formData.role_ids?.includes(value)
                        ? formData.role_ids.filter((id) => id !== value)
                        : [...(formData.role_ids || []), value],
                    })
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select roles (optional)" />
                </SelectTrigger>
                <SelectContent>
                      {roles?.map((role: any) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formData.role_ids && formData.role_ids.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {formData.role_ids.map((roleId) => {
                    const role = roles?.find((r: any) => r.id === roleId)
                    return role ? (
                      <Badge key={roleId} variant="secondary" className="cursor-pointer" onClick={() => {
                        setFormData({
                          ...formData,
                          role_ids: formData.role_ids?.filter((id) => id !== roleId) || [],
                        })
                      }}>
                        {role.name} ×
                      </Badge>
                    ) : null
                  })}
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">{editingUser ? "Update" : "Create"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

