"use client"

import { useState } from "react"
import AdminLayout from "@/components/layout/AdminLayout"
import { useQuery } from "@tanstack/react-query"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Trash2, Store } from "lucide-react"
import Image from "next/image"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { BrandForm } from "@/components/brands/BrandForm"
import { toast } from "sonner"
import { motion } from "framer-motion"

interface Brand {
  id: string
  name: string
  description: string | null
  imageUrl: string | null
  active: boolean
}

export default function BrandsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null)

  const { data: brands = [], isLoading, refetch } = useQuery<Brand[]>({
    queryKey: ["brands"],
    queryFn: async () => {
      const response = await fetch("/api/brands")
      if (!response.ok) throw new Error("Failed to fetch brands")
      return response.json()
    },
  })

  const filteredBrands = brands.filter(brand => 
    brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    brand.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSuccess = () => {
    setIsAddDialogOpen(false)
    setEditingBrand(null)
    refetch()
  }

  const handleDelete = async (brandId: string) => {
    if (!confirm('Are you sure you want to delete this brand?')) return
    try {
      const response = await fetch(`/api/brands/${brandId}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete brand')
      toast.success('Brand deleted successfully')
      refetch()
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const toggleActive = async (brand: Brand) => {
    try {
      const response = await fetch(`/api/brands/${brand.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !brand.active }),
      })
      if (!response.ok) throw new Error('Failed to update status')
      refetch()
      toast.success(`Brand ${!brand.active ? 'activated' : 'deactivated'} successfully`)
    } catch (error) {
      toast.error('Failed to update status')
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Brands</h1>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Brand
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Brand</DialogTitle>
              </DialogHeader>
              <BrandForm 
                onSuccess={handleSuccess}
                onCancel={() => setIsAddDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        <Input
          placeholder="Search brands..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />

        {isLoading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBrands.map((brand) => (
              <motion.div
                key={brand.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {brand.imageUrl ? (
                        <Image
                          src={brand.imageUrl}
                          alt={brand.name}
                          width={48}
                          height={48}
                          className="rounded-lg"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Store className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-medium">{brand.name}</h3>
                        <p className="text-sm text-gray-500 line-clamp-1">
                          {brand.description || 'No description'}
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={brand.active}
                      onCheckedChange={() => toggleActive(brand)}
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-2 pt-4 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingBrand(brand)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(brand.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingBrand} onOpenChange={() => setEditingBrand(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Brand</DialogTitle>
          </DialogHeader>
          {editingBrand && (
            <BrandForm
              initialData={editingBrand}
              onSuccess={handleSuccess}
              onCancel={() => setEditingBrand(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}