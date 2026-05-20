import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { addDepartment } from "~/features/admin-dashboard/services/department.api"; // Assuming this service will be created
import { useNavigate } from "react-router-dom";
import { Building, CheckCircle, XCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

const departmentSchema = z.object({
  name: z.string().nonempty("Department Name is required"),
  // Add other fields if necessary, e.g., managerId, description
});

const AddDepartmentPage = () => {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(departmentSchema),
  });

  const onSubmit = async (data) => {
    setApiError("");
    setSuccessMessage("");
    try {
      await addDepartment(data.name);
      setSuccessMessage("Department added successfully!");
      reset();
    } catch (err) {
      setApiError(err.message || "Failed to add department.");
    }
  };

  return (
    <div
      className="min-h-screen p-6"
      style={{
        backgroundColor: "hsl(var(--background))",
        color: "hsl(var(--foreground))",
      }}>
      <Card
        className="w-full max-w-2xl mx-auto shadow-lg"
        style={{
          backgroundColor: "hsl(var(--card))",
          color: "hsl(var(--card-foreground))",
        }}>
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center">
            <Building className="h-6 w-6 mr-2" /> Add New Department
          </CardTitle>
          <CardDescription>
            Enter the details for the new department.
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
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-foreground">
                Department Name
              </label>
              <input
                type="text"
                id="name"
                {...register("name")}
                className="mt-1 block w-full rounded-md border border-input bg-background text-foreground shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-darkRed hover:bg-darkRed-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange disabled:opacity-50 disabled:cursor-not-allowed">
                <Building className="h-5 w-5 mr-2" />
                {isSubmitting ? "Adding Department..." : "Add Department"}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddDepartmentPage;
