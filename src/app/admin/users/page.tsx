"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserCreateDialog } from "@/components/users/UserCreateDialog";
import { PermissionsDialog } from "@/components/users/PermissionsDialog";
import { toast } from "sonner";

export default function UsersPage() {
  const router = useRouter();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [permissionsOpen, setPermissionsOpen] = useState(false);

  // Add data fetching with React Query
  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await fetch("/api/admin/users");
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      return response.json();
    },
  });

  const handleDelete = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error();
      
      toast.success("User deleted successfully");
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  const handleManagePermissions = (user: any) => {
    setSelectedUser(user);
    setPermissionsOpen(true);
  };

  const handlePermissionsUpdate = () => {
    // Force refresh the page data
    router.refresh();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Users Management</h1>
          <Button onClick={() => setCreateDialogOpen(true)} className="bg-primary hover:bg-primary/90">
            Create User
          </Button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.map((user: any) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell className="capitalize">{user.role}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => handleManagePermissions(user)}
                      className="hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Manage Permissions
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(user.id)}
                      className="hover:bg-red-600"
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <UserCreateDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
        />

        {selectedUser && (
          <PermissionsDialog
            open={permissionsOpen}
            onOpenChange={setPermissionsOpen}
            userId={selectedUser.id}
            userName={selectedUser.name}
            onPermissionsUpdate={handlePermissionsUpdate}
          />
        )}
      </div>
    </AdminLayout>
  );
}