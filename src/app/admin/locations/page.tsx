// filepath: /workspaces/pos/src/app/admin/locations/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { pakistanCities } from "@/data/pakistan-cities";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner"; // Replace useToast import with this
import { Loader2 } from "lucide-react";
import AdminLayout from "@/components/layout/AdminLayout"; // Add this import

export default function LocationsPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    license_number: "",
    stn: "",
    ntn: "",
    city: "",
    state: "",
    country: "Pakistan", // Default
    region: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch("/api/locations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to create location");
      }

      toast.success("Location created successfully");  // Changed this line

      // Reset form
      setFormData({
        name: "",
        address: "",
        license_number: "",
        stn: "",
        ntn: "",
        city: "",
        state: "",
        country: "Pakistan",
        region: "",
      });
    } catch (error) {
      toast.error("Something went wrong");  // Changed this line
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>  {/* Wrap the content with AdminLayout */}
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Create New Location</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                placeholder="Location Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
              <Input
                placeholder="Address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                required
              />
              <Input
                placeholder="License Number"
                value={formData.license_number}
                onChange={(e) =>
                  setFormData({ ...formData, license_number: e.target.value })
                }
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="STN"
                  value={formData.stn}
                  onChange={(e) =>
                    setFormData({ ...formData, stn: e.target.value })
                  }
                  required
                />
                <Input
                  placeholder="NTN"
                  value={formData.ntn}
                  onChange={(e) =>
                    setFormData({ ...formData, ntn: e.target.value })
                  }
                  required
                />
              </div>
              <Select
                value={formData.city}
                onValueChange={(value) =>
                  setFormData({ ...formData, city: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select City" />
                </SelectTrigger>
                <SelectContent>
                  {pakistanCities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="State"
                  value={formData.state}
                  onChange={(e) =>
                    setFormData({ ...formData, state: e.target.value })
                  }
                  required
                />
                <Input
                  placeholder="Region"
                  value={formData.region}
                  onChange={(e) =>
                    setFormData({ ...formData, region: e.target.value })
                  }
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Location"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}