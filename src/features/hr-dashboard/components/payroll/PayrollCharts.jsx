import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { useOrganization } from "~/hooks/OrganizationContext";

const PayrollCharts = ({ data, loading }) => {
    const { currencySymbol } = useOrganization();
    if (loading) {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 h-[300px] bg-card border rounded-xl animate-pulse" />
                <div className="h-[300px] bg-card border rounded-xl animate-pulse" />
            </div>
        );
    }

    const { departmentCost = [], distribution = [] } = data || {};
    const COLORS = ['#10b981', '#ef4444', '#f59e0b', '#3b82f6'];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Department Wise Cost */}
            <div className="lg:col-span-2 bg-card border rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-6">Department-wise Payroll Cost</h3>
                <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={departmentCost} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                            <XAxis
                                dataKey="department"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#6b7280', fontSize: 12 }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#6b7280', fontSize: 12 }}
                                tickFormatter={(value) => `${currencySymbol}${value / 1000}k`}
                            />
                            <Tooltip
                                cursor={{ fill: '#f3f4f6' }}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Bar
                                dataKey="cost"
                                fill="#3b82f6"
                                radius={[4, 4, 0, 0]}
                                barSize={40}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Earnings vs Deductions */}
            <div className="bg-card border rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-6">Earnings vs Deductions</h3>
                <div className="h-[250px] w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={distribution}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {distribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => `${currencySymbol}${value.toLocaleString()}`} />
                            <Legend verticalAlign="bottom" height={36} iconType="circle" />
                        </PieChart>
                    </ResponsiveContainer>
                    {/* Center Text */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] text-center">
                        <p className="text-xs text-muted-foreground font-medium">Total</p>
                        <p className="text-sm font-bold text-foreground">
                            {currencySymbol}{((distribution[0]?.value || 0) + (distribution[1]?.value || 0)).toLocaleString()}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PayrollCharts;
