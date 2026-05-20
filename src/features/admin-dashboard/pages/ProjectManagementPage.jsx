import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../services/api';
import {
    FolderKanban,
    Plus,
    Edit,
    Trash2,
    MoreVertical,
    Eye,
    Download,
    ExternalLink
} from 'lucide-react';
import { resolveFileUrl } from '~/lib/fileUrl';
import { Button } from '~/components/employee-ui/button';
import { useAuth } from '~/hooks/AuthContext';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '~/components/employee-ui/dialog';
import { Input } from '~/components/employee-ui/input';
import { Label } from '~/components/employee-ui/label';
import { Textarea } from '~/components/employee-ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '~/components/employee-ui/select';
import { Skeleton } from '~/components/employee-ui/skeleton';
import { useToast } from '~/hooks/use-toast';

const ProjectManagementPage = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const { user } = useAuth();
    const role = user?.role?.toUpperCase() || '';
    const isAdmin = ['ADMIN', 'SUPER_ADMIN'].includes(role);
    const isHR = role === 'HR';
    const isAdminOrHR = isAdmin || isHR;
    const isManager = role === 'MANAGER';
    const canEdit = isAdminOrHR || isManager;
    
    // Fetch HR create permission
    const { data: hrCreatePermission } = useQuery({
        queryKey: ['hrCreatePermission'],
        queryFn: async () => {
            const response = await api.get('/admin/permissions/check/create_projects');
            return response.data;
        },
        enabled: isHR,
    });

    // Fetch HR delete permission
    const { data: hrDeletePermission } = useQuery({
        queryKey: ['hrDeletePermission'],
        queryFn: async () => {
            const response = await api.get('/admin/permissions/check/delete_projects');
            return response.data;
        },
        enabled: isHR,
    });

    const canCreate = isAdmin || (isHR && hrCreatePermission?.hasPermission);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);
    const [files, setFiles] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        status: 'ACTIVE',
        attachments: [],
        hrId: '',
        managerId: '',
        assignedEmployeeIds: [],
    });

    // Fetch employees for assignment (used by HR/Manager)
    const { data: employees } = useQuery({
        queryKey: ['projectAssignableEmployees'],
        queryFn: async () => {
            const response = await api.get('/admin/projects/employees');
            return response.data;
        },
        enabled: isHR || isManager,
    });

    // Fetch HR employees for Admin assignment
    const { data: hrEmployees } = useQuery({
        queryKey: ['hrEmployees'],
        queryFn: async () => {
            const response = await api.get('/admin/projects/hr-list');
            return response.data;
        },
        enabled: isAdmin,
    });

    // Fetch projects
    const { data: projects, isLoading } = useQuery({
        queryKey: ['projects'],
        queryFn: async () => {
            const response = await api.get('/admin/projects');
            return response.data;
        },
    });

    // Create/Update project mutation
    const saveMutation = useMutation({
        mutationFn: async (data) => {
            if (editingProject) {
                return await api.put(`/admin/projects/${editingProject.id}`, data);
            }
            return await api.post('/admin/projects', data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['projects']);
            toast({
                title: 'Success',
                description: `Project ${editingProject ? 'updated' : 'created'} successfully`,
            });
            handleCloseDialog();
        },
        onError: (error) => {
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Failed to save project',
                variant: 'destructive',
            });
        },
    });

    // Delete project mutation
    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            return await api.delete(`/admin/projects/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['projects']);
            toast({
                title: 'Success',
                description: 'Project deleted successfully',
            });
        },
        onError: (error) => {
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Failed to delete project',
                variant: 'destructive',
            });
        },
    });

    const handleOpenDialog = (project = null) => {
        if (project) {
            setEditingProject(project);
            setFormData({
                name: project.name,
                description: project.description || '',
                status: project.status,
                attachments: project.attachments || [],
                hrId: project.hrId || '',
                managerId: project.managerId || '',
                assignedEmployeeIds: project.assignedEmployees?.map(e => e.id) || [],
            });
        } else {
            setEditingProject(null);
            setFormData({ name: '', description: '', status: 'ACTIVE', attachments: [], hrId: '', managerId: '', assignedEmployeeIds: [] });
        }
        setFiles([]);
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setEditingProject(null);
        setFormData({ name: '', description: '', status: 'ACTIVE', attachments: [], hrId: '', managerId: '', assignedEmployeeIds: [] });
        setFiles([]);
    };

    const handleOpenViewDialog = (project) => {
        setSelectedProject(project);
        setIsViewDialogOpen(true);
    };

    const handleCloseViewDialog = () => {
        setIsViewDialogOpen(false);
        setSelectedProject(null);
    };

    const handleSave = () => {
        if (!formData.name.trim()) {
            toast({
                title: 'Validation Error',
                description: 'Project name is required',
                variant: 'destructive',
            });
            return;
        }

        // Defensive check for HR permission
        if (!editingProject && isHR && !hrCreatePermission?.hasPermission) {
            toast({
                title: 'Permission Denied',
                description: 'You do not have permission to create projects',
                variant: 'destructive',
            });
            return;
        }

        const dataToSend = new FormData();
        dataToSend.append('name', formData.name);
        dataToSend.append('description', formData.description);
        dataToSend.append('status', formData.status);
        if (formData.hrId) {
            dataToSend.append('hrId', formData.hrId);
        }
        if (formData.managerId) {
            dataToSend.append('managerId', formData.managerId);
        }
        if (formData.assignedEmployeeIds?.length > 0) {
            dataToSend.append('assignedEmployeeIds', JSON.stringify(formData.assignedEmployeeIds));
        }
        
        if (editingProject && formData.attachments) {
            dataToSend.append('attachments', JSON.stringify(formData.attachments));
        }

        if (files && files.length > 0) {
            Array.from(files).forEach((file) => {
                dataToSend.append('files', file);
            });
        }

        saveMutation.mutate(dataToSend);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            deleteMutation.mutate(id);
        }
    };

    if (isLoading) {
        return (
            <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
                <Skeleton className="h-32 w-full rounded-xl" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Skeleton className="h-48 rounded-lg" />
                    <Skeleton className="h-48 rounded-lg" />
                    <Skeleton className="h-48 rounded-lg" />
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
                    <p className="text-muted-foreground text-sm">
                        Manage projects for worksheet tracking
                    </p>
                </div>
                {isAdminOrHR && (
                    <div className="relative group">
                        <Button 
                            onClick={() => handleOpenDialog()}
                            disabled={isHR && !hrCreatePermission?.hasPermission}
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Add Project
                        </Button>
                        {isHR && !hrCreatePermission?.hasPermission && (
                            <div className="absolute -top-8 right-0 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-10">
                                <span className="text-[10px] text-destructive font-semibold bg-destructive/5 border border-destructive/20 px-2 py-1 rounded shadow-sm whitespace-nowrap">
                                    Permission required to create projects
                                </span>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects && projects.length > 0 ? (
                    projects.map((project) => (
                        <div
                            key={project.id}
                            className="rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow universal-card-child"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${project.status === 'ACTIVE' ? 'bg-green-100' :
                                        project.status === 'COMPLETED' ? 'bg-blue-100' : 'bg-background'
                                        }`}>
                                        <FolderKanban className={`h-6 w-6 ${project.status === 'ACTIVE' ? 'text-green-600' :
                                            project.status === 'COMPLETED' ? 'text-blue-600' : 'text-gray-600'
                                            }`} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-xl">{project.name}</h3>
                                        <div className="flex gap-2 mt-1">
                                            {/* Primary Status Label */}
                                            <span
                                                className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                                                    project.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                                                    project.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                                                    isManager ? (
                                                        project.assignedEmployees?.length > 0 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-700'
                                                    ) : (
                                                        !project.managerId ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-800'
                                                    )
                                                }`}
                                            >
                                                {project.status === 'COMPLETED' ? 'Completed' :
                                                 project.status === 'CANCELLED' ? 'Cancelled' :
                                                 isManager ? (
                                                     project.assignedEmployees?.length > 0 
                                                     ? `Assigned: ${project.assignedEmployees.map(e => e.firstName).join(', ')}`
                                                     : 'Not Assigned'
                                                 ) : (
                                                     !project.managerId ? 'Not Assigned' : 
                                                     `Assigned: ${project.manager?.firstName} ${project.manager?.lastName}`
                                                 )}
                                            </span>
                                            
                                            {/* Secondary Status (if assigned but not completed) */}
                                            {project.status === 'ACTIVE' && project.managerId && (
                                                <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-medium border border-emerald-100">
                                                    Active
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-1 items-center">
                                    {isAdminOrHR && (
                                        <div className="relative group/delete">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDelete(project.id)}
                                                disabled={isHR && !hrDeletePermission?.hasPermission}
                                                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive transition-colors"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                            {isHR && !hrDeletePermission?.hasPermission && (
                                                <div className="absolute -top-8 right-0 opacity-0 group-hover/delete:opacity-100 transition-all duration-200 pointer-events-none z-10">
                                                    <span className="text-[10px] text-destructive font-semibold bg-destructive/5 border border-destructive/20 px-2 py-1 rounded shadow-sm whitespace-nowrap">
                                                        Permission required to delete projects
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {project.description && (
                                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                                    {project.description}
                                </p>
                            )}

                            {project.hr && (
                                <div className="text-sm text-muted-foreground mb-2">
                                    Assigned HR: <span className="font-medium text-foreground">{project.hr.firstName} {project.hr.lastName}</span>
                                </div>
                            )}

                            {project.manager && (
                                <div className="text-sm text-muted-foreground mb-2">
                                    Manager: <span className="font-medium text-foreground">{project.manager.firstName} {project.manager.lastName}</span>
                                </div>
                            )}
                            
                            {project.assignedEmployees?.length > 0 && (
                                <div className="text-sm text-muted-foreground mb-4">
                                    Assigned Team: {project.assignedEmployees.map(e => e.firstName).join(', ')}
                                </div>
                            )}

                            {/* Action Buttons at Bottom */}
                            <div className="mt-4 pt-4 border-t flex flex-wrap gap-2 justify-end">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleOpenViewDialog(project)}
                                    className="flex-1 sm:flex-none"
                                >
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Details
                                </Button>
                                {canEdit && (
                                    <Button
                                        size="sm"
                                        onClick={() => handleOpenDialog(project)}
                                        className="flex-1 sm:flex-none"
                                    >
                                        <Edit className="mr-2 h-4 w-4" />
                                        {isHR ? 'Assign' : 'Edit'}
                                    </Button>
                                )}
                            </div>

                            {project.attachments && project.attachments.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-border flex items-center gap-2 text-sm text-muted-foreground">
                                    <FolderKanban className="h-4 w-4" />
                                    <span>{project.attachments.length} attachment(s)</span>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-12">
                        <FolderKanban className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">
                            No projects found. Create your first project to get started.
                        </p>
                    </div>
                )}
            </div>

            {/* Create/Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {editingProject ? 'Edit Project' : 'Add New Project'}
                        </DialogTitle>
                        <DialogDescription>
                            {editingProject ? 'Update project details' : 'Create a new project for worksheet tracking'}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Project Name *</Label>
                            <Input
                                id="name"
                                placeholder="e.g., Website Redesign"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                disabled={!canCreate}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Brief project description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={3}
                                disabled={!canCreate}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="status">Status</Label>
                            <Select
                                value={formData.status}
                                onValueChange={(value) => setFormData({ ...formData, status: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ACTIVE">Active</SelectItem>
                                    <SelectItem value="COMPLETED">Completed</SelectItem>
                                    <SelectItem value="ON_HOLD">On Hold</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        
                        {/* HR Assignment (Admin Only) */}
                        {isAdmin && (
                            <div className="grid gap-2">
                                <Label>Assign to HR *</Label>
                                <Select
                                    value={formData.hrId}
                                    onValueChange={(value) => setFormData({ ...formData, hrId: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select an HR person" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {hrEmployees?.map((hr) => (
                                            <SelectItem key={hr.id} value={hr.id}>
                                                {hr.firstName} {hr.lastName} ({hr.employeeCode})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        {/* Manager Selection (HR Only) */}
                        {isHR && (
                            <div className="grid gap-2">
                                <Label>Assign Manager</Label>
                                <Select
                                    value={formData.managerId}
                                    onValueChange={(value) => setFormData({ ...formData, managerId: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a manager" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {employees?.filter(emp => emp.user?.role === 'MANAGER').map((emp) => (
                                            <SelectItem key={emp.id} value={emp.id}>
                                                {emp.firstName} {emp.lastName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        {/* Assigned Employees (Manager Only) */}
                        {isManager && (
                            <div className="grid gap-2">
                                <Label>Assign Employees</Label>
                                <div className="max-h-40 overflow-y-auto border rounded-md p-2 flex flex-col gap-1">
                                    {employees?.filter(emp => emp.user?.role === 'EMPLOYEE').map((emp) => (
                                        <label key={emp.id} className="flex items-center gap-2 cursor-pointer text-sm">
                                            <input
                                                type="checkbox"
                                                checked={formData.assignedEmployeeIds.includes(emp.id)}
                                                onChange={(e) => {
                                                    const checked = e.target.checked;
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        assignedEmployeeIds: checked 
                                                            ? [...prev.assignedEmployeeIds, emp.id]
                                                            : prev.assignedEmployeeIds.filter(id => id !== emp.id)
                                                    }));
                                                }}
                                            />
                                            {emp.firstName} {emp.lastName} ({emp.employeeCode})
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="grid gap-2">
                            <Label htmlFor="files">Attachments</Label>
                            <Input
                                id="files"
                                type="file"
                                multiple
                                onChange={(e) => setFiles(e.target.files)}
                            />
                            {formData.attachments && formData.attachments.length > 0 && (
                                <div className="text-sm text-muted-foreground mt-1">
                                    Project already has {formData.attachments.length} attachment(s).
                                </div>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={handleCloseDialog}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSave}
                            disabled={saveMutation.status === 'pending'}
                        >
                            {editingProject ? 'Update' : 'Create'} Project
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            {/* View Project Dialog */}
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <FolderKanban className="h-5 w-5 text-primary" />
                            {selectedProject?.name}
                        </DialogTitle>
                        <DialogDescription>
                            Detailed project information and attachments
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 py-4">
                        {/* Description */}
                        <div>
                            <h4 className="text-sm font-semibold mb-2">Description</h4>
                            <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg border">
                                {selectedProject?.description || 'No description provided.'}
                            </p>
                        </div>

                        {/* Assignment Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <div>
                                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Status</h4>
                                    <span className={`text-sm px-2 py-0.5 rounded-full font-medium ${
                                        selectedProject?.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                                        selectedProject?.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                                        'bg-gray-100 text-gray-800'
                                    }`}>
                                        {selectedProject?.status}
                                    </span>
                                </div>
                                <div>
                                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Assigned HR</h4>
                                    <p className="text-sm font-medium">
                                        {selectedProject?.hr ? `${selectedProject.hr.firstName} ${selectedProject.hr.lastName}` : 'Not assigned'}
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Project Manager</h4>
                                    <p className="text-sm font-medium">
                                        {selectedProject?.manager ? `${selectedProject.manager.firstName} ${selectedProject.manager.lastName}` : 'Not assigned'}
                                    </p>
                                </div>
                                <div>
                                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Created On</h4>
                                    <p className="text-sm font-medium">
                                        {selectedProject?.createdAt ? new Date(selectedProject.createdAt).toLocaleDateString() : 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Team Members */}
                        <div>
                            <h4 className="text-sm font-semibold mb-2">Team Members</h4>
                            <div className="flex flex-wrap gap-2">
                                {selectedProject?.assignedEmployees && selectedProject.assignedEmployees.length > 0 ? (
                                    selectedProject.assignedEmployees.map((emp) => (
                                        <div key={emp.id} className="text-xs bg-secondary/50 border px-2 py-1 rounded-md">
                                            {emp.firstName} {emp.lastName}
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-xs text-muted-foreground italic">No team members assigned.</p>
                                )}
                            </div>
                        </div>

                        {/* Attachments */}
                        <div>
                            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                <Download className="h-4 w-4" />
                                Attachments
                            </h4>
                            {selectedProject?.attachments && selectedProject.attachments.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {selectedProject.attachments.map((url, index) => {
                                        const fileName = url.split('/').pop() || `Attachment-${index + 1}`;
                                        return (
                                            <div key={index} className="flex items-center justify-between p-2 rounded-md border bg-background hover:bg-muted/30 transition-colors group">
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <div className="p-1.5 bg-primary/10 rounded">
                                                        <FolderKanban className="h-3.5 w-3.5 text-primary" />
                                                    </div>
                                                    <span className="text-xs font-medium truncate max-w-[150px]" title={fileName}>
                                                        {fileName}
                                                    </span>
                                                </div>
                                                <div className="flex gap-1">
                                                    <a 
                                                        href={resolveFileUrl(url)} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="p-1 hover:bg-primary/10 rounded transition-colors text-primary"
                                                        title="Open file"
                                                    >
                                                        <ExternalLink className="h-3.5 w-3.5" />
                                                    </a>
                                                    <a 
                                                        href={resolveFileUrl(url)} 
                                                        download={fileName}
                                                        className="p-1 hover:bg-primary/10 rounded transition-colors text-primary"
                                                        title="Download file"
                                                        onClick={(e) => {
                                                            // For some S3 configurations, simple 'download' attribute might not work
                                                            // We can try to force download if needed, but simple link is usually enough
                                                        }}
                                                    >
                                                        <Download className="h-3.5 w-3.5" />
                                                    </a>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-6 border-2 border-dashed rounded-lg bg-muted/10">
                                    <p className="text-xs text-muted-foreground italic">No attachments found for this project.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button onClick={handleCloseViewDialog}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ProjectManagementPage;
