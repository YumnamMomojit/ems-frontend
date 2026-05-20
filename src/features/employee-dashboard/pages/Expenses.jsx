import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getEmployeeExpenses, createEmployeeExpense } from "~/services/employee.api";
import { toast } from "react-toastify";
import { Plus, FileText, DollarSign, Filter, Upload, X, Download } from "lucide-react";
import { format } from "date-fns";

const Expenses = () => {
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filterStatus, setFilterStatus] = useState("All");
    const [formData, setFormData] = useState({
        title: "",
        amount: "",
        category: "Travel",
        date: "",
        description: "",
        receipt: null, // File object
    });

    const { data: expenses, isLoading, isError } = useQuery({
        queryKey: ["employeeExpenses"],
        queryFn: getEmployeeExpenses,
    });

    const createExpenseMutation = useMutation({
        mutationFn: createEmployeeExpense,
        onSuccess: () => {
            queryClient.invalidateQueries(["employeeExpenses"]);
            toast.success("Expense claim submitted successfully!");
            setIsModalOpen(false);
            setFormData({
                title: "",
                amount: "",
                category: "Travel",
                date: "",
                description: "",
                receipt: null,
            });
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to submit expense claim");
        },
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFormData((prev) => ({ ...prev, receipt: e.target.files[0] }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append("title", formData.title);
        data.append("amount", formData.amount);
        data.append("category", formData.category);
        data.append("date", formData.date);
        data.append("description", formData.description);
        if (formData.receipt) {
            data.append("receipt", formData.receipt);
        }
        createExpenseMutation.mutate(data);
    };

    const expensesList = Array.isArray(expenses) ? expenses : [];

    const filteredExpenses = expensesList.filter((expense) => {
        if (filterStatus === "All") return true;
        return expense.status === filterStatus;
    });

    if (isLoading) return <div className="p-6">Loading expenses...</div>;
    if (isError) return <div className="p-6">Error loading expenses data.</div>;

    const getStatusColor = (status) => {
        switch (status) {
            case "APPROVED": return "text-green-600 bg-green-50 dark:bg-green-900/10";
            case "PAID": return "text-blue-600 bg-blue-50 dark:bg-blue-900/10";
            case "REJECTED": return "text-red-600 bg-red-50 dark:bg-red-900/10";
            default: return "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/10";
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Expenses</h1>
                    <p className="text-muted-foreground">Track and submit reimbursement claims</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="pl-9 pr-4 py-2 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-primary outline-none appearance-none cursor-pointer"
                        >
                            <option value="All">All Status</option>
                            <option value="PENDING">Pending</option>
                            <option value="APPROVED">Approved</option>
                            <option value="PAID">Paid</option>
                            <option value="REJECTED">Rejected</option>
                        </select>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition"
                    >
                        <Plus className="w-4 h-4" /> New Claim
                    </button>
                </div>
            </div>

            {/* Expenses Grid/Table */}
            <div className="bg-card dark:bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-muted/30 border-b border-border">
                                <th className="px-6 py-4 text-sm font-medium text-muted-foreground">Claim Details</th>
                                <th className="px-6 py-4 text-sm font-medium text-muted-foreground">Category</th>
                                <th className="px-6 py-4 text-sm font-medium text-muted-foreground">Amount</th>
                                <th className="px-6 py-4 text-sm font-medium text-muted-foreground">Date</th>
                                <th className="px-6 py-4 text-sm font-medium text-muted-foreground">Status</th>
                                <th className="px-6 py-4 text-sm font-medium text-muted-foreground text-right">Receipt</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filteredExpenses.length > 0 ? (
                                filteredExpenses.map((expense) => (
                                    <tr key={expense.id} className="hover:bg-muted/50 transition">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-foreground">{expense.title}</div>
                                            <div className="text-sm text-muted-foreground truncate max-w-xs">{expense.description}</div>
                                        </td>
                                        <td className="px-6 py-4 text-foreground">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-muted text-xs font-medium text-foreground">
                                                {expense.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-foreground">
                                            ${Number(expense.amount).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">
                                            {format(new Date(expense.date), "MMM dd, yyyy")}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(expense.status)}`}>
                                                {expense.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {expense.receiptUrl && (
                                                <a
                                                    href={expense.receiptUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center justify-center p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition"
                                                    title="View Receipt"
                                                >
                                                    <FileText className="w-5 h-5" />
                                                </a>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-muted-foreground">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="p-3 bg-muted rounded-full mb-3">
                                                <DollarSign className="w-6 h-6 text-muted-foreground" />
                                            </div>
                                            <p className="font-medium">No expenses found</p>
                                            <p className="text-sm mt-1">Submit a new claim to get started</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* New Expense Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-card dark:bg-card rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 border border-border">
                        <div className="p-6 border-b border-border flex justify-between items-center">
                            <h2 className="text-xl font-bold text-foreground">New Expense Claim</h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-muted-foreground hover:text-foreground transition"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Expense Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="e.g. Client Lunch, Uber Ride"
                                    className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-primary outline-none transition"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1">Amount ($)</label>
                                    <input
                                        type="number"
                                        name="amount"
                                        value={formData.amount}
                                        onChange={handleInputChange}
                                        required
                                        min="0"
                                        step="0.01"
                                        className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-primary outline-none transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1">Date</label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-primary outline-none transition"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Category</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-primary outline-none transition"
                                >
                                    <option value="Travel">Travel</option>
                                    <option value="Meals">Meals</option>
                                    <option value="Equipment">Equipment</option>
                                    <option value="Training">Training</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows="3"
                                    className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-primary outline-none transition"
                                    placeholder="Additional details..."
                                ></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Receipt (Optional)</label>
                                <div className="border border-dashed border-input rounded-lg p-4 text-center cursor-pointer hover:bg-muted/50 transition relative">
                                    <input
                                        type="file"
                                        onChange={handleFileChange}
                                        accept="image/*,.pdf"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                                        <Upload className="w-6 h-6 mb-2" />
                                        <span className="text-sm">{formData.receipt ? formData.receipt.name : "Click to upload receipt"}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 rounded-lg text-foreground hover:bg-muted transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={createExpenseMutation.isPending}
                                    className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg shadow-primary/30"
                                >
                                    {createExpenseMutation.isPending ? "Submitting..." : "Submit Claim"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Expenses;
