"use client";

import { useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface Permission {
  resource: string;
  action: string;
}

interface User {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  permissions: Permission[];
}

const RESOURCES = {
  products: "Products",
  categories: "Categories",
  orders: "Orders",
  customers: "Customers",
  users: "Users",
  settings: "Settings",
  reports: "Reports",
  locations: "Locations",  // Add this line
};

const ACTIONS = {
  create: "Create",
  read: "Read",
  update: "Update",
  delete: "Delete"
};

export default function SettingsPage() {
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const { data: users, refetch } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await fetch("/api/users");
      if (!response.ok) throw new Error("Failed to fetch users");
      return response.json();
    },
  });

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        throw new Error("Failed to create user");
      }

      toast.success("User created successfully");
      setIsAddUserOpen(false);
      setNewUser({ name: "", email: "", password: "", role: "user" });
      refetch();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user role");
      }

      toast.success("User role updated successfully");
      refetch();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleUpdatePermissions = async (userId: string, permissions: Permission[]) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/permissions`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ permissions })
      });
      
      if (!res.ok) throw new Error('Failed to update permissions');
      
      toast.success('Permissions updated successfully');
      refetch();
      setOpen(false);
    } catch (error) {
      toast.error('Failed to update permissions');
    }
  };

  const hasPermission = (permissions: Permission[] | undefined, resource: string, action: string) => {
    if (!permissions) return false;
    return permissions.some(p => p.resource === resource && p.action === action);
  };

  const togglePermission = (
    user: User,
    resource: string,
    action: string
  ) => {
    if (!selectedUser) return;

    let newPermissions = [...(selectedUser.permissions || [])];
    const exists = hasPermission(newPermissions, resource, action);

    if (exists) {
      newPermissions = newPermissions.filter(
        p => !(p.resource === resource && p.action === action)
      );
    } else {
      newPermissions.push({ resource, action });
    }

    setSelectedUser({ ...selectedUser, permissions: newPermissions });
  };

  const toggleAllForResource = (resource: string) => {
    if (!selectedUser) return;
    
    let newPermissions = [...(selectedUser.permissions || [])];
    const hasAllActions = Object.keys(ACTIONS).every(action => 
      hasPermission(newPermissions, resource, action)
    );

    if (hasAllActions) {
      // Remove all permissions for this resource
      newPermissions = newPermissions.filter(p => p.resource !== resource);
    } else {
      // Add all missing permissions for this resource
      Object.keys(ACTIONS).forEach(action => {
        if (!hasPermission(newPermissions, resource, action)) {
          newPermissions.push({ resource, action });
        }
      });
    }

    setSelectedUser({ ...selectedUser, permissions: newPermissions });
  };

  const toggleAllForAction = (action: string) => {
    if (!selectedUser) return;
    
    let newPermissions = [...(selectedUser.permissions || [])];
    const hasAllResources = Object.keys(RESOURCES).every(resource => 
      hasPermission(newPermissions, resource, action)
    );

    if (hasAllResources) {
      // Remove this action from all resources
      newPermissions = newPermissions.filter(p => p.action !== action);
    } else {
      // Add this action to all resources
      Object.keys(RESOURCES).forEach(resource => {
        if (!hasPermission(newPermissions, resource, action)) {
          newPermissions.push({ resource, action });
        }
      });
    }

    setSelectedUser({ ...selectedUser, permissions: newPermissions });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">User Management</h1>
          <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
            <DialogTrigger asChild>
              <Button>Add New User</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddUser} className="space-y-4">
                <div>
                  <Input
                    placeholder="Name"
                    value={newUser.name}
                    onChange={(e) =>
                      setNewUser({ ...newUser, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Input
                    type="email"
                    placeholder="Email"
                    value={newUser.email}
                    onChange={(e) =>
                      setNewUser({ ...newUser, email: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Input
                    type="password"
                    placeholder="Password"
                    value={newUser.password}
                    onChange={(e) =>
                      setNewUser({ ...newUser, password: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Select
                    value={newUser.role}
                    onValueChange={(value) =>
                      setNewUser({ ...newUser, role: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full">
                  Create User
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Select
                      value={user.role}
                      onValueChange={(value) => handleUpdateRole(user.id, value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Dialog open={open} onOpenChange={setOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          onClick={() => setSelectedUser(user)}
                        >
                          Manage Permissions
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>Manage Permissions - {selectedUser?.name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="border rounded-lg">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Resource</TableHead>
                                  {Object.entries(ACTIONS).map(([key, label]) => (
                                    <TableHead key={key}>
                                      <div className="flex flex-col items-center">
                                        <span>{label}</span>
                                        <input
                                          type="checkbox"
                                          checked={selectedUser ? Object.keys(RESOURCES).every(resource => 
                                            hasPermission(selectedUser.permissions, resource, key)
                                          ) : false}
                                          onChange={() => toggleAllForAction(key)}
                                          className="mt-2 h-4 w-4 rounded border-gray-300"
                                        />
                                      </div>
                                    </TableHead>
                                  ))}
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {Object.entries(RESOURCES).map(([resource, label]) => (
                                  <TableRow key={resource}>
                                    <TableCell className="font-medium">
                                      <div className="flex items-center gap-2">
                                        <input
                                          type="checkbox"
                                          checked={selectedUser ? Object.keys(ACTIONS).every(action => 
                                            hasPermission(selectedUser.permissions, resource, action)
                                          ) : false}
                                          onChange={() => toggleAllForResource(resource)}
                                          className="h-4 w-4 rounded border-gray-300"
                                        />
                                        {label}
                                      </div>
                                    </TableCell>
                                    {Object.entries(ACTIONS).map(([action, _]) => (
                                      <TableCell key={action} className="text-center">
                                        <input
                                          type="checkbox"
                                          checked={selectedUser ? hasPermission(selectedUser?.permissions, resource, action) : false}
                                          onChange={() => selectedUser && togglePermission(selectedUser, resource, action)}
                                          className="h-4 w-4 rounded border-gray-300"
                                        />
                                      </TableCell>
                                    ))}
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              onClick={() => setOpen(false)}
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={() => selectedUser && handleUpdatePermissions(selectedUser.id, selectedUser.permissions)}
                            >
                              Save Changes
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button variant="destructive" size="sm">
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
}