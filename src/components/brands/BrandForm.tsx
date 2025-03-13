"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { uploadImage } from "@/lib/uploadImage"
import { toast } from "sonner"
import Image from "next/image"

interface BrandFormProps {
  initialData?: {
    id?: string
    name: string
    description: string
    imageUrl: string
    active?: boolean
  }
  onSuccess?: () => void
  onCancel?: () => void
}

export function BrandForm({ initialData, onSuccess, onCancel }: BrandFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    imageUrl: initialData?.imageUrl || "",
    active: initialData?.active ?? true,
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState(initialData?.imageUrl || "")

  const isEditing = !!initialData

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      // Create preview URL
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let imageUrl = formData.imageUrl
      
      // If there's a new image file, upload it
      if (imageFile) {
        imageUrl = await uploadImage(imageFile)
      }

      const response = await fetch(`/api/brands${isEditing ? `/${initialData.id}` : ''}`, {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          imageUrl,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save brand')
      }

      toast.success(isEditing ? 'Brand updated successfully' : 'Brand created successfully')
      onSuccess?.()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium">Brand Name</label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter brand name"
          required
        />
      </div>
      
      <div>
        <label className="text-sm font-medium">Description</label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Enter brand description"
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Brand Image</label>
        <div className="flex items-center gap-4">
          {previewUrl && (
            <div className="relative w-20 h-20">
              <Image
                src={previewUrl}
                alt="Preview"
                fill
                className="object-cover rounded-lg"
              />
            </div>
          )}
          <div className="flex-1">
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="cursor-pointer"
            />
          </div>
        </div>
        <span className="text-sm text-gray-500">Or provide an image URL</span>
        <Input
          value={formData.imageUrl}
          onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
          placeholder="Enter image URL"
        />
      </div>

      <div className="flex items-center justify-between rounded-lg border p-4">
        <div className="space-y-0.5">
          <label className="text-sm font-medium">Active Status</label>
          <div className="text-sm text-gray-500">
            Brand will be available for selection when active
          </div>
        </div>
        <Switch
          checked={formData.active}
          onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
        />
      </div>

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Brand' : 'Create Brand')}
        </Button>
      </div>
    </form>
  )
}