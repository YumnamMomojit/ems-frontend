import React, { useState, useEffect } from "react";
import managerService from "../services/manager.service";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LineChart, Line, Legend } from "recharts";
import { TrendingUp, Award, Clock, Calendar } from "lucide-react";

const TeamPerformance = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    useEffect(() => {
        const fetchPerformance = async () => {
            try {
                const result = await managerService.getTeamPerformance();
                setData(result);
            } catch (err) {
                console.error("Performance error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPerformance();
    }, []);

    const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#0088fe"];

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Team Performance</h1>
                <p className="text-muted-foreground">High-level insights into team productivity and consistency.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-card border rounded-xl shadow-sm p-6">
                        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-primary" /> Average Daily Work Hours
                        </h3>
                        <div className="h-[300px] w-full">
                            {loading ? (
                                <div className="h-full flex items-center justify-center text-muted-foreground text-sm">Loading performance data...</div>
                            ) : data.length === 0 ? (
                                <div className="h-full flex items-center justify-center text-muted-foreground text-sm">No data available yet.</div>
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={data}
                                        onClick={(e) => e && e.activePayload && setSelectedEmployee(e.activePayload[0].payload)}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis fontSize={12} tickLine={false} axisLine={false} />
                                        <Tooltip
                                            cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        />
                                        <Bar dataKey="avgHours" name="Avg Hours" radius={[4, 4, 0, 0]}>
                                            {data.map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={selectedEmployee?.id === entry.id ? "#000" : COLORS[index % COLORS.length]}
                                                    cursor="pointer"
                                                />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2 text-center">Click on a bar to view individual attendance consistency.</p>
                    </div>

                    {selectedEmployee && (
                        <div className="bg-card border rounded-xl shadow-sm p-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-primary" /> {selectedEmployee.name}'s Attendance Consistency
                            </h3>
                            <div className="h-[200px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={selectedEmployee.attendanceTrend}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.2} />
                                        <XAxis dataKey="date" fontSize={11} />
                                        <YAxis domain={[0, 1]} ticks={[0, 0.5, 1]} tickFormatter={(val) => val === 1 ? 'Full' : (val === 0.5 ? 'Partial' : 'Absent')} fontSize={11} />
                                        <Tooltip />
                                        <Line
                                            type="monotone"
                                            dataKey="status"
                                            stroke="#8884d8"
                                            strokeWidth={3}
                                            dot={{ r: 6, fill: '#8884d8', strokeWidth: 2, stroke: '#fff' }}
                                            activeDot={{ r: 8 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    <div className="bg-primary/5 border border-primary/10 rounded-xl p-6">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Award className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h4 className="font-bold">Top Contributor</h4>
                                <p className="text-xs text-muted-foreground text-primary/70">Based on hours logged</p>
                            </div>
                        </div>
                        <p className="text-2xl font-bold">
                            {data.length > 0 ? data.sort((a, b) => b.avgHours - a.avgHours)[0].name : "N/A"}
                        </p>
                    </div>

                    <div className="bg-card border rounded-xl p-6">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-2 bg-muted rounded-lg">
                                <Clock className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <div>
                                <h4 className="font-bold">Team Average</h4>
                                <p className="text-xs text-muted-foreground">Daily hours (Goal: 8.0)</p>
                            </div>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold">
                                {data.length > 0 ? (data.reduce((acc, curr) => acc + curr.avgHours, 0) / data.length).toFixed(1) : "0.0"}
                            </span>
                            <span className="text-xs text-muted-foreground">hrs / day</span>
                        </div>
                        <div className="w-full bg-muted mt-4 h-2 rounded-full overflow-hidden">
                            <div
                                className="bg-primary h-full transition-all duration-500"
                                style={{ width: `${Math.min((data.reduce((acc, curr) => acc + curr.avgHours, 0) / data.length) / 8 * 100, 100)}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeamPerformance;
