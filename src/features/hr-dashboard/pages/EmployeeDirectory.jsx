import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import hrApi from "../services/hr.api";
import { Search } from "lucide-react";
import { useTheme } from "~/lib/theme-provider";
import EmployeeCardGrid from "~/components/common/EmployeeCardGrid";

const EmployeeDirectory = () => {
    const navigate = useNavigate();
    const { theme } = useTheme();
    const [employees, setEmployees] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState("");
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchData = async () => {
        setLoading(true);
        try {
            const [empRes, deptRes] = await Promise.all([
                hrApi.getEmployees(),
                hrApi.getDepartments()
            ]);
            setEmployees(empRes.data.data);
            setDepartments(deptRes.data.data);
        } catch (err) {
            console.error("Error fetching directory data:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredEmployees = employees.filter(e => {
        const matchesSearch = `${e.firstName} ${e.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
            e.employeeCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
            e.designation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            e.department?.name?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesDept = selectedDepartment ? e.department?.name === selectedDepartment : true;

        return matchesSearch && matchesDept;
    });

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Employee Directory</h1>
                    <p className="text-muted-foreground text-sm">Browse and manage the complete employee database.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search name, code, role, dept..."
                            className="pl-10 w-full h-10 rounded-lg border-0 text-sm bg-secondary text-foreground shadow-md placeholder:text-muted-foreground focus:shadow-lg focus:outline-none transition-shadow"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select
                        className="h-10 rounded-lg border-0 text-sm shadow-md focus:shadow-lg focus:outline-none px-3 min-w-[180px] transition-shadow"
                        style={{
                            backgroundColor: theme === 'light' ? 'white' : 'black',
                            color: theme === 'light' ? 'black' : 'white'
                        }}
                        value={selectedDepartment}
                        onChange={(e) => setSelectedDepartment(e.target.value)}
                    >
                        <option style={{ backgroundColor: theme === 'light' ? 'white' : 'black', color: theme === 'light' ? 'black' : 'white' }} value="">All Departments</option>
                        {departments.map((dept) => (
                            <option style={{ backgroundColor: theme === 'light' ? 'white' : 'black', color: theme === 'light' ? 'black' : 'white' }} key={dept.id} value={dept.name}>{dept.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <EmployeeCardGrid
                employees={filteredEmployees}
                isLoading={loading}
                onViewProfile={(id) => navigate(`/hr/employees/${id}`)}
            />
        </div>
    );
};

export default EmployeeDirectory;
