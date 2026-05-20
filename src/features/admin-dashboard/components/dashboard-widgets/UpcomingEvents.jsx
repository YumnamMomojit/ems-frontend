import React, { useState, useEffect } from 'react';
import { getUpcomingEvents } from '~/features/admin-dashboard/services/dashboard.api';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { format } from 'date-fns';
import { Cake, CalendarDays, Briefcase, PartyPopper, Calendar } from 'lucide-react'; // Icons for events

const EventItem = ({ icon: Icon, title, date, description }) => (
  <div className="flex items-start space-x-3 mb-3 p-2 rounded-lg hover:bg-muted transition-colors">
    {Icon && <Icon className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-1" />}
    <div>
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="text-xs text-muted-foreground/70">{format(new Date(date), 'MMM dd, yyyy')}{description && ` - ${description}`}</p>
    </div>
  </div>
);


const UpcomingEvents = () => {
  const [eventsData, setEventsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getUpcomingEvents();
        setEventsData(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading) {
    return (
      <Card
        className="p-6 shadow-md"
        style={{ backgroundColor: 'hsl(var(--card))', color: 'hsl(var(--card-foreground))' }}
      >
        <p>Loading upcoming events...</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card
        className="p-6 shadow-md text-destructive"
        style={{ backgroundColor: 'hsl(var(--card))', color: 'hsl(var(--card-foreground))' }}
      >
        <p>Error: {error.message}</p>
      </Card>
    );
  }

  const hasEvents = eventsData && (
    eventsData.birthdays.length > 0 ||
    eventsData.joiningDates.length > 0 ||
    eventsData.contractExpiry.length > 0 ||
    eventsData.holidays.length > 0
  );

  return (
    <Card
      className="shadow-md border border-border universal-card-child"
    >
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-medium tracking-wide">Upcoming Events</CardTitle>
        <Calendar className="h-5 w-5 text-primary" />
      </CardHeader>
      <CardContent>
        {hasEvents ? (
          <div className="space-y-4">
            {eventsData.birthdays.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-2 flex items-center text-foreground">
                  <Cake className="h-5 w-5 mr-2 text-pink-500" /> Birthdays
                </h3>
                {eventsData.birthdays.map((event, index) => (
                  <EventItem key={index} icon={Cake} title={event.name} date={event.date} />
                ))}
              </div>
            )}
            {eventsData.joiningDates.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-2 flex items-center text-foreground">
                  <PartyPopper className="h-5 w-5 mr-2 text-yellow-500" /> Joining Anniversaries
                </h3>
                {eventsData.joiningDates.map((event, index) => (
                  <EventItem key={index} icon={PartyPopper} title={event.name} date={event.date} description={`${event.anniversary} Year${event.anniversary > 1 ? 's' : ''}`} />
                ))}
              </div>
            )}
            {eventsData.contractExpiry.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-2 flex items-center text-foreground">
                  <Briefcase className="h-5 w-5 mr-2 text-primary" /> Contract Expiry
                </h3>
                {eventsData.contractExpiry.map((event, index) => (
                  <EventItem key={index} icon={Briefcase} title={event.name} date={event.date} />
                ))}
              </div>
            )}
            {eventsData.holidays.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-2 flex items-center text-foreground">
                  <CalendarDays className="h-5 w-5 mr-2 text-green-500" /> Holidays
                </h3>
                {eventsData.holidays.map((event, index) => (
                  <EventItem key={index} icon={CalendarDays} title={event.name} date={event.date} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground/50">No upcoming events.</p>
        )}

      </CardContent>
    </Card>

  );
};

export default UpcomingEvents;
