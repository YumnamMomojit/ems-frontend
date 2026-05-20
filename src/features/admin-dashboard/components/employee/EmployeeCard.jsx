import React from 'react';
import { MoreVertical, Mail, Phone, Building2, Calendar, Shield, CheckCircle, XCircle } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "~/components/employee-ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/employee-ui/avatar";
import { Badge } from "~/components/employee-ui/badge";
import { format } from 'date-fns';

const EmployeeCard = ({ employee, onViewProfile, onEditProfile, onToggleStatus }) => {
    const isActive = employee.status === 'ACTIVE';
    const roleColors = {
        'SUPER_ADMIN': 'bg-purple-500/10 text-purple-600 border-purple-200/50',
        'ORG_ADMIN': 'bg-indigo-500/10 text-indigo-600 border-indigo-200/50',
        'HR': 'bg-pink-500/10 text-pink-600 border-pink-200/50',
        'MANAGER': 'bg-blue-500/10 text-blue-600 border-blue-200/50',
        'EMPLOYEE': 'bg-gray-500/10 text-gray-600 border-gray-200/50',
    };

    const getInitials = (firstName, lastName) => {
        return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
    };

    return (
        <div className="bg-card rounded-xl shadow-sm border border-border p-5 hover:shadow-md transition-all group relative">
            {/* Action Menu */}
            <div className="absolute top-4 right-4">
                <DropdownMenu modal={false}>
                    <DropdownMenuTrigger className="h-8 w-8 flex items-center justify-center rounded-full bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground transition-colors focus:outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-primary">
                        <MoreVertical className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => onViewProfile(employee.id)}>
                            View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEditProfile(employee)}>
                            Edit Profile
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => onToggleStatus(employee.id, !isActive)}
                            className={isActive ? "text-destructive focus:text-destructive" : "text-green-600 focus:text-green-600"}
                        >
                            {isActive ? "Deactivate User" : "Activate User"}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Header / Avatar */}
            <div className="flex flex-col items-center text-center mb-4">
                <div className="relative mb-3">
                    <Avatar className="h-16 w-16 border-2 border-background shadow-sm">
                        <AvatarImage src={employee.avatar} />
                        <AvatarFallback className="bg-primary/10 text-primary font-bold">
                            {getInitials(employee.firstName, employee.lastName)}
                        </AvatarFallback>
                    </Avatar>
                    <div className={`absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-background ${isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                </div>

                <h3 className="font-bold text-foreground text-lg truncate w-full">
                    {employee.firstName} {employee.lastName}
                </h3>
                <p className="text-sm text-muted-foreground font-medium mb-2">{employee.designation || 'No Designation'}</p>

                <Badge variant="outline" className={`${roleColors[employee.user?.role] || roleColors['EMPLOYEE']} border`}>
                    {employee.user?.role?.replace('_', ' ') || 'EMPLOYEE'}
                </Badge>
            </div>

            {/* Details Grid */}
            <div className="space-y-2.5 text-sm">
                <div className="flex items-center gap-3 text-muted-foreground">
                    <Building2 className="h-4 w-4 opacity-70" />
                    <span className="truncate">{employee.department?.name || 'No Dept'}</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                    <Shield className="h-4 w-4 opacity-70" />
                    <span className="truncate">
                        Manager: <span className="text-foreground font-medium">{employee.reportsTo?.firstName || 'None'}</span>
                    </span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                    <Mail className="h-4 w-4 opacity-70" />
                    <span className="truncate">{employee.email}</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                    <Calendar className="h-4 w-4 opacity-70" />
                    <span className="truncate">Joined: {employee.dateOfJoining ? format(new Date(employee.dateOfJoining), 'MMM yyyy') : 'N/A'}</span>
                </div>
            </div>

            {/* Footer Status */}
            <div className="mt-5 pt-4 border-t border-border flex items-center justify-between">
                <span className="text-xs font-mono text-muted-foreground">{employee.employeeCode}</span>
                {isActive ? (
                    <div className="flex items-center gap-1.5 text-xs font-medium text-green-600 bg-green-500/10 px-2.5 py-1 rounded-full">
                        <CheckCircle className="h-3 w-3" /> Active
                    </div>
                ) : (
                    <div className="flex items-center gap-1.5 text-xs font-medium text-red-600 bg-red-500/10 px-2.5 py-1 rounded-full">
                        <XCircle className="h-3 w-3" /> Inactive
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmployeeCard;
