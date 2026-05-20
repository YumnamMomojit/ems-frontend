import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { Calendar, Clock, AlertCircle } from "lucide-react";
import { Button } from "~/components/employee-ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "~/components/employee-ui/dialog";
import { Input } from "~/components/employee-ui/input";
import { Textarea } from "~/components/employee-ui/textarea";
import { Label } from "~/components/employee-ui/label";
import { useToast } from "~/hooks/use-toast";
import { apiRequest } from "~/lib/queryClient";

export function RegularizationRequest({ isOpen, onClose }) {
    const { toast } = useToast();
    const [formData, setFormData] = useState({
        date: format(new Date(), "yyyy-MM-dd"),
        punchInTime: "",
        punchOutTime: "",
        reason: "",
    });

    const mutation = useMutation({
        mutationFn: async (data) => {
            // Combine date and time
            const payload = {
                date: data.date,
                punchInTime: data.punchInTime ? `${data.date}T${data.punchInTime}:00` : undefined,
                punchOutTime: data.punchOutTime ? `${data.date}T${data.punchOutTime}:00` : undefined,
                reason: data.reason,
            };
            return apiRequest("POST", "/api/employee/regularization/request", payload);
        },
        onSuccess: () => {
            toast({
                title: "Request Submitted",
                description: "Your regularization request has been sent for approval.",
            });
            onClose();
            setFormData({
                date: format(new Date(), "yyyy-MM-dd"),
                punchInTime: "",
                punchOutTime: "",
                reason: "",
            });
        },
        onError: (error) => {
            toast({
                title: "Error",
                description: error.message || "Failed to submit request.",
                variant: "destructive",
            });
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.reason || !formData.date) {
            toast({
                title: "Missing Fields",
                description: "Date and Reason are required.",
                variant: "destructive",
            });
            return;
        }
        mutation.mutate(formData);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Regularize Attendance</DialogTitle>
                    <DialogDescription>
                        Request correction for missed punches or incorrect timings.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <Label htmlFor="reg-date">Date</Label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="reg-date"
                                type="date"
                                className="pl-9"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="punch-in">Punch In Time</Label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="punch-in"
                                    type="time"
                                    className="pl-9"
                                    value={formData.punchInTime}
                                    onChange={(e) => setFormData({ ...formData, punchInTime: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="punch-out">Punch Out Time</Label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="punch-out"
                                    type="time"
                                    className="pl-9"
                                    value={formData.punchOutTime}
                                    onChange={(e) => setFormData({ ...formData, punchOutTime: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="reg-reason">Reason</Label>
                        <Textarea
                            id="reg-reason"
                            placeholder="Why are you regularizing?"
                            value={formData.reason}
                            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                            required
                        />
                    </div>

                    <Button type="submit" className="w-full" disabled={mutation.isPending}>
                        {mutation.isPending ? "Submitting..." : "Submit Request"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
