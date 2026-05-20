import React, { useState, useEffect } from 'react';
import { getAttendanceOverview } from '~/features/admin-dashboard/services/dashboard.api';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import BarChartComponent from '~/features/admin-dashboard/components/charts/BarChartComponent';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';
import KpiCard from '~/features/admin-dashboard/components/cards/KpiCard';

const AttendanceOverview = () => {
  const [filter, setFilter] = useState('daily'); // 'daily', 'weekly', 'monthly'
  const [attendanceData, setAttendanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOverview = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAttendanceOverview(filter);
        setAttendanceData(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOverview();
  }, [filter]);

  if (loading) {
    return (
      <Card
        className="p-6 shadow-md universal-card-child"
      >
        <p>Loading attendance overview...</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card
        className="p-6 shadow-md text-red-500"
        style={{ backgroundColor: 'hsl(var(--card))', color: 'hsl(var(--card-foreground))' }}
      >
        <p>Error: {error.message}</p>
      </Card>
    );
  }

  const kpiCards = attendanceData ? [
    { title: `Present ${filter === 'daily' ? 'Today' : (filter === 'weekly' ? 'This Week' : 'This Month')}`, value: attendanceData.present, icon: CheckCircle2, description: 'Employees present' },
    { title: `Absent ${filter === 'daily' ? 'Today' : (filter === 'weekly' ? 'This Week' : 'This Month')}`, value: attendanceData.absent, icon: XCircle, description: 'Employees absent' },
    { title: `Late Check-ins ${filter === 'daily' ? 'Today' : (filter === 'weekly' ? 'This Week' : 'This Month')}`, value: attendanceData.late, icon: Clock, description: 'Late arrivals' },
  ] : [];

  return (
    <Card
      className="shadow-md border border-border universal-card-child"
    >
      <CardHeader>
        <CardTitle className="text-xl font-medium tracking-wide">Attendance Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-start gap-2 mb-4">
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === 'daily' ? 'bg-primary text-primary-foreground shadow-md shadow-jws-red-glow' : 'bg-sidebar text-muted-foreground border border-border hover:text-foreground'}`}
            onClick={() => setFilter('daily')}
          >
            Daily
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === 'weekly' ? 'bg-primary text-primary-foreground shadow-md shadow-jws-red-glow' : 'bg-sidebar text-muted-foreground border border-border hover:text-foreground'}`}
            onClick={() => setFilter('weekly')}
          >
            Weekly
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === 'monthly' ? 'bg-primary text-primary-foreground shadow-md shadow-jws-red-glow' : 'bg-sidebar text-muted-foreground border border-border hover:text-foreground'}`}
            onClick={() => setFilter('monthly')}
          >
            Monthly
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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

        {attendanceData && attendanceData.trend && (
          <BarChartComponent
            title="Attendance Trend"
            data={attendanceData.trend}
            dataKey="name"
            bars={[{ dataKey: 'present', fill: '#EC1313' }]} // JWS Red
            className="mt-4"
          />
        )}
      </CardContent>
    </Card>


  );
};

export default AttendanceOverview;
