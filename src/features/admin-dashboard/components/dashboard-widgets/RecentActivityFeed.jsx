import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { format } from 'date-fns';
import { Activity } from 'lucide-react';

const RecentActivityFeed = ({ activities }) => {
  return (
    <div className="bg-card rounded-xl shadow-sm border border-border p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-card-foreground flex items-center gap-2">
          <Activity className="w-5 h-5 text-muted-foreground" />
          Recent Activity
        </h3>
      </div>

      <div className="space-y-4">
        {activities && activities.length > 0 ? (
          <div className="relative border-l border-border ml-2 space-y-6">
            {activities.map((activity, index) => (
              <div key={index} className="ml-6 relative">
                <span className="absolute -left-[31px] top-1 h-3 w-3 rounded-full border-2 border-card bg-blue-500 shadow-sm"></span>
                <div>
                  <p className="text-sm font-medium text-card-foreground">
                    <span className="font-bold">{activity.user}</span> {activity.action.toLowerCase().replace('_', ' ')} <span className="font-medium text-blue-600 dark:text-blue-400">{activity.entity}</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {format(new Date(activity.time), 'MMM dd, yyyy HH:mm')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No recent system activity.
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivityFeed;
