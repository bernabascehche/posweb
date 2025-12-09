"use client"

import { useParams, useRouter } from "next/navigation"
import { useApi } from "@/hooks/use-api"
import { iamAPI } from "@/lib/api-client"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Building2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OrganizationUsers } from "@/components/iam/organization-users"

export default function OrganizationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const orgId = params.id as string

  const { data: organization, loading } = useApi(() => iamAPI.getOrganizationById(orgId))

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          <h2 className="text-xl font-bold">Organization Details</h2>
        </div>
        <Card>
          <div className="p-8 text-center">Loading...</div>
        </Card>
      </div>
    )
  }

  if (!organization) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          <h2 className="text-xl font-bold">Organization Details</h2>
        </div>
        <Card>
          <div className="p-8 text-center text-gray-500">Organization not found</div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          <h2 className="text-xl font-bold">Organization Details</h2>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      <Tabs defaultValue="details" className="w-full">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>
        <TabsContent value="details">
          <Card>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Name</label>
                  <p className="mt-1 text-sm font-medium">{organization.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Tenant ID</label>
                  <p className="mt-1 text-sm font-mono">{organization.tenant_id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <p className="mt-1">
                    <Badge variant={organization.deleted_at ? "destructive" : "default"}>
                      {organization.deleted_at ? "Deleted" : "Active"}
                    </Badge>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Created At</label>
                  <p className="mt-1 text-sm">{new Date(organization.created_at).toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Updated At</label>
                  <p className="mt-1 text-sm">{new Date(organization.updated_at).toLocaleString()}</p>
                </div>
                {organization.deleted_at && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Deleted At</label>
                    <p className="mt-1 text-sm">{new Date(organization.deleted_at).toLocaleString()}</p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </TabsContent>
        <TabsContent value="users">
          <OrganizationUsers organizationId={orgId} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

