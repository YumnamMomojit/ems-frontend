import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Wallet, Clock, CheckCircle2 } from "lucide-react";

const AdvanceStats = ({ advances }) => {
    const pending = advances.filter(a => a.status === "PENDING").length;
    const approved = advances.filter(a => a.status === "APPROVED").length;
    const active = advances.filter(a => a.status === "DISBURSED").length;

    return (
        <div className="grid gap-4 md:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{pending}</div>
                    <p className="text-xs text-muted-foreground">Awaiting approval</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Approved</CardTitle>
                    <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{approved}</div>
                    <p className="text-xs text-muted-foreground">Ready for disbursement</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Advances</CardTitle>
                    <Wallet className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{active}</div>
                    <p className="text-xs text-muted-foreground">Disbursed & Not Closed</p>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdvanceStats;
