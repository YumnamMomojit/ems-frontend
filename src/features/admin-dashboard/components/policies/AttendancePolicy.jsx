import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../../services/api';
import { Clock, MapPin, Save } from 'lucide-react';
import { Button } from '~/components/employee-ui/button';
import { Input } from '~/components/employee-ui/input';
import { Label } from '~/components/employee-ui/label';
import { Switch } from '~/components/employee-ui/switch';
import { CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Skeleton } from '~/components/employee-ui/skeleton';
import { useToast } from '~/hooks/use-toast';

const AttendancePolicy = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const [formData, setFormData] = useState({
        workHoursPerDay: 8,
        lateThresholdMin: 15,
        allowWFH: false,
        requireGPS: true,
    });

    // Fetch attendance policy
    const { data: policy, isLoading } = useQuery({
        queryKey: ['attendancePolicy'],
        queryFn: async () => {
            const response = await api.get('/admin/policies/attendance');
            return response.data;
        },
    });

    // Update form when policy loads
    useEffect(() => {
        if (policy) {
            setFormData({
                workHoursPerDay: policy.workHoursPerDay,
                lateThresholdMin: policy.lateThresholdMin,
                allowWFH: policy.allowWFH,
                requireGPS: policy.requireGPS,
            });
        }
    }, [policy]);

    // Update policy mutation
    const updateMutation = useMutation({
        mutationFn: async (data) => {
            return await api.put('/admin/policies/attendance', data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['attendancePolicy']);
            toast({
                title: 'Success',
                description: 'Attendance policy updated successfully',
            });
        },
        onError: (error) => {
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Failed to update policy',
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
                <CardTitle>Attendance Policy</CardTitle>
                <CardDescription>
                    Configure attendance rules and settings for your organization
                </CardDescription>
            </CardHeader>
            <div className="space-y-6">
                {/* Work Hours */}
                <div className="space-y-2">
                    <Label htmlFor="workHours">
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Work Hours Per Day
                        </div>
                    </Label>
                    <Input
                        id="workHours"
                        type="number"
                        min="1"
                        max="24"
                        step="0.5"
                        value={formData.workHoursPerDay}
                        onChange={(e) =>
                            setFormData({ ...formData, workHoursPerDay: parseFloat(e.target.value) })
                        }
                    />
                    <p className="text-sm text-muted-foreground">
                        Standard working hours expected per day
                    </p>
                </div>

                {/* Late Threshold */}
                <div className="space-y-2">
                    <Label htmlFor="lateThreshold">Late Arrival Threshold (minutes)</Label>
                    <Input
                        id="lateThreshold"
                        type="number"
                        min="0"
                        max="120"
                        value={formData.lateThresholdMin}
                        onChange={(e) =>
                            setFormData({ ...formData, lateThresholdMin: parseInt(e.target.value) })
                        }
                    />
                    <p className="text-sm text-muted-foreground">
                        Grace period before marking attendance as late
                    </p>
                </div>

                {/* Work From Home */}
                <div className="flex items-center justify-between space-y-0 rounded-lg border p-4">
                    <div className="space-y-0.5">
                        <Label htmlFor="allowWFH" className="text-base">
                            Allow Work From Home
                        </Label>
                        <p className="text-sm text-muted-foreground">
                            Enable employees to mark attendance remotely
                        </p>
                    </div>
                    <Switch
                        id="allowWFH"
                        checked={formData.allowWFH}
                        onCheckedChange={(checked) =>
                            setFormData({ ...formData, allowWFH: checked })
                        }
                    />
                </div>

                {/* GPS Required */}
                <div className="flex items-center justify-between space-y-0 rounded-lg border p-4">
                    <div className="space-y-0.5">
                        <Label htmlFor="requireGPS" className="text-base">
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                Require GPS Location
                            </div>
                        </Label>
                        <p className="text-sm text-muted-foreground">
                            Mandate location tracking when punching in/out
                        </p>
                    </div>
                    <Switch
                        id="requireGPS"
                        checked={formData.requireGPS}
                        onCheckedChange={(checked) =>
                            setFormData({ ...formData, requireGPS: checked })
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
                        Save Policy
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AttendancePolicy;
