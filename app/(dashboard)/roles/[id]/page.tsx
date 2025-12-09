"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useApi } from "@/hooks/use-api"
import { iamAPI } from "@/lib/api-client"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Shield, CheckIcon } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import type { ResourcePermission } from "@/lib/types"
import { useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function RoleDetailPage() {
  const params = useParams()
  const router = useRouter()
  const roleId = params.id as string
  const { user: currentUser } = useAuth()
  const isSystemUser = currentUser?.is_system === true
  const { toast } = useToast()

  const { data: role, loading, refetch } = useApi(() => iamAPI.getRoleById(roleId))
  const { data: resourcePermissions } = useApi(() => iamAPI.getResourcePermissions())

  const [selectedPermissionIds, setSelectedPermissionIds] = useState<string[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)

  // Initialize selected permissions from role's current resource_permissions
  useEffect(() => {
    if (role?.resource_permissions) {
      setSelectedPermissionIds(role.resource_permissions.map((rp) => rp.id))
    }
  }, [role])

  const handleOpenAssignModal = () => {
    // Initialize with current role permissions when opening modal
    if (role?.resource_permissions) {
      setSelectedPermissionIds(role.resource_permissions.map((rp) => rp.id))
    }
    setIsAssignModalOpen(true)
  }

  const handleSaveAssignments = async () => {
    setIsSaving(true)
    try {
      const result = await iamAPI.assignResourcePermissionsToRole(
        roleId,
        selectedPermissionIds,
        role?.is_system || false,
        isSystemUser
      )
      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success",
          description: "Resource permissions assigned successfully",
        })
        setIsAssignModalOpen(false)
        refetch()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to assign permissions",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          <h2 className="text-xl font-bold">Role Details</h2>
        </div>
        <Card>
          <div className="p-8 text-center">Loading...</div>
        </Card>
      </div>
    )
  }

  if (!role) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          <h2 className="text-xl font-bold">Role Details</h2>
        </div>
        <Card>
          <div className="p-8 text-center text-gray-500">Role not found</div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          <h2 className="text-xl font-bold">Role Details</h2>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      <Tabs defaultValue="details" className="w-full">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="permissions">Resource Permissions</TabsTrigger>
        </TabsList>
        <TabsContent value="details">
          <Card>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Name</label>
                  <p className="mt-1 text-sm font-medium">{role.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">System Role</label>
                  <p className="mt-1">
                    <Badge variant={role.is_system ? "default" : "outline"}>
                      {role.is_system ? "Yes" : "No"}
                    </Badge>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Organization</label>
                  <p className="mt-1 text-sm">{role.organization_name || "System"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Created At</label>
                  <p className="mt-1 text-sm">{new Date(role.created_at).toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Updated At</label>
                  <p className="mt-1 text-sm">{new Date(role.updated_at).toLocaleString()}</p>
                </div>
                {role.deleted_at && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Deleted At</label>
                    <p className="mt-1 text-sm">{new Date(role.deleted_at).toLocaleString()}</p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </TabsContent>
        <TabsContent value="permissions">
          <Card>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Resource Permissions</h3>
                {(!role.is_system || isSystemUser) && (
                  <Button onClick={handleOpenAssignModal}>
                    Assign Resource Permissions
                  </Button>
                )}
              </div>
              {role.resource_permissions && role.resource_permissions.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Resource</TableHead>
                      <TableHead>Permission</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {role.resource_permissions.map((rp: any) => (
                      <TableRow key={rp.id}>
                        <TableCell className="font-mono text-xs">{rp.code}</TableCell>
                        <TableCell>
                          {rp.resource ? (
                            <div>
                              <div className="font-medium">{rp.resource.name}</div>
                              <div className="text-xs text-muted-foreground">{rp.resource.key}</div>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">N/A</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {rp.permission ? (
                            <div>
                              <div className="font-medium">{rp.permission.description}</div>
                              <div className="text-xs text-muted-foreground">{rp.permission.code}</div>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">N/A</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-gray-500">No resource permissions assigned</div>
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Assign Resource Permissions Modal */}
      <Dialog open={isAssignModalOpen} onOpenChange={setIsAssignModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Assign Resource Permissions</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {role?.is_system && !isSystemUser ? (
              <div className="text-center py-8 text-gray-500">
                Only system users can manage resource permissions for system roles.
              </div>
            ) : (
              <>
                <div className="flex items-center justify-end">
                  <Button
                    onClick={handleSaveAssignments}
                    disabled={isSaving}
                  >
                    <CheckIcon className="h-4 w-4 mr-2" />
                    Save Assignments
                  </Button>
                </div>
                {resourcePermissions && resourcePermissions.length > 0 ? (
                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12"></TableHead>
                          <TableHead>Code</TableHead>
                          <TableHead>Resource</TableHead>
                          <TableHead>Permission</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {resourcePermissions.map((rp: ResourcePermission) => {
                          const isSelected = selectedPermissionIds.includes(rp.id)
                          return (
                            <TableRow key={rp.id}>
                              <TableCell>
                                <Checkbox
                                  checked={isSelected}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setSelectedPermissionIds([...selectedPermissionIds, rp.id])
                                    } else {
                                      setSelectedPermissionIds(selectedPermissionIds.filter((id) => id !== rp.id))
                                    }
                                  }}
                                />
                              </TableCell>
                              <TableCell className="font-mono text-xs">{rp.code}</TableCell>
                              <TableCell>
                                {rp.resource ? (
                                  <div>
                                    <div className="font-medium">{rp.resource.name}</div>
                                    <div className="text-xs text-muted-foreground">{rp.resource.key}</div>
                                  </div>
                                ) : (
                                  <span className="text-muted-foreground">N/A</span>
                                )}
                              </TableCell>
                              <TableCell>
                                {rp.permission ? (
                                  <div>
                                    <div className="font-medium">{rp.permission.description}</div>
                                    <div className="text-xs text-muted-foreground">{rp.permission.code}</div>
                                  </div>
                                ) : (
                                  <span className="text-muted-foreground">N/A</span>
                                )}
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">No resource permissions available</div>
                )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

