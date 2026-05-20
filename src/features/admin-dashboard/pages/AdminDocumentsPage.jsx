import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "~/hooks/AuthContext";
import {
  uploadDocument,
  getDocuments,
} from "~/features/admin-dashboard/services/documents.api";
import { format, parseISO } from "date-fns";
import { Upload, FileText, XCircle, CheckCircle, Download } from "lucide-react";

const documentUploadSchema = z.object({
  type: z.string().nonempty("Document type is required"),
  url: z
    .string()
    .url("Invalid URL format")
    .nonempty("Document URL is required"),
});

const DocumentsPage = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(documentUploadSchema),
  });

  useEffect(() => {
    if (user) {
      fetchDocuments();
    }
  }, [user]);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      // For ADMIN, fetch all documents without filtering by user.id
      const allDocuments = await getDocuments(user.id); // The backend getDocuments still takes userId, assuming it will be ignored or handles admin case
      setDocuments(
        allDocuments.sort(
          (a, b) =>
            parseISO(b.uploadedAt).getTime() - parseISO(a.uploadedAt).getTime(),
        ),
      );
    } catch (err) {
      setApiError(err.message || "Failed to fetch documents.");
    } finally {
      setLoading(false);
    }
  };

  const onUploadSubmit = async (data) => {
    setApiError("");
    setSuccessMessage("");
    try {
      await uploadDocument(user.id, data.type, data.url);
      setSuccessMessage("Document uploaded successfully!");
      reset();
      fetchDocuments();
    } catch (err) {
      setApiError(err.message || "Failed to upload document.");
    }
  };

  const canUpload = user.role === "ADMIN" || user.role === "SUPER_ADMIN";

  return (
    <div className="universal-card-parent">
      <h1 className="text-3xl font-bold text-foreground mb-6">
        Document Management
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

      {canUpload && (
        <div className="p-6 rounded-lg shadow-md mb-8 universal-card-child">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Upload New Document
          </h2>
          <form onSubmit={handleSubmit(onUploadSubmit)} className="space-y-4">
            <div>
              <label
                htmlFor="type"
                className="block text-sm font-medium text-foreground">
                Document Type
              </label>
              <input
                type="text"
                id="type"
                {...register("type")}
                className="mt-1 block w-full rounded-md border border-input bg-background text-foreground shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
              />
              {errors.type && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.type.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="url"
                className="block text-sm font-medium text-foreground">
                Document URL
              </label>
              <input
                type="text"
                id="url"
                {...register("url")}
                placeholder="e.g., https://example.com/offer-letter.pdf"
                className="mt-1 block w-full rounded-md border border-input bg-background text-foreground shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
              />
              {errors.url && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.url.message}
                </p>
              )}
            </div>
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-darkRed hover:bg-darkRed-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange disabled:opacity-50 disabled:cursor-not-allowed">
                <Upload className="h-5 w-5 mr-2" />
                {isSubmitting ? "Uploading..." : "Upload Document"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="p-6 rounded-lg shadow-md universal-card-child">
        <h2 className="text-xl font-semibold text-foreground mb-4">
          All Documents
        </h2>
        {loading ? (
          <p>Loading documents...</p>
        ) : documents.length === 0 ? (
          <p className="text-muted-foreground">No documents found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Type
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Uploaded At
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {documents.map((doc) => (
                  <tr key={doc.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                      {doc.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {format(parseISO(doc.uploadedAt), "Pp")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-darkRed hover:text-orange inline-flex items-center">
                        <Download className="h-4 w-4 mr-1" /> Download
                      </a>
                    </td>
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

export default DocumentsPage;
