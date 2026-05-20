import React, { useState, useEffect } from "react";
import hrApi from "../services/hr.api";
import { useToast } from "~/hooks/use-toast";

// Components
import AdvancesHeader from "../components/advances/AdvancesHeader";
import AdvanceStats from "../components/advances/AdvanceStats";
import AdvanceFilters from "../components/advances/AdvanceFilters";
import AdvanceTable from "../components/advances/AdvanceTable";
import AdvanceModal from "../components/advances/AdvanceModal";

const Advances = () => {
    const [advances, setAdvances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedAdvance, setSelectedAdvance] = useState(null);
    const { toast } = useToast();

    // Filters State
    const [filters, setFilters] = useState({
        status: "PENDING",
        search: "",
        startDate: "",
        endDate: ""
    });

    const fetchAdvances = async () => {
        setLoading(true);
        try {
            const res = await hrApi.getAdvances();
            setAdvances(res.data.data);
        } catch (err) {
            console.error("Error fetching advances:", err);
            toast({ title: "Error", description: "Failed to load advance requests.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdvances();
    }, []);

    const handleAction = async (id, action, data = {}) => {
        try {
            if (action === "APPROVE") {
                await hrApi.approveAdvance(id, { status: "APPROVED", repaymentMonths: 3 }); // Default 3 months
                toast({ title: "Approved", description: "Advance request approved." });
            } else if (action === "REJECT") {
                await hrApi.rejectAdvance(id, { status: "REJECTED", rejectionReason: data.reason });
                toast({ title: "Rejected", description: "Advance request rejected." });
            } else if (action === "DISBURSE") {
                await hrApi.disburseAdvance(id);
                toast({ title: "Disbursed", description: "Advance marked as disbursed." });
            } else if (action === "CLOSE") {
                await hrApi.closeAdvance(id);
                toast({ title: "Closed", description: "Advance request closed successfully." });
            }

            fetchAdvances();
            if (selectedAdvance) setSelectedAdvance(null);
        } catch (err) {
            console.error(err);
            toast({ title: "Action Failed", description: err.response?.data?.message || "Something went wrong.", variant: "destructive" });
        }
    };

    // Filter Logic
    const filteredAdvances = advances.filter(a => {
        // Status Filter
        if (filters.status !== "ALL" && a.status !== filters.status) return false;

        // Search Filter
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            const employeeName = `${a.employee?.firstName} ${a.employee?.lastName}`.toLowerCase();
            if (!employeeName.includes(searchLower)) return false;
        }

        // Date Range Filter
        if (filters.startDate && filters.endDate) {
            const date = new Date(a.createdAt);
            const start = new Date(filters.startDate);
            const end = new Date(filters.endDate);
            end.setHours(23, 59, 59, 999);
            if (date < start || date > end) return false;
        }

        return true;
    });

    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
            <AdvancesHeader />
            <AdvanceStats advances={advances} />
            <AdvanceFilters filters={filters} onFilterChange={setFilters} />

            <AdvanceTable
                advances={filteredAdvances}
                loading={loading}
                onAction={handleAction}
                onView={setSelectedAdvance}
            />

            {selectedAdvance && (
                <AdvanceModal
                    advance={selectedAdvance}
                    onClose={() => setSelectedAdvance(null)}
                    onAction={handleAction}
                />
            )}
        </div>
    );
};

export default Advances;
