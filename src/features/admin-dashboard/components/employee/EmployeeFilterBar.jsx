import React from 'react';
import { Search, UserPlus, Filter, X, ChevronDown, Check } from 'lucide-react';
import { Button } from "~/components/employee-ui/button";
import { Input } from "~/components/employee-ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "~/components/employee-ui/dropdown-menu";
import { useNavigate } from 'react-router-dom';

const EmployeeFilterBar = ({
    searchTerm,
    setSearchTerm,
    roleFilter,
    setRoleFilter,
    statusFilter,
    setStatusFilter,
    totalResult
}) => {
    const navigate = useNavigate();

    const clearFilters = () => {
        setSearchTerm('');
        setRoleFilter('all');
        setStatusFilter('all');
    };

    const hasActiveFilters = searchTerm || roleFilter !== 'all' || statusFilter !== 'all';

    const getRoleLabel = (val) => {
        const roles = {
            'all': 'All Roles',
            'HR': 'HR',
            'MANAGER': 'Manager',
            'EMPLOYEE': 'Employee',
            'ORG_ADMIN': 'Admin'
        };
        return roles[val] || 'Role';
    };

    const getStatusLabel = (val) => {
        const statuses = {
            'all': 'All Status',
            'ACTIVE': 'Active',
            'INACTIVE': 'Inactive',
            'PROBATION': 'Probation',
            'NOTICE_PERIOD': 'Notice Period',
            'TERMINATED': 'Terminated'
        };
        return statuses[val] || 'Status';
    };

    return (
        <div className="bg-card p-4 rounded-xl shadow-sm border border-border sticky top-0 z-10 mb-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">

                {/* Left: Search & Counts */}
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search employees..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 h-10 bg-muted/50 border-border focus-visible:ring-primary"
                        />
                    </div>
                    <div className="hidden md:block h-8 w-px bg-border"></div>
                    <span className="text-sm font-medium text-muted-foreground whitespace-nowrap hidden md:block">
                        {totalResult} Members
                    </span>
                </div>

                {/* Right: Filters & Action */}
                <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">

                    <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="w-[150px] shrink-0 justify-between font-normal border-border bg-card text-card-foreground">
                                {getRoleLabel(roleFilter)}
                                <ChevronDown className="h-4 w-4 opacity-50" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-[150px]">
                            {['all', 'ORG_ADMIN', 'MANAGER', 'EMPLOYEE', 'HR'].map(role => (
                                <DropdownMenuItem key={role} onClick={() => setRoleFilter(role)} className="justify-between">
                                    {getRoleLabel(role)}
                                    {roleFilter === role && <Check className="h-4 w-4" />}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="w-[150px] shrink-0 justify-between font-normal border-border bg-card text-card-foreground">
                                {getStatusLabel(statusFilter)}
                                <ChevronDown className="h-4 w-4 opacity-50" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-[150px]">
                            {['all', 'ACTIVE', 'INACTIVE', 'PROBATION', 'NOTICE_PERIOD', 'TERMINATED'].map(status => (
                                <DropdownMenuItem key={status} onClick={() => setStatusFilter(status)} className="justify-between">
                                    {getStatusLabel(status)}
                                    {statusFilter === status && <Check className="h-4 w-4" />}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {hasActiveFilters && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={clearFilters}
                            className="h-10 w-10 text-muted-foreground hover:text-destructive"
                            title="Clear Filters"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    )}

                    <Button
                        onClick={() => navigate('/admin/employees/add')}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 h-10 px-6 shadow-md"
                    >
                        <UserPlus className="h-4 w-4" />
                        <span className="hidden sm:inline">Add Member</span>
                    </Button>
                </div>

            </div>
        </div>
    );
};

export default EmployeeFilterBar;
