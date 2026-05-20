import React, { useState, useEffect } from "react";
import hrApi from "../services/hr.api";
import { useToast } from "~/hooks/use-toast";

// New Components
import ReimbursementHeader from "../components/reimbursements/ReimbursementHeader";
import ReimbursementStats from "../components/reimbursements/ReimbursementStats";
import ReimbursementFilters from "../components/reimbursements/ReimbursementFilters";
import ReimbursementTable from "../components/reimbursements/ReimbursementTable";
import ReimbursementModal from "../components/reimbursements/ReimbursementModal";

const Reimbursements = () => {
    const [claims, setClaims] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedClaim, setSelectedClaim] = useState(null);
    const { toast } = useToast();

    // Filters
    const [filters, setFilters] = useState({
        status: "PENDING",
        search: "",
        startDate: "",
        endDate: ""
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const [claimsRes, statsRes] = await Promise.all([
                hrApi.getReimbursements(filters),
                hrApi.getReimbursementStats()
            ]);
            setClaims(claimsRes.data.data);
            setStats(statsRes.data.data);
        } catch (err) {
            console.error("Error fetching claims:", err);
            toast({ title: "Error", description: "Failed to load data.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchData();
        }, 500);
        return () => clearTimeout(timer);
    }, [filters]);

    const handleAction = async (id, action, data = {}) => {
        try {
            let res;
            if (action === "APPROVE") {
                res = await hrApi.approveReimbursement(id);
                toast({ title: "Approved", description: "Reimbursement request approved." });
            } else if (action === "REJECT") {
                res = await hrApi.rejectReimbursement(id, { reason: data.reason });
                toast({ title: "Rejected", description: "Reimbursement request rejected." });
            } else if (action === "PAY") {
                res = await hrApi.markReimbursementPaid(id);
                toast({ title: "Marked as Paid", description: "Reimbursement marked as paid successfully." });
            }

            // Refresh data
            fetchData();
            if (selectedClaim) setSelectedClaim(null); // Close modal on success
        } catch (err) {
            console.error(err);
            toast({ title: "Action Failed", description: err.response?.data?.message || "Something went wrong.", variant: "destructive" });
        }
    };

    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
            <ReimbursementHeader />
            <ReimbursementStats stats={stats} />
            <ReimbursementFilters filters={filters} onFilterChange={setFilters} />
            <ReimbursementTable
                claims={claims}
                loading={loading}
                onAction={handleAction}
                onView={setSelectedClaim}
            />

            {selectedClaim && (
                <ReimbursementModal
                    claim={selectedClaim}
                    onClose={() => setSelectedClaim(null)}
                    onAction={handleAction}
                />
            )}
        </div>
    );
};

export default Reimbursements;
