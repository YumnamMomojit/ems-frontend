import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../../services/api';
import { FileText, Save, Bell } from 'lucide-react';
import { Button } from '~/components/employee-ui/button';
import { Input } from '~/components/employee-ui/input';
import { Label } from '~/components/employee-ui/label';
import { Switch } from '~/components/employee-ui/switch';
import { CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Skeleton } from '~/components/employee-ui/skeleton';
import { useToast } from '~/hooks/use-toast';

const WorksheetSettings = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const [formData, setFormData] = useState({
        submissionDeadline: '18:00',
        requiredHoursPerDay: 8,
        enableMissingAlerts: true,
    });

    const { data: config, isLoading } = useQuery({
        queryKey: ['worksheetConfig'],
        queryFn: async () => {
            const response = await api.get('/admin/policies/worksheet');
            return response.data;
        },
    });

    useEffect(() => {
        if (config) {
            setFormData({
                submissionDeadline: config.submissionDeadline,
                requiredHoursPerDay: config.requiredHoursPerDay,
                enableMissingAlerts: config.enableMissingAlerts,
            });
        }
    }, [config]);

    const updateMutation = useMutation({
        mutationFn: async (data) => {
            return await api.put('/admin/policies/worksheet', data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['worksheetConfig']);
            toast({
                title: 'Success',
                description: 'Worksheet settings updated successfully',
            });
        },
        onError: (error) => {
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Failed to update settings',
                variant: 'destructive',
            });
        },
    });

    const handleSave = () => {
        updateMutation.mutate(formData);
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-32 w-full rounded-xl" />
                <Skeleton className="h-96 w-full rounded-lg" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <CardHeader className="px-0">
                <CardTitle>Worksheet Settings</CardTitle>
                <CardDescription>
                    Configure worksheet submission requirements and deadlines
                </CardDescription>
            </CardHeader>
            <div className="space-y-6">
                {/* Submission Deadline */}
                <div className="space-y-2">
                    <Label htmlFor="deadline">
                        <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Daily Submission Deadline
                        </div>
                    </Label>
                    <Input
                        id="deadline"
                        type="time"
                        value={formData.submissionDeadline}
                        onChange={(e) =>
                            setFormData({ ...formData, submissionDeadline: e.target.value })
                        }
                    />
                    <p className="text-sm text-muted-foreground">
                        Time by which employees must submit their daily worksheets
                    </p>
                </div>

                {/* Required Hours */}
                <div className="space-y-2">
                    <Label htmlFor="requiredHours">Required Hours Per Day</Label>
                    <Input
                        id="requiredHours"
                        type="number"
                        min="1"
                        max="24"
                        step="0.5"
                        value={formData.requiredHoursPerDay}
                        onChange={(e) =>
                            setFormData({ ...formData, requiredHoursPerDay: parseFloat(e.target.value) })
                        }
                    />
                    <p className="text-sm text-muted-foreground">
                        Minimum hours that must be logged in worksheets daily
                    </p>
                </div>

                {/* Missing Alerts */}
                <div className="flex items-center justify-between space-y-0 rounded-lg border p-4">
                    <div className="space-y-0.5">
                        <Label htmlFor="enableAlerts" className="text-base">
                            <div className="flex items-center gap-2">
                                <Bell className="h-4 w-4" />
                                Enable Missing Worksheet Alerts
                            </div>
                        </Label>
                        <p className="text-sm text-muted-foreground">
                            Send notifications for employees who haven't submitted worksheets
                        </p>
                    </div>
                    <Switch
                        id="enableAlerts"
                        checked={formData.enableMissingAlerts}
                        onCheckedChange={(checked) =>
                            setFormData({ ...formData, enableMissingAlerts: checked })
                        }
                    />
                </div>

                {/* Save Button */}
                <div className="pt-4">
                    <Button
                        onClick={handleSave}
                        disabled={updateMutation.status === 'pending'}
                        className="w-full sm:w-auto"
                    >
                        <Save className="mr-2 h-4 w-4" />
                        Save Settings
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default WorksheetSettings;
