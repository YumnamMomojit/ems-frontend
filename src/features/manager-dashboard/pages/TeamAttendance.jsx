import React, { useState, useEffect, useRef } from "react";
import managerService from "../services/manager.service";
import StatusBadge from "../components/StatusBadge";
import { format, isToday } from "date-fns";
import { Calendar as CalendarIcon, MapPin } from "lucide-react";
import { reverseGeocode } from "../../../utils/geocoding";

const TeamAttendance = () => {
    const [attendance, setAttendance] = useState([]);
    const [members, setMembers] = useState([]);
    const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
    const [loading, setLoading] = useState(true);
    const [addresses, setAddresses] = useState({});
    const pollingInterval = useRef(null);

    const fetchData = async (isBackground = false) => {
        if (!isBackground) setLoading(true);
        try {
            const [aData, mData] = await Promise.all([
                managerService.getTeamAttendance(date),
                managerService.getTeamMembers()
            ]);

            setAttendance(aData || []);
            setMembers(mData || []);

            // Resolve addresses for new records
            if (aData && Array.isArray(aData)) {
                aData.forEach(async (record) => {
                    if (record.punchInLat && record.punchInLng && !addresses[`${record.id}_in`]) {
                        const address = await reverseGeocode(record.punchInLat, record.punchInLng);
                        if (address) {
                            setAddresses(prev => ({ ...prev, [`${record.id}_in`]: address }));
                        }
                    }
                    if (record.punchOutLat && record.punchOutLng && !addresses[`${record.id}_out`]) {
                        const address = await reverseGeocode(record.punchOutLat, record.punchOutLng);
                        if (address) {
                            setAddresses(prev => ({ ...prev, [`${record.id}_out`]: address }));
                        }
                    }
                });
            }
        } catch (err) {
            console.error("Attendance fetch error:", err);
        } finally {
            if (!isBackground) setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();

        // Setup polling if date is today
        if (isToday(new Date(date))) {
            pollingInterval.current = setInterval(() => {
                fetchData(true);
            }, 30000); // Poll every 30 seconds
        } else {
            if (pollingInterval.current) {
                clearInterval(pollingInterval.current);
            }
        }

        return () => {
            if (pollingInterval.current) {
                clearInterval(pollingInterval.current);
            }
        };
    }, [date]);

    // Combine members with their attendance
    const roster = members.map(member => {
        const record = attendance.find(a => a.employeeId === member.id);
        return {
            ...member,
            attendance: record || null
        };
    });

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Team Attendance</h1>
                    <p className="text-muted-foreground">Monitor daily check-ins and working hours.</p>
                </div>

                <div className="flex items-center gap-2 bg-card border rounded-lg px-3 py-2 shadow-sm">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="bg-transparent border-none focus:outline-none text-sm"
                    />
                </div>
            </div>

            <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left table-fixed">
                        <thead className="bg-muted/50 border-b text-sm font-medium">
                            <tr>
                                <th className="px-6 py-4 w-[18%]">Employee</th>
                                <th className="px-6 py-4 w-[12%]">Designation</th>
                                <th className="px-6 py-4 w-[10%]">Punch In</th>
                                <th className="px-6 py-4 w-[10%]">Punch Out</th>
                                <th className="px-6 py-4 w-[20%]">Punch In Loc</th>
                                <th className="px-6 py-4 w-[20%]">Punch Out Loc</th>
                                <th className="px-6 py-4 w-[10%] text-right pr-10">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y text-sm">
                            {loading && attendance.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-10 text-center text-muted-foreground">
                                        Loading attendance records...
                                    </td>
                                </tr>
                            ) : roster.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-10 text-center text-muted-foreground">
                                        No team members found.
                                    </td>
                                </tr>
                            ) : (
                                roster.map((item) => (
                                    <tr key={item.id} className="hover:bg-muted/20 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium truncate">{item.firstName} {item.lastName}</div>
                                            <div className="text-xs text-muted-foreground truncate">{item.email}</div>
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground truncate">
                                            {item.designation}
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.attendance?.punchInTime ? format(new Date(item.attendance.punchInTime), "hh:mm a") : "-"}
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.attendance?.punchOutTime ? format(new Date(item.attendance.punchOutTime), "hh:mm a") : "-"}
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.attendance?.punchInLat ? (
                                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                                    <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                                                    <span className="truncate" title={addresses[`${item.attendance.id}_in`] || "Resolving location..."}>
                                                        {addresses[`${item.attendance.id}_in`] || "Resolving..."}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-muted-foreground/50 italic text-[11px]">
                                                    {item.attendance ? "No data" : "-"}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.attendance?.punchOutLat ? (
                                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                                    <MapPin className="h-3.5 w-3.5 text-orange-500 shrink-0" />
                                                    <span className="truncate" title={addresses[`${item.attendance.id}_out`] || "Resolving location..."}>
                                                        {addresses[`${item.attendance.id}_out`] || "Resolving..."}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-muted-foreground/50 italic text-[11px]">
                                                    {item.attendance?.punchOutTime ? "No data" : "-"}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right pr-10">
                                            <StatusBadge status={item.attendance?.status || "ABSENT"} />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TeamAttendance;
