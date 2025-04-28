import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { 
  PlusCircle, 
  Pencil, 
  Trash2, 
  Search,
  X,
  ChevronLeft, 
  ChevronRight,
  Eye,
  AlertTriangle,
  User
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Define user type
type User = {
  id: number;
  name: string;
  email: string;
  role_id?: number;
  role?: string;
  created_at: string;
  status: 'active' | 'inactive';
};

// Define props type
type Props = {
  users: {
    data: User[];
    links: Array<{
      url?: string;
      label: string;
      active: boolean;
    }>;
    from: number;
    to: number;
    total: number;
    current_page: number;
    last_page: number;
  };
  roles: {
    id: number;
    name: string;
  }[];
};

export default function UserManagement({ users, roles }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [addUserDialog, setAddUserDialog] = useState(false);
  const [editUserDialog, setEditUserDialog] = useState(false);
  const [deleteUserDialog, setDeleteUserDialog] = useState(false);
  const [viewUserDialog, setViewUserDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  // Form for creating/editing users
  const { data, setData, post, put, processing, errors, reset } = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role_id: '',
    status: 'active' as 'active' | 'inactive',
  });

  // Form for deleting users
  const deleteForm = useForm({});

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = `/settings/user-management?search=${searchTerm}`;
  };

  const openEditDialog = (user: User) => {
    setSelectedUser(user);
    setData({
      name: user.name,
      email: user.email,
      password: '',
      password_confirmation: '',
      role_id: user.role_id ? user.role_id.toString() : '',
      status: user.status,
    });
    setEditUserDialog(true);
  };

  const openViewDialog = (user: User) => {
    setSelectedUser(user);
    setViewUserDialog(true);
  };

  const openDeleteDialog = (user: User) => {
    setSelectedUser(user);
    setDeleteUserDialog(true);
  };

  const submitForm = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editUserDialog && selectedUser) {
      put(route('user-management.update', selectedUser.id), {
        onSuccess: () => {
          setEditUserDialog(false);
          reset();
          toast.success("User updated successfully");
        },
        onError: () => {
          toast.error("Failed to update user");
        }
      });
    } else {
      post(route('user-management.store'), {
        onSuccess: () => {
          setAddUserDialog(false);
          reset();
          toast.success("User created successfully");
        },
        onError: () => {
          toast.error("Failed to create user");
        }
      });
    }
  };

  const handleDelete = () => {
    if (selectedUser) {
      deleteForm.delete(route('user-management.destroy', selectedUser.id), {
        onSuccess: () => {
          setDeleteUserDialog(false);
          toast.success("User deleted successfully");
        },
        onError: () => {
          toast.error("Failed to delete user");
        }
      });
    }
  };

  const resetForm = () => {
    reset();
    setSelectedUser(null);
  };

  // Helper function to get role name based on role_id
  const getRoleName = (roleId: number | undefined) => {
    if (!roleId) return '-';
    const role = roles.find(r => r.id === roleId);
    return role ? role.name : '-';
  };

  return (
    <>
      <Head title="User Management" />
      
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      
      <div className="px-6 py-4">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <User className="mr-3 h-7 w-7 text-primary" />
            <h1 className="text-2xl font-bold">User Management</h1>
          </div>
          <Button 
            onClick={() => setAddUserDialog(true)}
            className="bg-green-600 hover:bg-green-700 text-white transition-colors duration-200"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>

        {/* Search and filter */}
        <div className="flex mb-6 gap-4">
          <form onSubmit={handleSearch} className="flex items-center w-full max-w-md relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search users..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                type="button" 
                className="absolute right-2.5 top-2.5"
                onClick={() => setSearchTerm('')}
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
          </form>
        </div>

        {/* Users Table */}
        <div className="rounded-md border shadow-sm">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                users.data.map((user) => (
                  <TableRow key={user.id} className="hover:bg-muted/30 transition-colors duration-200">
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{typeof user.role === 'string' ? user.role : (getRoleName(user.role_id) || '-')}</TableCell>
                    <TableCell>
                      <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                        {user.status === 'active' ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-1">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openViewDialog(user)}
                                className="h-8 w-8 p-0 text-slate-500 hover:text-slate-600 hover:bg-slate-100"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>View Details</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openEditDialog(user)}
                                className="h-8 w-8 p-0 text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Edit User</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openDeleteDialog(user)}
                                className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Delete User</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {users.total > 0 && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-medium">{users.from}</span> to{" "}
              <span className="font-medium">{users.to}</span> of{" "}
              <span className="font-medium">{users.total}</span> results
            </div>
            <div className="flex items-center space-x-2">
              {users.links.map((link, i) => {
                if (link.url === null) {
                  return (
                    <Button 
                      key={i}
                      variant="outline" 
                      size="icon" 
                      disabled
                    >
                      {i === 0 ? (
                        <ChevronLeft className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                  );
                }

                if (i === 0 || i === users.links.length - 1) {
                  return (
                    <Link key={i} href={link.url ?? '#'}>
                        <Button 
                        variant="outline" 
                        size="icon"
                        disabled={!link.url}
                        >
                        {i === 0 ? (
                          <ChevronLeft className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>
                    </Link>
                  );
                }

                return (
                  <Link key={i} href={link.url ?? '#'}>
                    <Button 
                      variant={link.active ? "default" : "outline"}
                    >
                      {link.label}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Add User Dialog */}
      <Dialog open={addUserDialog} onOpenChange={setAddUserDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <User className="mr-2 h-5 w-5 text-green-500" />
              Add New User
            </DialogTitle>
            <DialogDescription>
              Create a new user account with role and permissions.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submitForm}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={data.name}
                  onChange={e => setData('name', e.target.value)}
                  placeholder="Enter user's name"
                  className="focus-visible:ring-primary"
                />
                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={data.email}
                  onChange={e => setData('email', e.target.value)}
                  placeholder="Enter user's email"
                  className="focus-visible:ring-primary"
                />
                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={data.password}
                  onChange={e => setData('password', e.target.value)}
                  placeholder="Create a password"
                  className="focus-visible:ring-primary"
                />
                {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="password_confirmation">Confirm Password</Label>
                <Input
                  id="password_confirmation"
                  type="password"
                  value={data.password_confirmation}
                  onChange={e => setData('password_confirmation', e.target.value)}
                  placeholder="Confirm password"
                  className="focus-visible:ring-primary"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <Select value={data.role_id} onValueChange={(value) => setData('role_id', value)}>
                  <SelectTrigger className="focus-visible:ring-primary">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.id.toString()}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.role_id && <p className="text-sm text-destructive">{errors.role_id}</p>}
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select value={data.status} onValueChange={(value) => setData('status', value as 'active' | 'inactive')}>
                  <SelectTrigger className="focus-visible:ring-primary">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                {errors.status && <p className="text-sm text-destructive">{errors.status}</p>}
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setAddUserDialog(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={processing}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {processing ? 'Creating...' : 'Create User'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={editUserDialog} onOpenChange={setEditUserDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Pencil className="mr-2 h-5 w-5 text-blue-500" />
              Edit User
            </DialogTitle>
            <DialogDescription>
              Update user information and permissions.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submitForm}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={data.name}
                  onChange={e => setData('name', e.target.value)}
                  placeholder="Enter user's name"
                  className="focus-visible:ring-blue-500"
                />
                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={data.email}
                  onChange={e => setData('email', e.target.value)}
                  placeholder="Enter user's email"
                  className="focus-visible:ring-blue-500"
                />
                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-password">
                  Password <span className="text-sm text-muted-foreground">(leave empty to keep current)</span>
                </Label>
                <Input
                  id="edit-password"
                  type="password"
                  value={data.password}
                  onChange={e => setData('password', e.target.value)}
                  placeholder="New password"
                  className="focus-visible:ring-blue-500"
                />
                {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-password_confirmation">Confirm Password</Label>
                <Input
                  id="edit-password_confirmation"
                  type="password"
                  value={data.password_confirmation}
                  onChange={e => setData('password_confirmation', e.target.value)}
                  placeholder="Confirm new password"
                  className="focus-visible:ring-blue-500"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-role">Role</Label>
                <Select value={data.role_id} onValueChange={(value) => setData('role_id', value)}>
                  <SelectTrigger className="focus-visible:ring-blue-500">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.id.toString()}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.role_id && <p className="text-sm text-destructive">{errors.role_id}</p>}
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select value={data.status} onValueChange={(value) => setData('status', value as 'active' | 'inactive')}>
                  <SelectTrigger className="focus-visible:ring-blue-500">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                {errors.status && <p className="text-sm text-destructive">{errors.status}</p>}
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setEditUserDialog(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={processing}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                {processing ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View User Dialog */}
      <Dialog open={viewUserDialog} onOpenChange={setViewUserDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Eye className="mr-2 h-5 w-5 text-slate-500" />
              User Details
            </DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="py-4">
              <div className="rounded-md bg-muted p-6 space-y-4">
                <div className="flex justify-center mb-4">
                  <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-10 w-10 text-primary" />
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <h3 className="text-xs font-medium text-muted-foreground uppercase">Name</h3>
                    <p className="text-base font-medium">{selectedUser.name}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-medium text-muted-foreground uppercase">Email</h3>
                    <p className="text-base">{selectedUser.email}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-medium text-muted-foreground uppercase">Role</h3>
                    <p className="text-base">{selectedUser.role || getRoleName(selectedUser.role_id)}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-medium text-muted-foreground uppercase">Status</h3>
                    <Badge variant={selectedUser.status === 'active' ? 'default' : 'secondary'}>
                      {selectedUser.status === 'active' ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <div>
                    <h3 className="text-xs font-medium text-muted-foreground uppercase">Created</h3>
                    <p className="text-base">{new Date(selectedUser.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-6 gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setViewUserDialog(false)}
                >
                  Close
                </Button>
                <Button 
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={() => {
                    setViewUserDialog(false);
                    openEditDialog(selectedUser);
                  }}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit User
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={deleteUserDialog} onOpenChange={setDeleteUserDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center text-destructive">
              <Trash2 className="mr-2 h-5 w-5" />
              Delete User
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedUser && (
              <div className="rounded-md bg-destructive/10 border border-destructive/20 p-4">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-destructive mr-2" />
                  <p className="font-medium text-destructive">You are about to delete the following user:</p>
                </div>
                <div className="mt-3 space-y-2 pl-7">
                  <p><strong>Name:</strong> {selectedUser.name}</p>
                  <p><strong>Email:</strong> {selectedUser.email}</p>
                  <p><strong>Role:</strong> {selectedUser.role || getRoleName(selectedUser.role_id)}</p>
                  <p><strong>Status:</strong> {selectedUser.status === 'active' ? 'Active' : 'Inactive'}</p>
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setDeleteUserDialog(false)}
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              variant="destructive" 
              onClick={handleDelete}
              disabled={deleteForm.processing}
              className="hover:bg-red-600"
            >
              {deleteForm.processing ? 'Deleting...' : 'Delete User'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}