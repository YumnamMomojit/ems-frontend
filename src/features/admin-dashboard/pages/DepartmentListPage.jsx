import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import {
    Building,
    Plus,
    Edit,
    Trash2,
    Users,
} from 'lucide-react';
import { Button } from '~/components/employee-ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '~/components/employee-ui/dialog';
import { Input } from '~/components/employee-ui/input';
import { Label } from '~/components/employee-ui/label';
import { Skeleton } from '~/components/employee-ui/skeleton';

import { useToast } from '~/hooks/use-toast';

const DepartmentListPage = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingDept, setEditingDept] = useState(null);
    const [departmentName, setDepartmentName] = useState('');

    // Fetch all departments
    const { data: departments, isLoading: isLoadingDepartments } = useQuery({
        queryKey: ['allDepartments'],
        queryFn: async () => {
            const response = await api.get('/admin/departments');
            return response.data;
        },
    });

    // Fetch all employees to count per department
    const { data: employees } = useQuery({
        queryKey: ['allEmployees'],
        queryFn: async () => {
            const response = await api.get('/admin/employees?limit=1000');
            return response.data.data || [];
        },
    });

    // Create department mutation
    const createDepartmentMutation = useMutation({
        mutationFn: async (name) => {
            const response = await api.post('/admin/departments', { name });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['allDepartments']);
            toast({
                title: 'Success',
                description: 'Department created successfully',
            });
            setIsAddOpen(false);
            setDepartmentName('');
        },
        onError: (error) => {
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Failed to create department',
                variant: 'destructive',
            });
        },
    });

    // Delete department mutation
    const deleteDepartmentMutation = useMutation({
        mutationFn: async (id) => {
            const response = await api.delete(`/admin/departments/${id}`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['allDepartments']);
            toast({
                title: 'Success',
                description: 'Department deleted successfully',
            });
        },
        onError: (error) => {
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Failed to delete department',
                variant: 'destructive',
            });
        },
    });

    const handleCreateDepartment = () => {
        if (departmentName.trim()) {
            createDepartmentMutation.mutate(departmentName);
        }
    };

    const handleDeleteDepartment = (id) => {
        if (window.confirm('Are you sure you want to delete this department?')) {
            deleteDepartmentMutation.mutate(id);
        }
    };

    const getEmployeeCount = (deptId) => {
        return employees?.filter((emp) => emp.departmentId === deptId).length || 0;
    };

    if (isLoadingDepartments) {
        return (
            <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
                <Skeleton className="h-32 w-full rounded-xl" />
                <Skeleton className="h-96 w-full rounded-lg" />
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Departments</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your organization's departments
                    </p>
                </div>
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button className>
                            <Plus className="mr-2 h-4 w-4 " />
                            Add Department
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Department</DialogTitle>
                            <DialogDescription>
                                Create a new department for your organization
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Department Name</Label>
                                <Input
                                    id="name"
                                    placeholder="e.g., Engineering, Marketing"
                                    value={departmentName}
                                    onChange={(e) => setDepartmentName(e.target.value)}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setIsAddOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleCreateDepartment}
                                disabled={!departmentName.trim() || createDepartmentMutation.status === 'pending'}
                            >
                                Create Department
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Department Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {
                    departments && departments.length > 0 ? (
                        departments.map((department) => (
                            <div
                                key={department.id}
                                className="rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                                style={{ backgroundColor: 'hsl(var(--card))', color: 'hsl(var(--card-foreground))' }}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-500/10 rounded-lg">
                                            <Building className="h-6 w-6 text-blue-500" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg">{department.name}</h3>
                                            <p className="text-sm text-muted-foreground">
                                                {getEmployeeCount(department.id)} employees
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDeleteDepartment(department.id)}
                                        >
                                            <Trash2 className="h-4 w-4 text-red-600" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t">
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <Users className="h-4 w-4 mr-2" />
                                        View all employees in this department
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12">
                            <Building className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <p className="text-muted-foreground">
                                No departments found. Create your first department to get started.
                            </p>
                        </div>
                    )}
            </div>

            {/* Summary */}
            {
                departments && (
                    <div className="mt-6 text-sm text-muted-foreground">
                        Total Departments: {departments.length}
                    </div>
                )
            }
        </div>
    );
};

export default DepartmentListPage;
