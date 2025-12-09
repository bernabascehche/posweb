"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useApi } from "@/hooks/use-api"
import { iamAPI } from "@/lib/api-client"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Users, CheckIcon } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import type { Role } from "@/lib/types"

export default function UserDetailPage() {
  const params = useParams()
  const router = useRouter()
  const userId = params.id as string
  const { toast } = useToast()

  const { data: user, loading, refetch } = useApi(() => iamAPI.getUserById(userId))
  const { data: allRoles } = useApi(() => iamAPI.getRoles())

  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([])
  const [isSaving, setIsSaving] = useState(false)

  // Initialize selected roles from user's current roles
  useEffect(() => {
    if (user?.roles) {
      setSelectedRoleIds(user.roles.map((r) => r.id))
    }
  }, [user])

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          <h2 className="text-xl font-bold">User Details</h2>
        </div>
        <Card>
          <div className="p-8 text-center">Loading...</div>
        </Card>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          <h2 className="text-xl font-bold">User Details</h2>
        </div>
        <Card>
          <div className="p-8 text-center text-gray-500">User not found</div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          <h2 className="text-xl font-bold">User Details</h2>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      <Tabs defaultValue="details" className="w-full">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="roles">Roles</TabsTrigger>
        </TabsList>
        <TabsContent value="details">
          <Card>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Phone</label>
                  <p className="mt-1 text-sm">{user.phone}</p>
                </div>
                {(user as any).firstname || (user as any).middlename || (user as any).lastname ? (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Name</label>
                    <p className="mt-1 text-sm">
                      {`${(user as any).firstname || ""} ${(user as any).middlename || ""} ${(user as any).lastname || ""}`.trim()}
                    </p>
                  </div>
                ) : null}
                {user.is_system && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">System User</label>
                    <p className="mt-1">
                      <Badge variant={user.is_system ? "default" : "outline"}>
                        Yes
                      </Badge>
                    </p>
                  </div>
                )}
                {user.organization_name && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Organization Name</label>
                    <p className="mt-1 text-sm">{user.organization_name}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Created At</label>
                  <p className="mt-1 text-sm">{new Date(user.created_at).toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Updated At</label>
                  <p className="mt-1 text-sm">{new Date(user.updated_at).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
        <TabsContent value="roles">
          <Card>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Roles</h3>
                <Button
                  onClick={async () => {
                    setIsSaving(true)
                    try {
                      const result = await iamAPI.assignRolesToUser(userId, selectedRoleIds)
                      if (result.error) {
                        toast({
                          title: "Error",
                          description: result.error,
                          variant: "destructive",
                        })
                      } else {
                        toast({
                          title: "Success",
                          description: "Roles assigned successfully",
                        })
                        refetch()
                      }
                    } catch (error) {
                      toast({
                        title: "Error",
                        description: error instanceof Error ? error.message : "Failed to assign roles",
                        variant: "destructive",
                      })
                    } finally {
                      setIsSaving(false)
                    }
                  }}
                  disabled={isSaving}
                >
                  <CheckIcon className="h-4 w-4 mr-2" />
                  Save Assignments
                </Button>
              </div>
              {allRoles && allRoles.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12"></TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>System</TableHead>
                      <TableHead>Created At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allRoles.map((role: Role) => {
                      const isSelected = selectedRoleIds.includes(role.id)
                      return (
                        <TableRow key={role.id}>
                          <TableCell>
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedRoleIds([...selectedRoleIds, role.id])
                                } else {
                                  setSelectedRoleIds(selectedRoleIds.filter((id) => id !== role.id))
                                }
                              }}
                            />
                          </TableCell>
                          <TableCell className="font-medium">{role.name}</TableCell>
                          <TableCell>
                            <Badge variant={role.is_system ? "default" : "outline"}>
                              {role.is_system ? "System" : "Custom"}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(role.created_at).toLocaleString()}</TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-gray-500">No roles available</div>
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

