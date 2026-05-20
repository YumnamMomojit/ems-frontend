import React, { useState, useEffect } from 'react';
import { getLeaveSummary } from '~/features/admin-dashboard/services/dashboard.api';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import KpiCard from '~/features/admin-dashboard/components/cards/KpiCard';
import { Hourglass, CheckCircle, XCircle, Users } from 'lucide-react';

const LeaveSummary = () => {
  const [leaveSummaryData, setLeaveSummaryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getLeaveSummary();
        setLeaveSummaryData(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  if (loading) {
    return (
      <Card
        className="p-6 shadow-md universal-card-child"
      >
        <p>Loading leave summary...</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card
        className="p-6 shadow-md text-red-500 universal-card-child"
      >
        <p>Error: {error.message}</p>
      </Card>
    );
  }

  const kpiCards = leaveSummaryData ? [
    { title: 'Pending Requests', value: leaveSummaryData.pendingRequests, icon: Hourglass, description: 'Awaiting approval' },
    { title: 'Approved Leaves', value: leaveSummaryData.approvedLeaves, icon: CheckCircle, description: 'Leaves granted' },
    { title: 'Rejected Leaves', value: leaveSummaryData.rejectedLeaves, icon: XCircle, description: 'Leaves denied' },
    { title: 'Employees on Leave Today', value: leaveSummaryData.onLeaveToday, icon: Users, description: 'Absent today' },
  ] : [];

  return (
    <Card
      className="shadow-md border border-border universal-card-child"
    >
      <CardHeader>
        <CardTitle className="text-xl font-medium tracking-wide">Leave Management Summary</CardTitle>
      </CardHeader>


      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiCards.map((card, index) => (
            <KpiCard
              key={index}
              title={card.title}
              value={card.value}
              icon={card.icon}
              description={card.description}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LeaveSummary;
