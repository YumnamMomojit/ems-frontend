import React from "react";
import { format } from "date-fns";
import StatusBadge from "../../manager-dashboard/components/StatusBadge";

const AttendanceTable = ({ data, loading }) => {
    return (
        <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-muted/50 border-b text-sm font-medium">
                        <tr>
                            <th className="px-6 py-4">Employee</th>
                            <th className="px-6 py-4">Punch In</th>
                            <th className="px-6 py-4">Punch Out</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Location</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y text-sm">
                        {loading ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-10 text-center text-muted-foreground">Loading attendance...</td>
                            </tr>
                        ) : !data || data.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-10 text-center text-muted-foreground">No attendance records found.</td>
                            </tr>
                        ) : (
                            data.map((record) => (
                                <tr key={record.id} className="hover:bg-muted/20 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-foreground">
                                            {record.employee.firstName} {record.employee.lastName}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {record.employee.designation}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {record.punchInTime ? format(new Date(record.punchInTime), "hh:mm a") : "-"}
                                    </td>
                                    <td className="px-6 py-4">
                                        {record.punchOutTime ? format(new Date(record.punchOutTime), "hh:mm a") : "-"}
                                    </td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={record.status} />
                                    </td>
                                    <td className="px-6 py-4 text-xs">
                                        {record.punchInLat && record.punchInLng ? (
                                            <span className="text-muted-foreground">
                                                {record.punchInLat.toFixed(4)}, {record.punchInLng.toFixed(4)}
                                            </span>
                                        ) : "-"}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AttendanceTable;
