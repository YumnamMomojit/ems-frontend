import React, { useState, useEffect } from "react";
import { getPermissionMatrix, toggleRolePermission, assignUserPermission } from "~/services/permission.api";
import api from "~/services/api";
import { Loader2, Plus, Key } from "lucide-react";
import { toast } from "react-toastify";

const AdminPermissionsPage = () => {
    const [matrix, setMatrix] = useState([]);
    const [loading, setLoading] = useState(true);
    const [roles] = useState(["HR", "MANAGER", "EMPLOYEE"]);

    // Assign to User Modal State
    const [isAssigning, setIsAssigning] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [selectedUser, setSelectedUser] = useState("");
    const [selectedPerm, setSelectedPerm] = useState("");

    const roleStyles = {
        SUPER_ADMIN: { 
            bg: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400", 
            toggle: "bg-red-500 dark:bg-red-500" 
        },
        ORG_ADMIN: { 
            bg: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400", 
            toggle: "bg-blue-600 dark:bg-blue-500"
        },
        ADMIN: { 
            bg: "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400", 
            toggle: "bg-indigo-600 dark:bg-indigo-500"
        },
        HR: { 
            bg: "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400", 
            toggle: "bg-orange-500 dark:bg-orange-500"
        },
        MANAGER: { 
            bg: "bg-slate-200 text-slate-800 dark:bg-slate-500/20 dark:text-slate-300", 
            toggle: "bg-slate-600 dark:bg-slate-500"
        },
        EMPLOYEE: { 
            bg: "bg-gray-200 text-gray-800 dark:bg-gray-500/20 dark:text-gray-300", 
            toggle: "bg-gray-500 dark:bg-gray-400"
        }
    };

    const fetchMatrix = async () => {
        try {
            setLoading(true);
            const data = await getPermissionMatrix();
            setMatrix(data);
        } catch (error) {
            console.error("Failed to load permissions", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchEmployees = async () => {
        try {
            const res = await api.get("/admin/employees?limit=200");
            setEmployees(res.data.data || []);
        } catch (error) {
            console.error("Failed to load employees for assignment", error);
        }
    };

    useEffect(() => {
        fetchMatrix();
        fetchEmployees();
    }, []);

    const handleToggle = async (permissionId, role) => {
        if (["SUPER_ADMIN", "ORG_ADMIN", "ADMIN"].includes(role)) {
            toast.info(`${role.replace('_', ' ')} permissions cannot be modified.`);
            return;
        }

        try {
            // Optimistic update
            setMatrix(prev => prev.map(perm => {
                if (perm.id === permissionId) {
                    return { ...perm, [role]: !perm[role] };
                }
                return perm;
            }));

            const response = await toggleRolePermission(role, permissionId);
            if (response.status) {
                toast.success(`Granted ${role} permission`);
            } else {
                toast.success(`Revoked ${role} permission`);
            }
        } catch (error) {
            toast.error("Error updating permission");
            fetchMatrix(); // Revert on failure
        }
    };

    const handleAssignUser = async (e) => {
        e.preventDefault();
        if (!selectedUser || !selectedPerm) {
            toast.error("Please select both a user and a permission.");
            return;
        }

        try {
            await assignUserPermission(selectedUser, selectedPerm);
            toast.success("Permission explicitly granted to user.");
            setSelectedUser("");
            setSelectedPerm("");
            setIsAssigning(false);
            fetchMatrix(); 
        } catch (error) {
            toast.error("Failed to assign permission to user.");
        }
    }

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6 text-slate-900 dark:text-slate-100">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Access & Permissions</h1>
                </div>
                <button
                    onClick={() => setIsAssigning(!isAssigning)}
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary/90 transition"
                >
                    <Plus className="w-4 h-4" />
                    User Overrides
                </button>
            </div>

            {isAssigning && (
                <div className="bg-card border border-border rounded-xl p-6 shadow-sm mb-6 text-slate-900 dark:text-slate-100">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
                        <Key className="w-5 h-5" /> Override User Permission
                    </h3>
                    <form onSubmit={handleAssignUser} className="flex gap-4 items-end">
                        <div className="space-y-1.5 flex-1">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Select Employee</label>
                            <select
                                value={selectedUser}
                                onChange={(e) => setSelectedUser(e.target.value)}
                                className="w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm"
                                required
                            >
                                <option value="">-- Choose Employee --</option>
                                {employees.map((emp) => (
                                    <option key={emp.userId} value={emp.userId}>
                                        {emp.firstName} {emp.lastName} ({emp.employeeCode})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-1.5 flex-1">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Select Permission</label>
                            <select
                                value={selectedPerm}
                                onChange={(e) => setSelectedPerm(e.target.value)}
                                className="w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm"
                                required
                            >
                                <option value="">-- Choose Permission --</option>
                                {matrix.map((perm) => (
                                    <option key={perm.id} value={perm.id}>
                                        {perm.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button type="submit" className="h-10 px-4 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg text-sm font-medium">
                            Assign
                        </button>
                    </form>
                </div>
            )}

            <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-border bg-slate-50/50 dark:bg-slate-900/20">
                                <th className="px-6 py-5 text-sm font-bold text-slate-800 dark:text-slate-200 tracking-wide w-[40%]">
                                    CAPABILITIES
                                </th>
                                {roles.map(role => (
                                    <th key={role} className="px-4 py-5 text-center w-[20%]">
                                        <div className="flex flex-col items-center justify-center h-full">
                                            <span className={`text-xs font-bold px-3 py-1 rounded-md ${roleStyles[role].bg}`}>
                                                {role.replace('_', ' ')}
                                            </span>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {matrix.map((perm) => (
                                <tr key={perm.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col">
                                            <span className="text-[15px] font-bold text-slate-900 dark:text-slate-100">
                                                {perm.name}
                                            </span>
                                            <span className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                                {perm.description || "No description provided."}
                                            </span>
                                        </div>
                                    </td>
                                    {roles.map((role) => {
                                        const isGranted = perm[role];
                                        return (
                                            <td key={`${perm.id}-${role}`} className="px-4 py-5 text-center align-middle">
                                                <button
                                                    onClick={() => handleToggle(perm.id, role)}
                                                    disabled={["SUPER_ADMIN", "ORG_ADMIN", "ADMIN"].includes(role)}
                                                    className={`relative inline-flex h-[24px] w-[44px] shrink-0 items-center rounded-full border-2 transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                                                        isGranted 
                                                            ? `${roleStyles[role].toggle} border-transparent` 
                                                            : 'bg-slate-200 border-transparent dark:bg-slate-700'
                                                    } ${["SUPER_ADMIN", "ORG_ADMIN", "ADMIN"].includes(role) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                                    role="switch"
                                                    aria-checked={isGranted}
                                                >
                                                    <span
                                                        className={`pointer-events-none inline-block h-[20px] w-[20px] transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                                            isGranted ? 'translate-x-[20px]' : 'translate-x-0'
                                                        }`}
                                                    />
                                                </button>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminPermissionsPage;
