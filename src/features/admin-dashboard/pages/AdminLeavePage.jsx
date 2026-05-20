import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "~/hooks/AuthContext";
import {
  applyLeave,
  getLeaveRequests,
  approveLeave,
} from "~/features/admin-dashboard/services/leave.api";
import { format, parseISO } from "date-fns";
import { Plane, CheckCircle, XCircle, ArrowRight } from "lucide-react";

const leaveSchema = z
  .object({
    type: z.string().nonempty("Leave type is required"),
    reason: z.string().nonempty("Reason is required"),
    from: z.string().nonempty("From date is required"),
    to: z.string().nonempty("To date is required"),
  })
  .refine((data) => new Date(data.to) >= new Date(data.from), {
    message: "To date cannot be before From date",
    path: ["to"],
  });

const LeavePage = () => {
  const { user } = useAuth();
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(leaveSchema),
  });

  useEffect(() => {
    if (user) {
      fetchLeaveRequests();
    }
  }, [user]);

  const fetchLeaveRequests = async () => {
    setLoading(true);
    try {
      const requests = await getLeaveRequests();
      // For ADMIN, show all requests, no filtering by user.id
      const allRequests = requests.sort(
        (a, b) =>
          parseISO(b.requestedAt).getTime() - parseISO(a.requestedAt).getTime(),
      );
      setLeaveRequests(allRequests);
    } catch (err) {
      setApiError(err.message || "Failed to fetch leave requests.");
    } finally {
      setLoading(false);
    }
  };

  const onApplySubmit = async (data) => {
    setApiError("");
    setSuccessMessage("");
    try {
      await applyLeave(user.id, data.type, data.reason, data.from, data.to);
      setSuccessMessage("Leave request submitted successfully!");
      reset();
      fetchLeaveRequests();
    } catch (err) {
      setApiError(err.message || "Failed to submit leave request.");
    }
  };

  const handleApproveReject = async (requestId, status) => {
    setApiError("");
    setSuccessMessage("");
    try {
      await approveLeave(requestId, status);
      setSuccessMessage(
        `Leave request ${status.toLowerCase()}ed successfully!`,
      );
      fetchLeaveRequests();
    } catch (err) {
      setApiError(
        err.message || `Failed to ${status.toLowerCase()} leave request.`,
      );
    }
  };

  const canApprove = user.role === "ADMIN" || user.role === "SUPER_ADMIN";

  return (
    <div className="min-h-screen p-6 bg-background text-foreground">
      <h1 className="text-3xl font-bold text-foreground mb-6">
        Leave Management
      </h1>

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

      {user.role === "EMPLOYEE" && ( // Only employees can apply for leave
        <div className="p-6 rounded-lg shadow-md mb-8 bg-card text-card-foreground">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Apply for Leave
          </h2>
          {/* ... Form content ... */}
        </div>
      )}

      <div className="p-6 rounded-lg shadow-md bg-card text-card-foreground">
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Leave Request History
        </h2>
        {loading ? (
          <p>Loading leave requests...</p>
        ) : leaveRequests.length === 0 ? (
          <p className="text-muted-foreground">No leave requests found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Employee
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Type
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Reason
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Duration
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  {canApprove && (
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {leaveRequests.map((req) => (
                  <tr key={req.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                      {req.userId} {/* Replace with actual user name later */}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {req.type}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground max-w-xs truncate">
                      {req.reason}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {format(parseISO(req.from), "MMM d")} -{" "}
                      {format(parseISO(req.to), "MMM d")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          req.status === "Approved"
                            ? "bg-green-500/10 text-green-600"
                            : req.status === "Rejected"
                              ? "bg-red-500/10 text-red-600"
                              : "bg-yellow-500/10 text-yellow-600"
                        }`}>
                        {req.status}
                      </span>
                    </td>
                    {canApprove && (
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {req.status === "Pending" && (
                          <>
                            <button
                              onClick={() =>
                                handleApproveReject(req.id, "Approved")
                              }
                              className="text-primary hover:text-primary/90 mr-3">
                              Approve
                            </button>
                            <button
                              onClick={() =>
                                handleApproveReject(req.id, "Rejected")
                              }
                              className="text-destructive hover:text-destructive/90">
                              Reject
                            </button>
                          </>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeavePage;
