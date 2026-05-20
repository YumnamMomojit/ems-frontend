import { useState, useEffect, useCallback } from "react";
import hrApi from "../services/hr.api";

const useHRDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchStats = useCallback(async () => {
        setLoading(true);
        try {
            const response = await hrApi.getStats();
            setStats(response.data.data);
            setError(null);
        } catch (err) {
            console.error("Error fetching HR stats:", err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    return {
        stats,
        loading,
        error,
        refreshStats: fetchStats,
    };
};

export default useHRDashboard;
