import React, { useState, useEffect } from "react";
import managerService from "../services/manager.service";
import { format } from "date-fns";
import { Check, X, MessageSquare, AlertCircle } from "lucide-react";
import { useToast } from "~/hooks/use-toast";

const WorksheetReview = () => {
    const [worksheets, setWorksheets] = useState([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const fetchWorksheets = async () => {
        setLoading(true);
        try {
            const data = await managerService.getTeamWorksheets();
            setWorksheets(data);
        } catch (err) {
            console.error("Worksheet fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWorksheets();
    }, []);

    const handleAction = async (id, status) => {
        const comment = prompt("Enter a comment (required for rejection):");
        if (status === "REJECTED" && !comment) {
            toast({ title: "Comment required", description: "You must provide a reason for rejection.", variant: "destructive" });
            return;
        }

        try {
            await managerService.approveWorksheet(id, status, comment);
            toast({ title: `Worksheet ${status.toLowerCase()}`, description: `Action processed successfully.` });
            fetchWorksheets();
        } catch (err) {
            toast({ title: "Action failed", description: "Failed to update worksheet.", variant: "destructive" });
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Worksheet Review</h1>
                <p className="text-muted-foreground">Approve or request changes on daily task reports.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full py-10 text-center text-muted-foreground">Loading worksheets...</div>
                ) : worksheets.length === 0 ? (
                    <div className="col-span-full py-10 text-center text-muted-foreground">No worksheets submitted.</div>
                ) : (
                    worksheets.map((ws) => (
                        <div key={ws.id} className="bg-card border rounded-xl shadow-sm p-5 space-y-4 hover:border-primary/50 transition-colors">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold">{ws.employee.firstName} {ws.employee.lastName}</h3>
                                    <p className="text-xs text-muted-foreground">{format(new Date(ws.date), "MMMM dd, yyyy")}</p>
                                </div>
                                <div className="text-xs font-semibold px-2 py-1 bg-primary/10 text-primary rounded">
                                    {ws.totalHours} hrs
                                </div>
                            </div>

                            <div className="space-y-2">
                                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Tasks Done</p>
                                <p className="text-sm line-clamp-3" title={ws.tasksDone}>{ws.tasksDone}</p>
                            </div>

                            {ws.blockers && (
                                <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm flex gap-2">
                                    <AlertCircle className="h-4 w-4 shrink-0" />
                                    <p className="text-xs font-medium">{ws.blockers}</p>
                                </div>
                            )}

                            <div className="pt-4 border-t flex gap-2">
                                <button
                                    onClick={() => handleAction(ws.id, "APPROVED")}
                                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                                >
                                    <Check className="h-4 w-4" /> Approve
                                </button>
                                <button
                                    onClick={() => handleAction(ws.id, "REJECTED")}
                                    className="flex-1 flex items-center justify-center gap-2 py-2 border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors"
                                >
                                    <X className="h-4 w-4" /> Reject
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default WorksheetReview;
