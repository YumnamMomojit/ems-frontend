import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getEmployeeDocuments, uploadEmployeeDocument } from "~/services/employee.api";
import { toast } from "react-toastify";
import { Upload, File, Download, Trash2, FileText, X } from "lucide-react";
import { format } from "date-fns";
import api from "~/services/api"; // Need direct axis/api access for delete? Or add to service.

// Add delete to service if not exists, or define here for now if simple.
// user provided service has `uploadEmployeeDocument` and `getEmployeeDocuments`.
// It DOES NOT have delete.
// I should probably add delete to `employee.api.js` or just use `api.delete` here.
// Let's use `api.delete` directly for now to avoid switching files again, or I'll add it to service in next step if I want to be clean.
// `employee.api.js` Step 744:
// Line 36: `deleteEmployeeWorksheet`.
// No delete document.
// I will start by using `api.delete`/`axios.delete` pattern.
// Wait, `employee.api.js` imports `api` from `./api`.
// I can import `api` from `~/services/api`.

const Documents = () => {
    const queryClient = useQueryClient();
    const [uploading, setUploading] = useState(false);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [uploadFile, setUploadFile] = useState(null);
    const [uploadCategory, setUploadCategory] = useState("Other");
    const [uploadName, setUploadName] = useState("");

    const { data: documents, isLoading, isError } = useQuery({
        queryKey: ["employeeDocuments"],
        queryFn: getEmployeeDocuments,
    });

    const uploadMutation = useMutation({
        mutationFn: uploadEmployeeDocument,
        onSuccess: () => {
            queryClient.invalidateQueries(["employeeDocuments"]);
            toast.success("Document uploaded successfully!");
            setUploading(false);
            closeModal();
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to upload document");
            setUploading(false);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            await api.delete(`/employee/documents/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["employeeDocuments"]);
            toast.success("Document deleted");
        },
        onError: (error) => {
            toast.error("Failed to delete document");
        }
    });

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files[0]) {
            setUploadFile(e.target.files[0]);
            setUploadName(e.target.files[0].name);
        }
    };

    const handleUploadSubmit = (e) => {
        e.preventDefault();
        if (!uploadFile) return;

        const formData = new FormData();
        formData.append("document", uploadFile);
        formData.append("name", uploadName);
        formData.append("category", uploadCategory);

        setUploading(true);
        uploadMutation.mutate(formData);
    };

    const closeModal = () => {
        setIsUploadModalOpen(false);
        setUploadFile(null);
        setUploadName("");
        setUploadCategory("Other");
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this document?")) {
            deleteMutation.mutate(id);
        }
    };

    if (isLoading) return <div className="p-6">Loading documents...</div>;
    if (isError) return <div className="p-6">Error loading documents.</div>;

    const docList = documents || [];

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Documents</h1>
                    <p className="text-muted-foreground">Manage your personal and official documents</p>
                </div>
                <div>
                    <button
                        onClick={() => setIsUploadModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition shadow-lg shadow-primary/30"
                    >
                        <Upload className="w-4 h-4" /> Upload Document
                    </button>
                </div>
            </div>

            {/* Documents Grid */}
            {docList.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {docList.map((doc) => (
                        <div key={doc.id} className="bg-card dark:bg-card rounded-xl border border-border p-4 shadow-sm hover:shadow-md transition group relative">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`p-3 rounded-lg ${doc.isCompanyDoc ? 'bg-purple-500/10 text-purple-600' : 'bg-blue-500/10 text-blue-600'}`}>
                                        <FileText className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-foreground truncate max-w-[150px]" title={doc.name}>
                                            {doc.name}
                                        </h3>
                                        <p className="text-xs text-muted-foreground">
                                            {format(new Date(doc.uploadedAt || new Date()), "MMM dd, yyyy")} • {doc.category || "General"}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <a
                                        href={doc.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition"
                                        title="Download"
                                    >
                                        <Download className="w-5 h-5" />
                                    </a>
                                    {!doc.isCompanyDoc && (
                                        <button
                                            onClick={() => handleDelete(doc.id)}
                                            className="p-2 text-muted-foreground hover:text-red-600 hover:bg-red-500/10 rounded-lg transition"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            </div>
                            {doc.isCompanyDoc && (
                                <span className="absolute top-2 right-2 text-[10px] font-bold uppercase tracking-wider text-purple-600 bg-purple-500/10 px-2 py-0.5 rounded-full">
                                    Official
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-card dark:bg-card rounded-xl border border-dashed border-border p-12 text-center">
                    <div className="p-4 bg-muted rounded-full inline-block mb-4">
                        <File className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium text-foreground">No documents uploaded</h3>
                    <p className="text-muted-foreground mt-1">Upload your documents to keep them safe and accessible.</p>
                </div>
            )}

            {/* Upload Modal */}
            {isUploadModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-card dark:bg-card rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in duration-200 border border-border">
                        <div className="p-6 border-b border-border flex justify-between items-center">
                            <h2 className="text-xl font-bold text-foreground">Upload Document</h2>
                            <button onClick={closeModal} className="text-muted-foreground hover:text-foreground transition">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handleUploadSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Document Name</label>
                                <input
                                    type="text"
                                    value={uploadName}
                                    onChange={(e) => setUploadName(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-primary outline-none transition"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Category</label>
                                <select
                                    value={uploadCategory}
                                    onChange={(e) => setUploadCategory(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-primary outline-none transition"
                                >
                                    <option value="ID Proof">ID Proof</option>
                                    <option value="Educational">Educational</option>
                                    <option value="Experience">Experience</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">File</label>
                                <div className="border border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:bg-muted/50 transition relative">
                                    <input
                                        type="file"
                                        onChange={handleFileSelect}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        required
                                    />
                                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                                        <Upload className="w-6 h-6 mb-2" />
                                        <span className="text-sm truncate max-w-[200px]">{uploadFile ? uploadFile.name : "Click to select file"}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 rounded-lg text-foreground hover:bg-muted transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={uploading}
                                    className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg shadow-primary/30"
                                >
                                    {uploading ? "Uploading..." : "Upload"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Documents;
