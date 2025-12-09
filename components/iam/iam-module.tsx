"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User } from "./user"
import { Organization } from "./organization"
import { Role } from "./role"
import { Permission } from "./permission"
import { Resource } from "./resource"
import { useAuth } from "@/contexts/auth-context"
import { Shield } from "lucide-react"

export function IAMModule() {
  const { user } = useAuth()

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Shield className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Identity & Access Management</h1>
        </div>
        <p className="text-gray-600">
          Welcome, {user?.phone} | {user?.organization?.name || "System Organization"}
        </p>
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="organizations">Organizations</TabsTrigger>
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>
        <TabsContent value="users" className="space-y-4">
          <User />
        </TabsContent>
        <TabsContent value="organizations" className="space-y-4">
          <Organization />
        </TabsContent>
        <TabsContent value="roles" className="space-y-4">
          <Role />
        </TabsContent>
        <TabsContent value="permissions" className="space-y-4">
          <Permission />
        </TabsContent>
        <TabsContent value="resources" className="space-y-4">
          <Resource />
        </TabsContent>
      </Tabs>
    </div>
  )
}

