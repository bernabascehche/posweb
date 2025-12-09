"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { iamAPI } from "@/lib/api-client"
import type { LoginRequest } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { LogIn } from "lucide-react"

interface LoginProps {
  onLoginSuccess?: () => void
}

export function Login({ onLoginSuccess }: LoginProps) {
  const [formData, setFormData] = useState<LoginRequest>({
    phone: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await iamAPI.login(formData)
      if (result.error) {
        toast({
          title: "Login Failed",
          description: result.error || "Invalid phone or password",
          variant: "destructive",
        })
      } else if (result.data) {
        toast({
          title: "Login Successful",
          description: `Welcome, ${result.data.user.phone || result.data.user.phone}!`,
        })
        onLoginSuccess?.()
      }
    } catch (error) {
      toast({
        title: "Login Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[400px] p-4">
      <Card className="w-full max-w-md p-6">
        <div className="flex items-center gap-3 mb-6">
          <LogIn className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Login</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="text"
              placeholder="Enter your phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              disabled={loading}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </Card>
    </div>
  )
}

