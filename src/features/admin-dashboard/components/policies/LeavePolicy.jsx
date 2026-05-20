import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../../services/api';
import { Calendar, Save } from 'lucide-react';
import { Button } from '~/components/employee-ui/button';
import { Input } from '~/components/employee-ui/input';
import { Label } from '~/components/employee-ui/label';
import { Switch } from '~/components/employee-ui/switch';
import { CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Skeleton } from '~/components/employee-ui/skeleton';
import { useToast } from '~/hooks/use-toast';

const LeavePolicy = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const [formData, setFormData] = useState({
        casualLeaves: 12,
        sickLeaves: 10,
        paidLeaves: 15,
        carryForward: true,
        maxCarryForward: 5,
    });

    // Fetch leave policy
    const { data: policy, isLoading } = useQuery({
        queryKey: ['leavePolicy'],
        queryFn: async () => {
            const response = await api.get('/admin/policies/leave');
            return response.data;
        },
    });

    useEffect(() => {
        if (policy) {
            setFormData({
                casualLeaves: policy.casualLeaves,
                sickLeaves: policy.sickLeaves,
                paidLeaves: policy.paidLeaves,
                carryForward: policy.carryForward,
                maxCarryForward: policy.maxCarryForward,
            });
        }
    }, [policy]);

    const updateMutation = useMutation({
        mutationFn: async (data) => {
            return await api.put('/admin/policies/leave', data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['leavePolicy']);
            toast({
                title: 'Success',
                description: 'Leave policy updated successfully',
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
                <CardTitle>Leave Policy</CardTitle>
                <CardDescription>
                    Configure leave quotas and carry-forward rules
                </CardDescription>
            </CardHeader>
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="casualLeaves">Casual Leaves</Label>
                        <Input
                            id="casualLeaves"
                            type="number"
                            min="0"
                            value={formData.casualLeaves}
                            onChange={(e) =>
                                setFormData({ ...formData, casualLeaves: parseInt(e.target.value) })
                            }
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="sickLeaves">Sick Leaves</Label>
                        <Input
                            id="sickLeaves"
                            type="number"
                            min="0"
                            value={formData.sickLeaves}
                            onChange={(e) =>
                                setFormData({ ...formData, sickLeaves: parseInt(e.target.value) })
                            }
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="paidLeaves">Paid Leaves</Label>
                        <Input
                            id="paidLeaves"
                            type="number"
                            min="0"
                            value={formData.paidLeaves}
                            onChange={(e) =>
                                setFormData({ ...formData, paidLeaves: parseInt(e.target.value) })
                            }
                        />
                    </div>
                </div>

                <div className="border-t pt-6 space-y-4">
                    <h3 className="text-lg font-semibold">Carry Forward Policy</h3>

                    <div className="flex items-center justify-between space-y-0 rounded-lg border p-4">
                        <div className="space-y-0.5">
                            <Label htmlFor="carryForward" className="text-base">
                                Allow Carry Forward
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                Enable unused leaves to carry forward to next year
                            </p>
                        </div>
                        <Switch
                            id="carryForward"
                            checked={formData.carryForward}
                            onCheckedChange={(checked) =>
                                setFormData({ ...formData, carryForward: checked })
                            }
                        />
                    </div>

                    {formData.carryForward && (
                        <div className="space-y-2">
                            <Label htmlFor="maxCarryForward">Maximum Carry Forward Days</Label>
                            <Input
                                id="maxCarryForward"
                                type="number"
                                min="0"
                                value={formData.maxCarryForward}
                                onChange={(e) =>
                                    setFormData({ ...formData, maxCarryForward: parseInt(e.target.value) })
                                }
                            />
                            <p className="text-sm text-muted-foreground">
                                Maximum number of days that can be carried forward
                            </p>
                        </div>
                    )}
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

export default LeavePolicy;
