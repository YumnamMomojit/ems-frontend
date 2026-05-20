import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  addEmployee,
  getManagers,
} from "~/features/admin-dashboard/services/employee.api"; // Assuming this service will be created
import { getDepartments } from "~/features/admin-dashboard/services/department.api"; // Import getDepartments
import { getTeams } from "~/features/admin-dashboard/services/team.api";
import { UserPlus, CheckCircle, XCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

const employeeSchema = z.object({
  firstName: z.string().nonempty("First Name is required"),
  lastName: z.string().nonempty("Last Name is required"),
  email: z
    .string()
    .email("Invalid email address")
    .nonempty("Email is required"),
  phone: z.string().optional(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .nonempty("Password is required"),
  designation: z.string().nonempty("Designation is required"),
  salary: z.preprocess(
    (val) => Number(val),
    z.number().min(0, "Salary must be a positive number"),
  ),
  dateOfJoining: z.string().nonempty("Date of Joining is required"),
  departmentId: z.string().nonempty("Department is required"), // Assuming department selection
  role: z.string().nonempty("User Role is required"), // User role for login
  employeeStatus: z.string().nonempty("Employee Status is required"),
  managerId: z.string().nonempty("Manager is required"),
  teamId: z.string().optional(),
});

const AddEmployeePage = () => {
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [departments, setDepartments] = useState([]); // State to store departments
  const [loadingDepartments, setLoadingDepartments] = useState(true); // State for loading indicator
  const [departmentError, setDepartmentError] = useState(""); // State for department fetch error

  const [managers, setManagers] = useState([]);
  const [loadingManagers, setLoadingManagers] = useState(true);
  const [teams, setTeams] = useState([]);
  const [loadingTeams, setLoadingTeams] = useState(false);
  const [_teamError, setTeamError] = useState("");

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [deptData, managerData] = await Promise.all([
          getDepartments(),
          getManagers(),
        ]);
        setDepartments(deptData);
        setManagers(managerData);
      } catch (err) {
        setDepartmentError("Failed to load initial data.");
        console.error("Error fetching data:", err);
      } finally {
        setLoadingDepartments(false);
        setLoadingManagers(false);
      }
    };
    fetchInitialData();
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(employeeSchema),
  });

  const selectedManagerId = watch("managerId");

  useEffect(() => {
    if (selectedManagerId) {
      const fetchTeamsForManager = async () => {
        setLoadingTeams(true);
        setTeamError("");
        try {
          const teamData = await getTeams(selectedManagerId);
          setTeams(teamData);
        } catch (err) {
          setTeamError("Failed to load teams.");
        } finally {
          setLoadingTeams(false);
        }
      };
      fetchTeamsForManager();
    } else {
      setTeams([]);
    }
  }, [selectedManagerId]);

  const onSubmit = async (data) => {
    setApiError("");
    setSuccessMessage("");
    try {
      // Assuming a simplified structure for now, adjust based on backend DTO
      const employeeData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        password: data.password,
        designation: data.designation,
        salary: data.salary,
        dateOfJoining: new Date(data.dateOfJoining).toISOString(),
        departmentId: data.departmentId,
        userRole: data.role, // Mapping to userRole for backend
        employeeStatus: data.employeeStatus,
        managerId: data.managerId,
        teamId: data.teamId || null,
      };

      await addEmployee(employeeData);
      setSuccessMessage("Employee added successfully!");
      reset();
    } catch (err) {
      setApiError(err.message || "Failed to add employee.");
    }
  };

  const mockRoles = ["EMPLOYEE", "MANAGER", "HR"]; // Exclude SUPER_ADMIN and ADMIN for new members
  const fieldClass =
    "mt-1 block w-full rounded-md border border-input bg-background text-foreground shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring";

  return (
    <div
      className="min-h-screen p-6"
      style={{
        backgroundColor: "hsl(var(--background))",
        color: "hsl(var(--foreground))",
      }}>
      <Card
        className="w-full max-w-4xl mx-auto shadow-lg"
        style={{
          backgroundColor: "hsl(var(--card))",
          color: "hsl(var(--card-foreground))",
        }}>
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center">
            <UserPlus className="h-6 w-6 mr-2" /> Add New Member
          </CardTitle>
          <CardDescription>
            Fill in the details below to add a new member to the system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {apiError && (
            <div
              className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded relative mb-4"
              role="alert">
              <strong className="font-bold">Error!</strong>
              <span className="block sm:inline ml-2">{apiError}</span>
              <span
                className="absolute top-0 bottom-0 right-0 px-4 py-3"
                onClick={() => setApiError("")}>
                <XCircle className="h-6 w-6" />
              </span>
            </div>
          )}
          {successMessage && (
            <div
              className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 px-4 py-3 rounded relative mb-4"
              role="alert">
              <strong className="font-bold">Success!</strong>
              <span className="block sm:inline ml-2">{successMessage}</span>
              <span
                className="absolute top-0 bottom-0 right-0 px-4 py-3"
                onClick={() => setSuccessMessage("")}>
                <CheckCircle className="h-6 w-6" />
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-foreground">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  {...register("firstName")}
                  className={fieldClass}
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.firstName.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-foreground">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  {...register("lastName")}
                  className={fieldClass}
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-foreground">
                Email
              </label>
              <input
                type="email"
                id="email"
                {...register("email")}
                className={fieldClass}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-foreground">
                Phone (Optional)
              </label>
              <input
                type="text"
                id="phone"
                {...register("phone")}
                className={fieldClass}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-foreground">
                Password
              </label>
              <input
                type="password"
                id="password"
                {...register("password")}
                className={fieldClass}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="designation"
                  className="block text-sm font-medium text-foreground">
                  Designation
                </label>
                <input
                  type="text"
                  id="designation"
                  {...register("designation")}
                  className={fieldClass}
                />
                {errors.designation && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.designation.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="salary"
                  className="block text-sm font-medium text-foreground">
                  Salary
                </label>
                <input
                  type="number"
                  id="salary"
                  {...register("salary")}
                  step="0.01"
                  className={fieldClass}
                />
                {errors.salary && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.salary.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="dateOfJoining"
                  className="block text-sm font-medium text-foreground">
                  Date of Joining
                </label>
                <input
                  type="date"
                  id="dateOfJoining"
                  {...register("dateOfJoining")}
                  className={fieldClass}
                />
                {errors.dateOfJoining && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.dateOfJoining.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="departmentId"
                  className="block text-sm font-medium text-foreground">
                  Department
                </label>
                <select
                  id="departmentId"
                  {...register("departmentId")}
                  className={fieldClass}
                  disabled={loadingDepartments}>
                  <option value="">
                    {loadingDepartments
                      ? "Loading Departments..."
                      : "Select Department"}
                  </option>
                  {departmentError && (
                    <option value="" disabled>
                      {departmentError}
                    </option>
                  )}
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
                {errors.departmentId && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.departmentId.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-foreground">
                  User Role
                </label>
                <select id="role" {...register("role")} className={fieldClass}>
                  <option value="">Select Role</option>
                  {mockRoles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
                {errors.role && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.role.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="employeeStatus"
                  className="block text-sm font-medium text-foreground">
                  Employee Status
                </label>
                <select
                  id="employeeStatus"
                  {...register("employeeStatus")}
                  className={fieldClass}>
                  <option value="">Select Status</option>
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                  <option value="RESIGNED">RESIGNED</option>
                  <option value="TERMINATED">TERMINATED</option>
                </select>
                {errors.employeeStatus && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.employeeStatus.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
              <div>
                <label
                  htmlFor="managerId"
                  className="block text-sm font-medium text-foreground">
                  Assign Manager
                </label>
                <select
                  id="managerId"
                  {...register("managerId")}
                  className={fieldClass}
                  disabled={loadingManagers}>
                  <option value="">
                    {loadingManagers ? "Loading Managers..." : "Select Manager"}
                  </option>
                  {managers.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.email})
                    </option>
                  ))}
                </select>
                {errors.managerId && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.managerId.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="teamId"
                  className="block text-sm font-medium text-foreground">
                  Assign Team (Optional)
                </label>
                <select
                  id="teamId"
                  {...register("teamId")}
                  className={fieldClass}
                  disabled={loadingTeams || !selectedManagerId}>
                  <option value="">
                    {!selectedManagerId
                      ? "Select a manager first"
                      : loadingTeams
                        ? "Loading Teams..."
                        : teams.length === 0
                          ? "No teams found for this manager"
                          : "Select Team"}
                  </option>
                  {teams.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
                {errors.teamId && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.teamId.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-darkRed hover:bg-darkRed-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange disabled:opacity-50 disabled:cursor-not-allowed">
                <UserPlus className="h-5 w-5 mr-2" />
                {isSubmitting ? "Adding Member..." : "Add Member"}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddEmployeePage;
