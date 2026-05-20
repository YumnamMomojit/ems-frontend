import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "~/hooks/AuthContext";
import {
  requestAdvance,
  getAdvanceRequests,
  approveAdvance,
} from "~/features/admin-dashboard/services/advance.api";
import { parseISO } from "date-fns";
import { HandCoins, CheckCircle, XCircle, ArrowRight } from "lucide-react";
import { useOrganization } from "~/hooks/OrganizationContext";

const advanceSchema = z.object({
  amount: z.preprocess(
    (val) => Number(val),
    z.number().min(0.01, "Amount must be positive"),
  ),
  reason: z.string().nonempty("Reason is required"),
});

const AdvancePage = () => {
  const { user } = useAuth();
  const [advanceRequests, setAdvanceRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(advanceSchema),
  });

  useEffect(() => {
    if (user) {
      fetchAdvanceRequests();
    }
  }, [user]);

  const fetchAdvanceRequests = async () => {
    setLoading(true);
    try {
      const requests = await getAdvanceRequests();
      const filteredRequests = requests
        .filter(
          (req) =>
            user.role === "ADMIN" || user.role === "SUPER_ADMIN" ? true : false, // Only ADMIN or SUPER_ADMIN can see all requests now.
        )
        .sort(
          (a, b) =>
            parseISO(b.requestedAt).getTime() -
            parseISO(a.requestedAt).getTime(),
        );
      setAdvanceRequests(filteredRequests);
    } catch (err) {
      setApiError(err.message || "Failed to fetch advance requests.");
    } finally {
      setLoading(false);
    }
  };

  const onRequestSubmit = async (data) => {
    setApiError("");
    setSuccessMessage("");
    try {
      await requestAdvance(user.id, data.amount, data.reason);
      setSuccessMessage("Advance request submitted successfully!");
      reset();
      fetchAdvanceRequests();
    } catch (err) {
      setApiError(err.message || "Failed to submit advance request.");
    }
  };

  const handleApproveReject = async (requestId, status) => {
    setApiError("");
    setSuccessMessage("");
    try {
      await approveAdvance(requestId, status);
      setSuccessMessage(
        `Advance request ${status.toLowerCase()}ed successfully!`,
      );
      fetchAdvanceRequests();
    } catch (err) {
      setApiError(
        err.message || `Failed to ${status.toLowerCase()} advance request.`,
      );
    }
  };

  const canApprove = user.role === "ADMIN" || user.role === "SUPER_ADMIN";

  return (
    <div
      className="min-h-screen p-6"
      style={{
        backgroundColor: "hsl(var(--background))",
        color: "hsl(var(--foreground))",
      }}>
      <h1 className="text-3xl font-bold text-foreground mb-6">
        Advance Request Management
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

      {(user.role === "ADMIN" || user.role === "SUPER_ADMIN") && ( // Only admin or super admin can make requests
        <div
          className="p-6 rounded-lg shadow-md mb-8"
          style={{
            backgroundColor: "hsl(var(--card))",
            color: "hsl(var(--card-foreground))",
          }}>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Request Salary Advance
          </h2>
          <form onSubmit={handleSubmit(onRequestSubmit)} className="space-y-4">
            <div>
              <label
                htmlFor="amount"
                className="block text-sm font-medium text-foreground">
                Amount
              </label>
              <input
                type="number"
                id="amount"
                {...register("amount")}
                step="0.01"
                className="mt-1 block w-full rounded-md border border-input bg-background text-foreground shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
              />
              {errors.amount && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.amount.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="reason"
                className="block text-sm font-medium text-foreground">
                Reason
              </label>
              <textarea
                id="reason"
                {...register("reason")}
                rows="3"
                className="mt-1 block w-full rounded-md border border-input bg-background text-foreground shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"></textarea>
              {errors.reason && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.reason.message}
                </p>
              )}
            </div>
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-darkRed hover:bg-darkRed-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange disabled:opacity-50 disabled:cursor-not-allowed">
                <HandCoins className="h-5 w-5 mr-2" />
                {isSubmitting ? "Requesting..." : "Request Advance"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div
        className="p-6 rounded-lg shadow-md"
        style={{
          backgroundColor: "hsl(var(--card))",
          color: "hsl(var(--card-foreground))",
        }}>
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Advance Request History
        </h2>
        {loading ? (
          <p>Loading requests...</p>
        ) : advanceRequests.length === 0 ? (
          <p className="text-muted-foreground">No advance requests found.</p>
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
                    Amount
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Reason
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Repayment
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
                {advanceRequests.map((req) => (
                  <tr key={req.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                      {req.userId} {/* Replace with actual user name later */}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {currencySymbol}{req.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground max-w-xs truncate">
                      {req.reason}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          req.status === "Approved"
                            ? "bg-green-500/10 text-green-700 dark:text-green-300"
                            : req.status === "Rejected"
                              ? "bg-red-500/10 text-red-700 dark:text-red-300"
                              : "bg-yellow-500/10 text-yellow-700 dark:text-yellow-300"
                        }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          req.repayment === "Paid"
                            ? "bg-green-500/10 text-green-700 dark:text-green-300"
                            : "bg-orange-500/10 text-orange-700 dark:text-orange-300"
                        }`}>
                        {req.repayment}
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
                              className="text-darkRed hover:text-orange mr-3">
                              Approve
                            </button>
                            <button
                              onClick={() =>
                                handleApproveReject(req.id, "Rejected")
                              }
                              className="text-red-600 hover:text-red-900">
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

export default AdvancePage;
