import React from 'react';
import { User, Mail, Phone, Building2, ExternalLink } from 'lucide-react';

const EmployeeCardGrid = ({ employees, isLoading, onViewProfile }) => {
    if (isLoading) {
        return <div className="py-20 text-center text-muted-foreground">Loading directory...</div>;
    }

    if (!employees || employees.length === 0) {
        return <div className="py-20 text-center text-muted-foreground">No employees found matching your search.</div>;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {employees.map((emp) => (
                <div key={emp.id} className="bg-card border rounded-2xl p-6 hover:shadow-xl transition-all duration-300 group universal-card-child">
                    <div className="flex flex-col items-center text-center space-y-4">
                        <div className="relative">
                            <div className="h-20 w-20 rounded-full bg-primary/5 flex items-center justify-center border-2 border-primary/10 group-hover:border-primary/30 transition-colors overflow-hidden">
                                {emp.avatar ? (
                                    <img src={emp.avatar} alt={emp.firstName} className="h-full w-full object-cover" />
                                ) : (
                                    <User className="h-10 w-10 text-primary/40" />
                                )}
                            </div>
                            <div
                                className={`absolute -bottom-1 -right-1 h-5 w-5 ${emp.isClockedIn ? 'bg-green-500' : 'bg-red-500'
                                    } border-2 border-white rounded-full`}
                                title={emp.isClockedIn ? "Clocked In" : "Not Clocked In"}
                            ></div>
                        </div>

                        <div>
                            <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">
                                {emp.firstName} {emp.lastName}
                            </h3>
                            <p className="text-xs font-semibold text-primary/70 uppercase tracking-wider">
                                {emp.employeeCode}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                                {emp.designation || emp.role || 'N/A'}
                            </p>
                        </div>

                        <div className="w-full border-t pt-4 space-y-2 text-left">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Building2 className="h-3.5 w-3.5" />
                                <span>{emp.department?.name || 'No Department'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Mail className="h-3.5 w-3.5" />
                                <span className="truncate">{emp.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Phone className="h-3.5 w-3.5" />
                                <span>{emp.phone || 'No Phone'}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => onViewProfile(emp.id)}
                            className="w-full mt-2 h-9 border border-primary/20 text-primary hover:bg-primary/10 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm hover:shadow-md"
                        >
                            <ExternalLink className="h-3.5 w-3.5" />
                            View Full Profile
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default EmployeeCardGrid;
