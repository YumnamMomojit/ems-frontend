import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "~/services/api";
import EmployeeFilterBar from "../components/employee/EmployeeFilterBar";
import EmployeeCard from "../components/employee/EmployeeCard";
import { Button } from "~/components/employee-ui/button";
import { ChevronLeft, ChevronRight, Loader2, X, Save } from "lucide-react";
import { getDepartments } from "~/features/admin-dashboard/services/department.api";
import { getManagers } from "~/features/admin-dashboard/services/employee.api";
import { getTeams } from "~/features/admin-dashboard/services/team.api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "~/components/employee-ui/dialog";
import { Label } from "~/components/employee-ui/label";
import { Input } from "~/components/employee-ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/employee-ui/select";
import { toast } from "react-toastify";

const EmployeeListPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // State for filters (synced with URL would be ideal, but local state for simplicity first)
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);

  // Debounce search
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1); // Reset to page 1 on search change
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [
      "adminEmployees",
      page,
      debouncedSearch,
      roleFilter,
      statusFilter,
    ],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "12",
        search: debouncedSearch,
        role: roleFilter,
        status: statusFilter,
      });
      const response = await api.get(`/admin/employees?${params.toString()}`);
      return response.data; // Expecting { data: [], meta: {} }
    },
    keepPreviousData: true,
  });

  const employees = data?.data || [];
  const meta = data?.meta || { totalPages: 1, total: 0 };

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formData, setFormData] = useState({
    employeeCode: "",
    departmentId: "",
    role: "",
    teamId: "",
    reportsToId: "",
  });

  // Data for Dropdowns
  const [departments, setDepartments] = useState([]);
  const [managers, setManagers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  // Fetch initial data for dropdowns
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [depts, mgrs] = await Promise.all([
          getDepartments(),
          getManagers(),
        ]);
        setDepartments(depts);
        setManagers(mgrs);
      } catch (error) {
        console.error("Failed to load dropdown data", error);
      }
    };
    fetchData();
  }, []);

  // Fetch teams when department or manager changes (optional refinement)
  // For now, fetching all teams or filtering based on dept could work.
  // Let's implement fetch teams based on selected Manager if logical,
  // or just fetch all teams for now if API supports it.
  // Assuming getTeams needs managerId, we'll fetch when manager selected.

  const handleEditProfile = async (employee) => {
    setEditingEmployee(employee);
    setFormData({
      employeeCode: employee.employeeCode || "",
      departmentId: employee.departmentId || "",
      role: employee.user?.role || "EMPLOYEE",
      teamId: employee.teamId || "",
      reportsToId: employee.reportsToId || "",
    });

    // Fetch teams if manager is already assigned
    if (employee.reportsToId) {
      try {
        const teamData = await getTeams(employee.reportsToId);
        setTeams(teamData);
      } catch (e) {
        console.error("Error fetching teams", e);
        setTeams([]);
      }
    } else {
      setTeams([]);
    }

    setIsEditModalOpen(true);
  };

  const handleUpdateEmployee = async () => {
    if (!editingEmployee) return;

    try {
      await api.put(`/admin/employees/${editingEmployee.id}`, {
        employeeCode: formData.employeeCode,
        departmentId: formData.departmentId,
        userRole: formData.role,
        teamId: formData.teamId || null,
        reportsToId:
          formData.role === "MANAGER" || formData.role === "HR"
            ? null
            : formData.reportsToId,
      });

      toast.success("Employee profile updated successfully");
      setIsEditModalOpen(false);
      refetch(); // Refresh list
    } catch (error) {
      console.error("Update failed", error);
      toast.error("Failed to update profile");
    }
  };

  const handleRoleChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      role: value,
      // Clear manager if switching to Manager/HR
      reportsToId:
        value === "MANAGER" || value === "HR" ? "" : prev.reportsToId,
    }));
  };

  const handleManagerChange = async (value) => {
    setFormData((prev) => ({ ...prev, reportsToId: value }));
    // Fetch teams for this manager
    if (value) {
      try {
        const teamData = await getTeams(value);
        setTeams(teamData);
      } catch (e) {
        setTeams([]);
      }
    } else {
      setTeams([]);
    }
  };

  const handleToggleStatus = (id, newStatus) => {
    // Placeholder for status toggle API
    console.log("Toggle status", id, newStatus);
  };

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen font-sans text-foreground">
      <div className="flex flex-col gap-1 mb-2">
        <h1 className="text-2xl font-bold text-foreground">Employees</h1>
        <p className="text-muted-foreground">Manage system access and roles.</p>
      </div>

      <EmployeeFilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        roleFilter={roleFilter}
        setRoleFilter={(val) => {
          setRoleFilter(val);
          setPage(1);
        }}
        statusFilter={statusFilter}
        setStatusFilter={(val) => {
          setStatusFilter(val);
          setPage(1);
        }}
        totalResult={meta.total}
      />

      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin mb-2 text-primary" />
          <p>Loading directory...</p>
        </div>
      ) : isError ? (
        <div className="text-center py-20 text-red-500">
          Failed to load employees. Please try again.
        </div>
      ) : employees.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground bg-card rounded-xl border border-dashed border-border">
          No employees found matching your filters.
          <Button
            variant="link"
            onClick={() => {
              setSearchTerm("");
              setRoleFilter("all");
              setStatusFilter("all");
            }}>
            Clear Filters
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {employees.map((emp) => (
              <EmployeeCard
                key={emp.id}
                employee={emp}
                onViewProfile={(id) => navigate(`/admin/employees/${id}`)}
                onEditProfile={handleEditProfile}
                onToggleStatus={handleToggleStatus}
              />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-8 pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              Page {meta.page} of {meta.totalPages}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}>
                <ChevronLeft className="h-4 w-4 mr-1" /> Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= meta.totalPages}
                onClick={() => setPage((p) => p + 1)}>
                Next <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </>
      )}
      {/* Edit Profile Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-xl bg-background border-border text-foreground">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="employeeCode">Employee ID</Label>
              <Input
                id="employeeCode"
                value={formData.employeeCode}
                onChange={(e) =>
                  setFormData({ ...formData, employeeCode: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={formData.role} onValueChange={handleRoleChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EMPLOYEE">Employee</SelectItem>
                  <SelectItem value="MANAGER">Manager</SelectItem>
                  <SelectItem value="HR">HR</SelectItem>
                  <SelectItem value="ORG_ADMIN">Org Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select
                value={formData.departmentId}
                onValueChange={(val) =>
                  setFormData({ ...formData, departmentId: val })
                }>
                <SelectTrigger>
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Conditionally Show Manager Field */}
            {(formData.role === "EMPLOYEE" ||
              formData.role === "ORG_ADMIN") && (
              <div className="space-y-2">
                <Label htmlFor="manager">Manager</Label>
                <Select
                  value={formData.reportsToId}
                  onValueChange={handleManagerChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Manager" />
                  </SelectTrigger>
                  <SelectContent>
                    {managers.map((mgr) => (
                      <SelectItem key={mgr.id} value={mgr.id}>
                        {mgr.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="team">Team</Label>
              <Select
                value={formData.teamId}
                onValueChange={(val) =>
                  setFormData({ ...formData, teamId: val })
                }
                disabled={!formData.reportsToId && teams.length === 0}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Team" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((team) => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleUpdateEmployee}
              className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Save className="w-4 h-4 mr-2" /> Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeeListPage;
