import React from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { X } from "lucide-react";

const WorksheetViewer = ({ worksheet, onClose }) => {
    if (!worksheet) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl bg-card shadow-2xl animate-in fade-in zoom-in duration-200">
                <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
                    <CardTitle className="text-xl">Worksheet Details</CardTitle>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-muted rounded-full transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs uppercase text-muted-foreground font-semibold">Employee</p>
                            <p className="text-sm font-medium">{worksheet.employee.firstName} {worksheet.employee.lastName}</p>
                        </div>
                        <div>
                            <p className="text-xs uppercase text-muted-foreground font-semibold">Date</p>
                            <p className="text-sm font-medium">{format(new Date(worksheet.date), "MMMM dd, yyyy")}</p>
                        </div>
                        <div>
                            <p className="text-xs uppercase text-muted-foreground font-semibold">Project</p>
                            <p className="text-sm font-medium">{worksheet.project}</p>
                        </div>
                        <div>
                            <p className="text-xs uppercase text-muted-foreground font-semibold">Total Hours</p>
                            <p className="text-sm font-medium">{worksheet.totalHours} hrs</p>
                        </div>
                    </div>

                    <div>
                        <p className="text-xs uppercase text-muted-foreground font-semibold mb-2">Tasks Done</p>
                        <div className="p-3 bg-muted/50 rounded-lg text-sm whitespace-pre-wrap">
                            {worksheet.tasksDone}
                        </div>
                    </div>

                    <div>
                        <p className="text-xs uppercase text-muted-foreground font-semibold mb-2">Work Summary</p>
                        <p className="text-sm text-foreground leading-relaxed">
                            {worksheet.workSummary}
                        </p>
                    </div>

                    {worksheet.blockers && (
                        <div>
                            <p className="text-xs uppercase text-destructive font-semibold mb-2">Blockers</p>
                            <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg border border-destructive/20">
                                {worksheet.blockers}
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default WorksheetViewer;
