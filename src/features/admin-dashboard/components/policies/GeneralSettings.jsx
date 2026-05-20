import React, { useState, useEffect } from 'react';
import { useOrganization } from '../../../../hooks/OrganizationContext';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '~/components/employee-ui/select';
import { Button } from '~/components/employee-ui/button';
import { Label } from '~/components/employee-ui/label';
import { toast } from 'react-toastify';
import { Save, Loader2 } from 'lucide-react';

const CURRENCIES = [
    { symbol: '$', name: 'Dollar (USD)' },
    { symbol: '₹', name: 'Rupee (INR)' },
    { symbol: '€', name: 'Euro (EUR)' },
    { symbol: '£', name: 'Pound (GBP)' },
    { symbol: '¥', name: 'Yen (JPY)' },
    { symbol: 'A$', name: 'Australian Dollar (AUD)' },
    { symbol: 'C$', name: 'Canadian Dollar (CAD)' },
    { symbol: 'CHF', name: 'Swiss Franc (CHF)' },
    { symbol: 'S$', name: 'Singapore Dollar (SGD)' },
    { symbol: 'AED', name: 'UAE Dirham (AED)' },
];

const GeneralSettings = () => {
    const { organization, currencySymbol, updateCurrency, loading } = useOrganization();
    const [currency, setCurrency] = useState(currencySymbol);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (currencySymbol) {
            setCurrency(currencySymbol);
        }
    }, [currencySymbol]);

    const handleSave = async () => {
        setIsSaving(true);
        const result = await updateCurrency(currency);
        setIsSaving(false);
        
        if (result.success) {
            toast.success('Organization settings updated successfully');
        } else {
            toast.error('Failed to update organization settings');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-40">
                <Loader2 className="animate-spin text-primary" size={32} />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">General Settings</h3>
                <p className="text-sm text-muted-foreground">
                    Configure general organization-wide settings.
                </p>
            </div>

            <div className="grid gap-4 max-w-md">
                <div className="grid gap-2">
                    <Label htmlFor="currency">Currency Symbol</Label>
                    <div className="flex gap-2">
                        <Select value={currency} onValueChange={setCurrency}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                            <SelectContent>
                                {CURRENCIES.map((c) => (
                                    <SelectItem key={c.symbol} value={c.symbol}>
                                        <span className="font-bold mr-2">{c.symbol}</span>
                                        <span className="text-muted-foreground">{c.name}</span>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button 
                            onClick={handleSave} 
                            disabled={isSaving || currency === currencySymbol}
                        >
                            {isSaving ? <Loader2 className="animate-spin mr-2" size={16} /> : <Save className="mr-2" size={16} />}
                            Save
                        </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        This symbol will be used for all money-related displays across the platform (Salaries, Expenses, Advances, etc.).
                    </p>
                </div>
            </div>

            <div className="pt-4 border-t">
                <h4 className="text-sm font-medium mb-2">Preview</h4>
                <div className="p-4 bg-muted rounded-md inline-block">
                    <span className="text-2xl font-bold">{currency} 50,000.00</span>
                </div>
            </div>
        </div>
    );
};

export default GeneralSettings;
