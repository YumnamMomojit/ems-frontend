import React, { useState, useEffect } from "react";
import hrApi from "../services/hr.api";
import DocumentUploader from "../components/DocumentUploader";
import { FileText, Download, Search } from "lucide-react";
import { format } from "date-fns";

const SalarySlips = () => {
    const [slips, setSlips] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchData = async () => {
        setLoading(true);
        try {
            const [slipsRes, employeesRes] = await Promise.all([
                hrApi.getSalarySlips(),
                hrApi.getEmployees()
            ]);
            setSlips(slipsRes.data.data);
            setEmployees(employeesRes.data.data);
        } catch (err) {
            console.error("Error fetching salary slips data:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleUpload = async (data) => {
        await hrApi.uploadSalarySlip(data);
        fetchData();
    };

    const filteredSlips = slips.filter(s =>
        `${s.employee.firstName} ${s.employee.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.employee.employeeCode.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 space-y-8">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Salary Slips</h1>
                <p className="text-muted-foreground text-sm">Upload and manage monthly salary slips for all employees.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <DocumentUploader
                        type="salary"
                        onUpload={handleUpload}
                        employees={employees}
                    />
                </div>

                <div className="lg:col-span-2 space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search by employee name or code..."
                            className="pl-10 w-full h-10 border rounded-lg text-sm bg-background outline-none focus:ring-2 focus:ring-primary/20"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-muted/50 border-b text-sm font-medium">
                                    <tr>
                                        <th className="px-6 py-4">Employee</th>
                                        <th className="px-6 py-4">Period</th>
                                        <th className="px-6 py-4">Uploaded At</th>
                                        <th className="px-6 py-4 text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y text-sm">
                                    {loading ? (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-10 text-center text-muted-foreground">Loading salary slips...</td>
                                        </tr>
                                    ) : filteredSlips.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-10 text-center text-muted-foreground">No salary slips found.</td>
                                        </tr>
                                    ) : (
                                        filteredSlips.map((slip) => (
                                            <tr key={slip.id} className="hover:bg-muted/20 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-foreground">{slip.employee.firstName} {slip.employee.lastName}</div>
                                                    <div className="text-xs text-muted-foreground">{slip.employee.employeeCode}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {format(new Date(slip.year, slip.month - 1), "MMMM yyyy")}
                                                </td>
                                                <td className="px-6 py-4 text-muted-foreground text-xs">
                                                    {format(new Date(slip.createdAt), "MMM dd, yyyy HH:mm")}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <a
                                                        href={slip.pdfUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1.5 text-primary hover:underline font-medium"
                                                    >
                                                        <Download className="h-4 w-4" />
                                                        Download
                                                    </a>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SalarySlips;
