"use client"

import { useParams, useRouter } from "next/navigation"
import { useApi } from "@/hooks/use-api"
import { iamAPI } from "@/lib/api-client"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Folder } from "lucide-react"

export default function ResourceDetailPage() {
  const params = useParams()
  const router = useRouter()
  const resourceId = params.id as string

  const { data: resource, loading } = useApi(() => iamAPI.getResourceById(resourceId))

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Folder className="h-5 w-5" />
          <h2 className="text-xl font-bold">Resource Details</h2>
        </div>
        <Card>
          <div className="p-8 text-center">Loading...</div>
        </Card>
      </div>
    )
  }

  if (!resource) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Folder className="h-5 w-5" />
          <h2 className="text-xl font-bold">Resource Details</h2>
        </div>
        <Card>
          <div className="p-8 text-center text-gray-500">Resource not found</div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Folder className="h-5 w-5" />
          <h2 className="text-xl font-bold">Resource Details</h2>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      <Card>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Key</label>
              <p className="mt-1 text-sm font-mono">{resource.key}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Name</label>
              <p className="mt-1 text-sm font-medium">{resource.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Status</label>
              <p className="mt-1">
                <Badge variant={resource.deleted_at ? "destructive" : "default"}>
                  {resource.deleted_at ? "Deleted" : "Active"}
                </Badge>
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Created At</label>
              <p className="mt-1 text-sm">{new Date(resource.created_at).toLocaleString()}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Updated At</label>
              <p className="mt-1 text-sm">{new Date(resource.updated_at).toLocaleString()}</p>
            </div>
            {resource.deleted_at && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Deleted At</label>
                <p className="mt-1 text-sm">{new Date(resource.deleted_at).toLocaleString()}</p>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}

