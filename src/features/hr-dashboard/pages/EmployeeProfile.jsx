import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { User, Mail, Phone, MapPin, Building2, Calendar, ArrowLeft, Briefcase, Hash, FileText } from "lucide-react";
import hrApi from "../services/hr.api";
import { useTheme } from "~/lib/theme-provider";

const EmployeeProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { theme } = useTheme();
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                setLoading(true);
                const response = await hrApi.getEmployeeById(id);
                setEmployee(response.data.data);
            } catch (err) {
                console.error("Error fetching employee:", err);
                setError("Failed to load employee details");
            } finally {
                setLoading(false);
            }
        };

        fetchEmployee();
    }, [id]);

    if (loading) {
        return (
            <div className="p-6 flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading employee profile...</p>
                </div>
            </div>
        );
    }

    if (error || !employee) {
        return (
            <div className="p-6 flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <p className="text-destructive mb-4">{error || "Employee not found"}</p>
                    <button
                        onClick={() => navigate("/hr/employees")}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                    >
                        Back to Directory
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header with Back Button */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate("/hr/employees")}
                    className="p-2 hover:bg-secondary rounded-lg transition-colors"
                >
                    <ArrowLeft className="h-5 w-5" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Employee Profile</h1>
                    <p className="text-muted-foreground text-sm">Detailed information about the employee</p>
                </div>
            </div>

            {/* Profile Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Side - Photo and Basic Info */}
                <div className="lg:col-span-1">
                    <div className="bg-card border rounded-2xl p-6 space-y-6">
                        {/* Profile Picture */}
                        <div className="flex flex-col items-center text-center">
                            <div className="relative mb-4">
                                <div className="h-32 w-32 rounded-full bg-primary/5 flex items-center justify-center border-4 border-primary/10 overflow-hidden">
                                    {employee.avatar ? (
                                        <img src={employee.avatar} alt={employee.firstName} className="h-full w-full object-cover" />
                                    ) : (
                                        <User className="h-16 w-16 text-primary/40" />
                                    )}
                                </div>
                                <div className={`absolute -bottom-1 -right-1 h-6 w-6 ${employee.isClockedIn ? 'bg-green-500' : 'bg-red-500'} border-4 border-card rounded-full`} title={employee.isClockedIn ? "Clocked In" : "Not Clocked In"}></div>
                            </div>
                            <h2 className="text-xl font-bold text-foreground">
                                {employee.firstName} {employee.lastName}
                            </h2>
                            <p className="text-sm font-semibold text-primary/70 uppercase tracking-wider mt-1">
                                {employee.employeeCode}
                            </p>
                            <p className="text-sm text-muted-foreground mt-2">{employee.designation}</p>
                        </div>

                        {/* Quick Stats */}
                        <div className="border-t pt-4 space-y-3">
                            <div className="flex items-center gap-3 text-sm">
                                <Building2 className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">Department:</span>
                                <span className="font-medium ml-auto">{employee.department?.name || "N/A"}</span>
                            </div>
                            {employee.team && (
                                <div className="flex items-center gap-3 text-sm">
                                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">Team:</span>
                                    <span className="font-medium ml-auto">{employee.team.name}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-3 text-sm">
                                <Hash className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">Employee ID:</span>
                                <span className="font-medium ml-auto">#{employee.id}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Detailed Information */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Contact Information */}
                    <div className="bg-card border rounded-2xl p-6">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <Mail className="h-5 w-5 text-primary" />
                            Contact Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-muted-foreground uppercase tracking-wider">Email</label>
                                <p className="text-sm font-medium mt-1">{employee.email}</p>
                            </div>
                            <div>
                                <label className="text-xs text-muted-foreground uppercase tracking-wider">Phone</label>
                                <p className="text-sm font-medium mt-1">{employee.phone || "Not provided"}</p>
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-xs text-muted-foreground uppercase tracking-wider">Address</label>
                                <p className="text-sm font-medium mt-1">{employee.address || "Not provided"}</p>
                            </div>
                        </div>
                    </div>

                    {/* Professional Information */}
                    <div className="bg-card border rounded-2xl p-6">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <Briefcase className="h-5 w-5 text-primary" />
                            Professional Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-muted-foreground uppercase tracking-wider">Designation</label>
                                <p className="text-sm font-medium mt-1">{employee.designation}</p>
                            </div>
                            <div>
                                <label className="text-xs text-muted-foreground uppercase tracking-wider">Department</label>
                                <p className="text-sm font-medium mt-1">{employee.department?.name || "N/A"}</p>
                            </div>
                            {employee.team && (
                                <div>
                                    <label className="text-xs text-muted-foreground uppercase tracking-wider">Team</label>
                                    <p className="text-sm font-medium mt-1">{employee.team.name}</p>
                                </div>
                            )}
                            {employee.dateOfJoining && (
                                <div>
                                    <label className="text-xs text-muted-foreground uppercase tracking-wider">Date of Joining</label>
                                    <p className="text-sm font-medium mt-1">
                                        {new Date(employee.dateOfJoining).toLocaleDateString()}
                                    </p>
                                </div>
                            )}
                            <div>
                                <label className="text-xs text-muted-foreground uppercase tracking-wider">Current Status</label>
                                <p className="text-sm font-medium mt-1">
                                    <span className={`px-2 py-1 rounded-full text-xs ${employee.isClockedIn
                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                        }`}>
                                        {employee.isClockedIn ? "Active" : "Inactive"}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>


                    {/* View Documents Button */}
                    <div className="bg-card border rounded-2xl p-6">
                        <button
                            onClick={() => navigate(`/hr/reports/documents`)}
                            className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md"
                        >
                            <FileText className="h-5 w-5" />
                            View Documents
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default EmployeeProfile;
