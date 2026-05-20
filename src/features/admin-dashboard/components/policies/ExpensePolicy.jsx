import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../../services/api';
import { DollarSign, Save } from 'lucide-react';
import { Button } from '~/components/employee-ui/button';
import { Input } from '~/components/employee-ui/input';
import { Label } from '~/components/employee-ui/label';
import { Switch } from '~/components/employee-ui/switch';
import { CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Skeleton } from '~/components/employee-ui/skeleton';
import { useToast } from '~/hooks/use-toast';

const ExpensePolicy = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const [formData, setFormData] = useState({
        travelLimit: 5000,
        foodLimit: 1000,
        accommodationLimit: 3000,
        otherLimit: 2000,
        requireReceipt: true,
    });

    const { data: policy, isLoading } = useQuery({
        queryKey: ['expensePolicy'],
        queryFn: async () => {
            const response = await api.get('/admin/policies/expense');
            return response.data;
        },
    });

    useEffect(() => {
        if (policy) {
            setFormData({
                travelLimit: policy.travelLimit,
                foodLimit: policy.foodLimit,
                accommodationLimit: policy.accommodationLimit,
                otherLimit: policy.otherLimit,
                requireReceipt: policy.requireReceipt,
            });
        }
    }, [policy]);

    const updateMutation = useMutation({
        mutationFn: async (data) => {
            return await api.put('/admin/policies/expense', data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['expensePolicy']);
            toast({
                title: 'Success',
                description: 'Expense policy updated successfully',
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
                <CardTitle>Expense Policy</CardTitle>
                <CardDescription>
                    Configure expense claim limits and requirements
                </CardDescription>
            </CardHeader>
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="travelLimit">
                            <div className="flex items-center gap-2">
                                <DollarSign className="h-4 w-4" />
                                Travel Limit
                            </div>
                        </Label>
                        <Input
                            id="travelLimit"
                            type="number"
                            min="0"
                            step="100"
                            value={formData.travelLimit}
                            onChange={(e) =>
                                setFormData({ ...formData, travelLimit: parseFloat(e.target.value) })
                            }
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="foodLimit">Food Limit</Label>
                        <Input
                            id="foodLimit"
                            type="number"
                            min="0"
                            step="100"
                            value={formData.foodLimit}
                            onChange={(e) =>
                                setFormData({ ...formData, foodLimit: parseFloat(e.target.value) })
                            }
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="accommodationLimit">Accommodation Limit</Label>
                        <Input
                            id="accommodationLimit"
                            type="number"
                            min="0"
                            step="100"
                            value={formData.accommodationLimit}
                            onChange={(e) =>
                                setFormData({ ...formData, accommodationLimit: parseFloat(e.target.value) })
                            }
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="otherLimit">Other Expenses Limit</Label>
                        <Input
                            id="otherLimit"
                            type="number"
                            min="0"
                            step="100"
                            value={formData.otherLimit}
                            onChange={(e) =>
                                setFormData({ ...formData, otherLimit: parseFloat(e.target.value) })
                            }
                        />
                    </div>
                </div>

                <div className="border-t pt-6">
                    <div className="flex items-center justify-between space-y-0 rounded-lg border p-4">
                        <div className="space-y-0.5">
                            <Label htmlFor="requireReceipt" className="text-base">
                                Require Receipt Upload
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                Mandate receipt/bill attachment for all expense claims
                            </p>
                        </div>
                        <Switch
                            id="requireReceipt"
                            checked={formData.requireReceipt}
                            onCheckedChange={(checked) =>
                                setFormData({ ...formData, requireReceipt: checked })
                            }
                        />
                    </div>
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

export default ExpensePolicy;
