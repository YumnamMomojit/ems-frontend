import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'; // Assuming a generic Card component exists in ui/card


const KpiCard = ({ title, value, icon: Icon, description }) => {
  return (
    <Card
      className="shadow-md border-l-4 border-l-primary border-y-0 border-r-0 rounded-r-lg universal-card-child"
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{title}</CardTitle>
        {Icon && <Icon className="h-5 w-5 text-primary" />}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-foreground">{value}</div>
        {description && <p className="text-xs text-muted-foreground/70 mt-1">{description}</p>}
      </CardContent>
    </Card>
  );
};

export default KpiCard;
