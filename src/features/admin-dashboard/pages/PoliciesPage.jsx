import React from 'react';
import { Card, CardContent } from '~/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/employee-ui/tabs';
import AttendancePolicy from '../components/policies/AttendancePolicy';
import LeavePolicy from '../components/policies/LeavePolicy';
import ExpensePolicy from '../components/policies/ExpensePolicy';
import WorksheetSettings from '../components/policies/WorksheetSettings';
import GeneralSettings from '../components/policies/GeneralSettings';

const PoliciesPage = () => {
    return (
        <div className="universal-card-parent max-w-6xl mx-auto">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-foreground">Organization Settings</h1>
                <p className="text-muted-foreground mt-1">
                    Manage your organization's rules, limits, and configuration settings in one place.
                </p>
            </div>

            <Tabs defaultValue="general" className="space-y-6">
                <TabsList className="bg-primary/10 p-1">
                    <TabsTrigger value="general" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">General</TabsTrigger>
                    <TabsTrigger value="attendance" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Attendance</TabsTrigger>
                    <TabsTrigger value="leave" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Leave</TabsTrigger>
                    <TabsTrigger value="expense" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Expense</TabsTrigger>
                    <TabsTrigger value="worksheet" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Worksheet</TabsTrigger>
                </TabsList>

                <Card
                    className="border-none shadow-md universal-card-child"
                >
                    <CardContent className="pt-6">
                        <TabsContent value="general" className="mt-0">
                            <GeneralSettings />
                        </TabsContent>
                        <TabsContent value="attendance" className="mt-0">
                            <AttendancePolicy />
                        </TabsContent>
                        <TabsContent value="leave" className="mt-0">
                            <LeavePolicy />
                        </TabsContent>
                        <TabsContent value="expense" className="mt-0">
                            <ExpensePolicy />
                        </TabsContent>
                        <TabsContent value="worksheet" className="mt-0">
                            <WorksheetSettings />
                        </TabsContent>
                    </CardContent>
                </Card>
            </Tabs>
        </div>
    );
};

export default PoliciesPage;
