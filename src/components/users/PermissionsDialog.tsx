"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

const AVAILABLE_PERMISSIONS = [
  { resource: "admin", action: "access_admin_panel", label: "Access Admin Panel" },
  { resource: "locations", action: "view", label: "View Locations" },
  { resource: "locations", action: "edit", label: "Edit Locations" },
  { resource: "users", action: "view", label: "View Users" },
  { resource: "users", action: "edit", label: "Edit Users" },
  { resource: "settings", action: "view", label: "View Settings" },
  { resource: "settings", action: "edit", label: "Edit Settings" }
]

interface PermissionsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: string
  userName: string
  onPermissionsUpdate?: () => void
}

export function PermissionsDialog({ 
  open, 
  onOpenChange, 
  userId, 
  userName,
  onPermissionsUpdate 
}: PermissionsDialogProps) {
  const [loading, setLoading] = useState(false)
  const [fetchingPermissions, setFetchingPermissions] = useState(false)
  const [selectedPermissions, setSelectedPermissions] = useState<any[]>([])

  useEffect(() => {
    const fetchPermissions = async () => {
      if (!userId || !open) return
      
      setFetchingPermissions(true)
      try {
        const response = await fetch(`/api/admin/users/${userId}`)
        if (!response.ok) throw new Error()
        const data = await response.json()
        setSelectedPermissions(data.permissions || [])
      } catch (error) {
        console.error('Fetch error:', error)
        toast.error("Failed to fetch permissions")
      } finally {
        setFetchingPermissions(false)
      }
    }

    fetchPermissions()
  }, [userId, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ permissions: selectedPermissions }),
      })

      if (!response.ok) throw new Error()

      toast.success("Permissions updated successfully")
      onOpenChange(false)
      // Notify parent component to refresh data
      onPermissionsUpdate?.()
    } catch (error) {
      console.error('Update error:', error)
      toast.error("Failed to update permissions")
    } finally {
      setLoading(false)
    }
  }

  const isPermissionSelected = (permission: any) =>
    selectedPermissions.some(
      (p) => p.resource === permission.resource && p.action === permission.action
    )

  const togglePermission = (permission: any) => {
    if (isPermissionSelected(permission)) {
      setSelectedPermissions(selectedPermissions.filter(
        (p) => !(p.resource === permission.resource && p.action === permission.action)
      ))
    } else {
      setSelectedPermissions([...selectedPermissions, permission])
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Permissions - {userName}</DialogTitle>
        </DialogHeader>
        
        {fetchingPermissions ? (
          <div className="flex items-center justify-center p-6">
            <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-3 max-h-[60vh] overflow-y-auto p-2">
              {AVAILABLE_PERMISSIONS.map((permission) => (
                <label
                  key={`${permission.resource}-${permission.action}`}
                  className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Checkbox
                    checked={isPermissionSelected(permission)}
                    onCheckedChange={() => togglePermission(permission)}
                  />
                  <span className="text-sm font-medium">
                    {permission.label}
                  </span>
                </label>
              ))}
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}