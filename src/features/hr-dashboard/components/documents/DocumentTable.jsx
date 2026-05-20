import React from "react";
import { FileText, Download, Eye, MoreHorizontal, Trash2 } from "lucide-react";
import { format } from "date-fns";

const DocumentTable = ({ documents, loading, onDelete }) => {
    if (loading) {
        return (
            <div className="bg-card border rounded-xl overflow-hidden">
                <div className="p-4 space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-12 w-full bg-muted rounded animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    if (!documents || documents.length === 0) {
        return (
            <div className="text-center py-12 bg-card border rounded-xl border-dashed">
                <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                    <FileText className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">No documents found</h3>
                <p className="text-sm text-muted-foreground">Upload a new document to get started.</p>
            </div>
        );
    }

    const getStatusBadge = (status) => {
        switch (status) {
            case "Valid": return "bg-green-100 text-green-700 border-green-200";
            case "Expired": return "bg-red-100 text-red-700 border-red-200";
            case "Missing": return "bg-yellow-100 text-yellow-700 border-yellow-200";
            default: return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    return (
        <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-muted/50 border-b text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Document Name</th>
                            <th className="px-6 py-4">Employee</th>
                            <th className="px-6 py-4">Category</th>
                            <th className="px-6 py-4">Uploaded Date</th>
                            <th className="px-6 py-4">Visibility</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y text-sm">
                        {documents.map((doc) => (
                            <tr key={doc.id} className="hover:bg-muted/30 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                            <FileText className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-foreground line-clamp-1 max-w-[200px]">{doc.title}</p>
                                            <p className="text-xs text-muted-foreground uppercase">{doc.type}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    {doc.employee ? (
                                        <div className="flex flex-col">
                                            <span className="font-medium text-foreground">{doc.employee.firstName} {doc.employee.lastName}</span>
                                            <span className="text-xs text-muted-foreground">{doc.employee.employeeCode}</span>
                                        </div>
                                    ) : (
                                        <span className="text-muted-foreground italic">Company Wide</span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-muted text-muted-foreground">
                                        {doc.category}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-muted-foreground">
                                    {format(new Date(doc.createdAt), "MMM dd, yyyy")}
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-xs font-medium text-foreground border px-2 py-1 rounded-full">{doc.visibility}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadge(doc.status)}`}>
                                        {doc.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <a
                                            href={doc.fileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-1.5 hover:bg-muted rounded text-muted-foreground hover:text-primary transition-colors"
                                            title="View"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </a>
                                        <a
                                            href={doc.fileUrl}
                                            download
                                            className="p-1.5 hover:bg-muted rounded text-muted-foreground hover:text-primary transition-colors"
                                            title="Download"
                                        >
                                            <Download className="h-4 w-4" />
                                        </a>
                                        <button
                                            onClick={() => onDelete(doc.id)}
                                            className="p-1.5 hover:bg-red-50 text-muted-foreground hover:text-red-600 rounded transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DocumentTable;
