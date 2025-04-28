// resources/js/pages/Settings/RoleManagement.tsx
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
  MoreHorizontal,
  Shield,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  AlertTriangle,
  Info,
  Eye
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Define role type
type Role = {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
  users_count?: number;
};

// Define props type
type Props = {
  roles: {
    data: Role[];
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
};

export default function RoleManagement({ roles }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [addRoleDialog, setAddRoleDialog] = useState(false);
  const [editRoleDialog, setEditRoleDialog] = useState(false);
  const [deleteRoleDialog, setDeleteRoleDialog] = useState(false);
  const [viewRoleDialog, setViewRoleDialog] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  
  // Form for creating/editing roles
  const { data, setData, post, put, processing, errors, reset } = useForm({
    name: '',
    description: '',
  });

  // Form for deleting roles
  const deleteForm = useForm({});

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = `/settings/role-management?search=${searchTerm}`;
  };

  const openEditDialog = (role: Role) => {
    setSelectedRole(role);
    setData({
      name: role.name,
      description: role.description || '',
    });
    setEditRoleDialog(true);
  };

  const openViewDialog = (role: Role) => {
    setSelectedRole(role);
    setViewRoleDialog(true);
  };

  const openDeleteDialog = (role: Role) => {
    setSelectedRole(role);
    setDeleteRoleDialog(true);
  };

  const submitForm = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editRoleDialog && selectedRole) {
      put(route('role-management.update', selectedRole.id), {
        onSuccess: () => {
          setEditRoleDialog(false);
          reset();
          toast.success("Role updated successfully");
        },
        onError: (errors) => {
          toast.error("Failed to update role");
        }
      });
    } else {
      post(route('role-management.store'), {
        onSuccess: () => {
          setAddRoleDialog(false);
          reset();
          toast.success("Role created successfully");
        },
        onError: (errors) => {
          toast.error("Failed to create role");
        }
      });
    }
  };

  const handleDelete = () => {
    if (selectedRole) {
      deleteForm.delete(route('role-management.destroy', selectedRole.id), {
        onSuccess: () => {
          setDeleteRoleDialog(false);
          toast.success("Role deleted successfully");
        },
        onError: () => {
          toast.error("Failed to delete role. Make sure no users are assigned to this role.");
        }
      });
    }
  };

  const resetForm = () => {
    reset();
    setSelectedRole(null);
  };
  
  // Helper function to get role icon based on name
  const getRoleIcon = (roleName: string) => {
    const name = roleName.toLowerCase();
    if (name.includes('admin')) return <ShieldAlert className="h-4 w-4 text-red-500" />;
    if (name.includes('manager')) return <ShieldCheck className="h-4 w-4 text-blue-500" />;
    return <Shield className="h-4 w-4 text-green-500" />;
  };

  return (
    <>
      <Head title="Role Management" />
      
      {/* Tambahkan ToastContainer untuk menampilkan notifikasi */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      
      <div className="px-6 py-4">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <ShieldCheck className="mr-3 h-7 w-7 text-primary" />
            <h1 className="text-2xl font-bold">Role Management</h1>
          </div>
          <Button 
            onClick={() => setAddRoleDialog(true)}
            className="bg-green-600 hover:bg-green-700 text-white transition-colors duration-200"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Role
          </Button>
        </div>

        {/* Search and filter */}
        <div className="flex mb-6 gap-4">
          <form onSubmit={handleSearch} className="flex items-center w-full max-w-md relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search roles..."
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

        {/* Roles Table */}
        <div className="rounded-md border shadow-sm">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Role</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Users</TableHead>
                <TableHead className="text-right pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No roles found
                  </TableCell>
                </TableRow>
              ) : (
                roles.data.map((role) => (
                  <TableRow key={role.id} className="hover:bg-muted/30 transition-colors duration-200">
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        {getRoleIcon(role.name)}
                        <span className="ml-2">{role.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-md truncate">{role.description || '-'}</TableCell>
                    <TableCell>{new Date(role.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {role.users_count !== undefined ? (
                        <div className="flex items-center">
                          <UserCheck className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>{role.users_count}</span>
                        </div>
                      ) : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-1">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openViewDialog(role)}
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
                                onClick={() => openEditDialog(role)}
                                className="h-8 w-8 p-0 text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Edit Role</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openDeleteDialog(role)}
                                className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Delete Role</p>
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
        {roles.total > 0 && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-medium">{roles.from}</span> to{" "}
              <span className="font-medium">{roles.to}</span> of{" "}
              <span className="font-medium">{roles.total}</span> results
            </div>
            <div className="flex items-center space-x-2">
              {roles.links.map((link, i) => {
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

                // Handle "Previous" and "Next" buttons
                if (i === 0 || i === roles.links.length - 1) {
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

                // Regular page links
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

      {/* Add Role Dialog */}
      <Dialog open={addRoleDialog} onOpenChange={setAddRoleDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5 text-green-500" />
              Add New Role
            </DialogTitle>
            <DialogDescription>
              Create a new role for the system.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submitForm}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Role Name</Label>
                <Input
                  id="name"
                  value={data.name}
                  onChange={e => setData('name', e.target.value)}
                  placeholder="Enter role name"
                  className="focus-visible:ring-primary"
                />
                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Input
                  id="description"
                  value={data.description}
                  onChange={e => setData('description', e.target.value)}
                  placeholder="Enter role description"
                  className="focus-visible:ring-primary"
                />
                {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setAddRoleDialog(false);
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
                {processing ? 'Creating...' : 'Create Role'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Role Dialog */}
      <Dialog open={editRoleDialog} onOpenChange={setEditRoleDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Pencil className="mr-2 h-5 w-5 text-blue-500" />
              Edit Role
            </DialogTitle>
            <DialogDescription>
              Update role information.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submitForm}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Role Name</Label>
                <Input
                  id="edit-name"
                  value={data.name}
                  onChange={e => setData('name', e.target.value)}
                  placeholder="Enter role name"
                  className="focus-visible:ring-blue-500"
                />
                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description (Optional)</Label>
                <Input
                  id="edit-description"
                  value={data.description}
                  onChange={e => setData('description', e.target.value)}
                  placeholder="Enter role description"
                  className="focus-visible:ring-blue-500"
                />
                {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setEditRoleDialog(false);
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

      {/* View Role Dialog */}
      <Dialog open={viewRoleDialog} onOpenChange={setViewRoleDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Eye className="mr-2 h-5 w-5 text-slate-500" />
              Role Details
            </DialogTitle>
          </DialogHeader>
          {selectedRole && (
            <div className="py-4">
              <div className="rounded-md bg-muted p-6 space-y-4">
                <div className="flex justify-center mb-4">
                  <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                    {getRoleIcon(selectedRole.name)}
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <h3 className="text-xs font-medium text-muted-foreground uppercase">Role Name</h3>
                    <p className="text-base font-medium">{selectedRole.name}</p>
                  </div>
                  {selectedRole.description && (
                    <div>
                      <h3 className="text-xs font-medium text-muted-foreground uppercase">Description</h3>
                      <p className="text-base">{selectedRole.description}</p>
                    </div>
                  )}
                  <div className="flex items-center gap-4">
                    <div>
                      <h3 className="text-xs font-medium text-muted-foreground uppercase">Created</h3>
                      <p className="text-base">{new Date(selectedRole.created_at).toLocaleDateString()}</p>
                    </div>
                    {selectedRole.users_count !== undefined && (
                      <div>
                        <h3 className="text-xs font-medium text-muted-foreground uppercase">Users with this role</h3>
                        <div className="flex items-center mt-1">
                          <UserCheck className="mr-1 h-4 w-4 text-primary" />
                          <p>{selectedRole.users_count}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-6 gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setViewRoleDialog(false)}
                >
                  Close
                </Button>
                <Button 
                  variant="default"
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={() => {
                    setViewRoleDialog(false);
                    openEditDialog(selectedRole);
                  }}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit Role
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Role Dialog */}
      <Dialog open={deleteRoleDialog} onOpenChange={setDeleteRoleDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center text-destructive">
              <Trash2 className="mr-2 h-5 w-5" />
              Delete Role
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this role? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedRole && (
              <div className="rounded-md bg-destructive/10 border border-destructive/20 p-4">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-destructive mr-2" />
                  <p className="font-medium text-destructive">You are about to delete the following role:</p>
                </div>
                <div className="mt-3 space-y-2 pl-7">
                  <p className="flex items-center">
                    <strong>Name:</strong> 
                    <span className="ml-1 flex items-center">
                      {getRoleIcon(selectedRole.name)} 
                      <span className="ml-1">{selectedRole.name}</span>
                    </span>
                  </p>
                  {selectedRole.description && (
                    <p><strong>Description:</strong> {selectedRole.description}</p>
                  )}
                </div>
                {selectedRole.users_count && selectedRole.users_count > 0 && (
                  <div className="mt-4 bg-yellow-50 p-2 rounded-md border border-yellow-200 flex items-start">
                    <Info className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
                    <div>
                      <p className="text-yellow-700 font-medium">Warning</p>
                      <p className="text-yellow-600 text-sm">This role is assigned to {selectedRole.users_count} users. Deleting it will affect these users.</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          <DialogFooter className="gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setDeleteRoleDialog(false)}
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
              {deleteForm.processing ? 'Deleting...' : 'Delete Role'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}