import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getEmployeeWorksheets,
    createEmployeeWorksheet,
    getWorksheetSummary,
    getActiveProjects,
} from "~/services/employee.api";
import { toast } from "react-toastify";
import {
    Plus, Clock, Calendar, CheckCircle, Send,
    FileText, CheckSquare, ChevronLeft, ChevronRight, Upload, X
} from "lucide-react";
import { format } from "date-fns";
import { resolveFileUrl } from "~/lib/fileUrl";

const Worksheets = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [isAddLogOpen, setIsAddLogOpen] = useState(false);

    // Pagination & Filters (History)
    const [page, setPage] = useState(1);
    const [selectedMonth, setSelectedMonth] = useState(format(new Date(), "yyyy-MM"));

    // Form State
    const [formData, setFormData] = useState({
        projectId: "",
        workingHours: 8,
        primaryTasks: "",
        description: "",
        blockers: ""
    });
    const [selectedFiles, setSelectedFiles] = useState([]);

    // 1. Fetch Summary
    const { data: summary, isLoading: isSummaryLoading } = useQuery({
        queryKey: ["worksheetSummary"],
        queryFn: getWorksheetSummary,
    });

    // 2. Fetch History
    const { data: historyData, isLoading: isHistoryLoading } = useQuery({
        queryKey: ["employeeWorksheets", page, selectedMonth],
        queryFn: () => getEmployeeWorksheets({ page, limit: 10, month: selectedMonth }),
    });

    // 3. Fetch Active Projects
    const { data: activeProjects, isLoading: isProjectsLoading } = useQuery({
        queryKey: ["activeProjects"],
        queryFn: getActiveProjects,
    });

    const createMutation = useMutation({
        mutationFn: createEmployeeWorksheet,
        onSuccess: () => {
            queryClient.invalidateQueries(["worksheetSummary"]);
            queryClient.invalidateQueries(["employeeWorksheets"]);
            toast.success("Worksheet submitted successfully!");
            setIsAddLogOpen(false);
            setFormData({
                projectId: "",
                workingHours: 8,
                primaryTasks: "",
                description: "",
                blockers: ""
            });
            setSelectedFiles([]);
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to submit worksheet");
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        const data = new FormData();
        if (formData.projectId) data.append("projectId", formData.projectId);
        data.append("workingHours", formData.workingHours);
        data.append("primaryTasks", formData.primaryTasks);
        data.append("description", formData.description);
        data.append("blockers", formData.blockers);

        if (selectedFiles.length > 0) {
            selectedFiles.forEach((file) => {
                data.append("files", file);
            });
        } else {
            toast.error("Please upload at least one project file.");
            return;
        }

        createMutation.mutate(data);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setSelectedFiles((prev) => [...prev, ...newFiles]);
        }
    };

    const removeFile = (index) => {
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const isSubmittedToday = summary?.todayStatus === "submitted";

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-all"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Back
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Daily Worksheets</h1>
                        <p className="text-sm text-muted-foreground">Track your daily progress and tasks</p>
                    </div>
                </div>

                {!isSubmittedToday && (
                    <button
                        onClick={() => setIsAddLogOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition shadow-lg shadow-primary/30"
                    >
                        <Plus className="w-4 h-4" /> Submit Worksheet
                    </button>
                )}
                {isSubmittedToday && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-600 rounded-lg border border-green-500/20">
                        <CheckCircle className="w-4 h-4" /> Completed for Today
                    </div>
                )}
            </div>

            {/* Top Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-card dark:bg-card p-6 rounded-xl border border-border shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-100">
                        <Calendar className="w-16 h-16 text-blue-600" />
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">Today's Status</p>
                    <h3 className={`text-2xl font-bold mt-2 ${isSubmittedToday ? "text-green-600" : "text-yellow-600"}`}>
                        {isSubmittedToday ? "Submitted" : "Pending"}
                    </h3>
                </div>

                <div className="bg-card dark:bg-card p-6 rounded-xl border border-border shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-100">
                        <CheckSquare className="w-16 h-16 text-green-600" />
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">Completed This Month</p>
                    <h3 className="text-2xl font-bold text-foreground mt-2">
                        {summary?.completedThisMonth || 0}
                    </h3>
                </div>

                <div className="bg-card dark:bg-card p-6 rounded-xl border border-border shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-100">
                        <Clock className="w-16 h-16 text-orange-600" />
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">Pending Review</p>
                    <h3 className="text-2xl font-bold text-foreground mt-2">
                        {summary?.pendingReviewCount || 0}
                    </h3>
                </div>
            </div>

            {/* History Table Section */}
            <div className="bg-card dark:bg-card rounded-xl border border-border shadow-sm flex flex-col">
                <div className="p-6 border-b border-border flex flex-col sm:flex-row justify-between items-center gap-4">
                    <h2 className="text-lg font-semibold text-foreground">Worksheet History</h2>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <input
                                type="month"
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-input rounded-lg bg-background text-sm text-foreground focus:ring-2 focus:ring-primary outline-none"
                            />
                            <Calendar className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-muted-foreground">
                        <thead className="bg-muted/30 text-foreground font-medium uppercase text-xs">
                            <tr>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Project Files</th>
                                <th className="px-6 py-4">Project</th>
                                <th className="px-6 py-4">Tasks</th>
                                <th className="px-6 py-4">Hours</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {isHistoryLoading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-muted-foreground">Loading history...</td>
                                </tr>
                            ) : historyData?.data?.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-muted-foreground">No worksheets found for this month.</td>
                                </tr>
                            ) : (
                                historyData?.data?.map((item) => (
                                    <tr key={item.id} className="hover:bg-muted/50 transition">
                                        <td className="px-6 py-4 font-medium text-foreground">
                                            {format(new Date(item.date), "MMM dd, yyyy")}
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.fileUrls && item.fileUrls.length > 0 ? (
                                                <div className="flex flex-col gap-1">
                                                    {item.fileUrls.map((url, idx) => (
                                                        <a key={idx} href={resolveFileUrl(url)} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                                                            <FileText className="w-3 h-3" /> File {idx + 1}
                                                        </a>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="text-muted-foreground">No Files</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.project ? (
                                                <span className="font-medium">{item.project.name}</span>
                                            ) : (
                                                <span className="text-muted-foreground italic">General</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 truncate max-w-xs text-foreground">{item.primaryTasks}</td>
                                        <td className="px-6 py-4 text-foreground">{item.workingHours}h</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium 
                                                ${item.status === 'APPROVED' ? 'bg-green-500/10 text-green-600' :
                                                    item.status === 'REJECTED' ? 'bg-red-500/10 text-red-600' :
                                                        'bg-yellow-500/10 text-yellow-600'}`}>
                                                {item.status || "Submitted"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-blue-600 hover:text-blue-500 font-medium text-xs">View Details</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {historyData?.meta?.totalPages > 1 && (
                    <div className="p-4 border-t border-border flex justify-end gap-2">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}
                            className="p-2 rounded-lg hover:bg-muted disabled:opacity-50 text-foreground"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <span className="flex items-center px-4 text-sm text-muted-foreground">
                            Page {page} of {historyData.meta.totalPages}
                        </span>
                        <button
                            disabled={page === historyData.meta.totalPages}
                            onClick={() => setPage(p => p + 1)}
                            className="p-2 rounded-lg hover:bg-muted disabled:opacity-50 text-foreground"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                )}
            </div>

            {/* Submission Modal */}
            {isAddLogOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/0 backdrop-blur-sm p-4">
                    <div className="bg-background dark:bg-jws-dark-gray text-foreground border border-border rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-border flex justify-between items-center shrink-0">
                            <h2 className="text-xl font-bold text-foreground">Submit Daily Worksheet</h2>
                            <button
                                onClick={() => setIsAddLogOpen(false)}
                                className="text-muted-foreground hover:text-foreground transition"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="m15 9-6 6" /><path d="m9 9 6 6" /></svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1">Reporting Date</label>
                                    <input
                                        type="text"
                                        value={format(new Date(), "yyyy-MM-dd")}
                                        disabled
                                        className="w-full px-4 py-2 rounded-lg border border-input bg-muted/50 text-muted-foreground cursor-not-allowed"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1">Working Hours</label>
                                    <input
                                        type="number"
                                        name="workingHours"
                                        value={formData.workingHours}
                                        onChange={handleInputChange}
                                        step="0.5"
                                        min="0.5"
                                        max="24"
                                        required
                                        className="w-full px-4 py-2 rounded-lg border border-input bg-secondary/50 text-foreground focus:ring-2 focus:ring-primary outline-none transition"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Project</label>
                                <select
                                    name="projectId"
                                    value={formData.projectId}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 rounded-lg border border-input bg-secondary/50 text-foreground focus:ring-2 focus:ring-primary outline-none transition"
                                >
                                    <option value="">-- General / Unassigned --</option>
                                    {activeProjects?.map(proj => (
                                        <option key={proj.id} value={proj.id}>{proj.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Project Files</label>
                                <div className="space-y-3">
                                    <div className="relative">
                                        <input
                                            type="file"
                                            multiple
                                            onChange={handleFileChange}
                                            className="hidden"
                                            id="project-file-upload"
                                        />
                                        <label
                                            htmlFor="project-file-upload"
                                            className="w-full px-4 py-3 rounded-lg border border-dashed border-input bg-muted/30 text-muted-foreground cursor-pointer hover:bg-muted transition flex items-center justify-center gap-2"
                                        >
                                            <Upload className="w-5 h-5 text-blue-500" />
                                            <span className="font-medium">Click to Upload Project Files</span>
                                        </label>
                                    </div>

                                    {/* Selected Files List */}
                                    {selectedFiles.length > 0 && (
                                        <ul className="space-y-2">
                                            {selectedFiles.map((file, index) => (
                                                <li key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded-lg border border-border">
                                                    <span className="text-sm text-foreground truncate max-w-[200px]">{file.name}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeFile(index)}
                                                        className="p-1 hover:bg-red-500/10 text-red-500 rounded-full transition"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Primary Tasks</label>
                                <input
                                    type="text"
                                    name="primaryTasks"
                                    value={formData.primaryTasks}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Brief summary of tasks handled..."
                                    className="w-full px-4 py-2 rounded-lg border border-input bg-secondary/50 text-foreground focus:ring-2 focus:ring-primary outline-none transition"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Detailed Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    required
                                    rows="4"
                                    placeholder="Detailed breakdown of work done..."
                                    className="w-full px-4 py-2 rounded-lg border border-input bg-secondary/50 text-foreground focus:ring-2 focus:ring-primary outline-none transition"
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Issues & Blockers (Optional)</label>
                                <textarea
                                    name="blockers"
                                    value={formData.blockers}
                                    onChange={handleInputChange}
                                    rows="2"
                                    placeholder="Any challenges faced?"
                                    className="w-full px-4 py-2 rounded-lg border border-input bg-secondary/50 text-foreground focus:ring-2 focus:ring-primary outline-none transition"
                                ></textarea>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-border">
                                <button
                                    type="button"
                                    onClick={() => setIsAddLogOpen(false)}
                                    className="px-4 py-2 rounded-lg text-foreground hover:bg-muted transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={createMutation.isPending}
                                    className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 transition shadow-lg shadow-primary/30 flex items-center gap-2"
                                >
                                    {createMutation.isPending ? "Submitting..." : (
                                        <>
                                            <Send className="w-4 h-4" /> Submit Worksheet
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Worksheets;
