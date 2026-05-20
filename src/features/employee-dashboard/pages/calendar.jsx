import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/employee-ui/card";
import { Badge } from "~/components/employee-ui/badge";
import { Skeleton } from "~/components/employee-ui/skeleton";
import { Calendar as CalendarIcon, Gift, Users, Briefcase } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, parseISO, isSameDay } from "date-fns";
import { useState } from "react";
import { Button } from "~/components/employee-ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const eventTypeConfig = {
  holiday: { color: "bg-destructive/10 text-destructive", icon: Gift },
  event: { color: "bg-accent/10 text-accent", icon: CalendarIcon },
  meeting: { color: "bg-primary/10 text-primary", icon: Users },
  birthday: { color: "bg-orange-500/10 text-orange-600", icon: Gift },
};

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const { data: events = [], isLoading } = useQuery({
    queryKey: ["/api/calendar"],
  });

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const startDayOfWeek = monthStart.getDay();
  const paddingDays = Array(startDayOfWeek).fill(null);

  const getEventsForDay = (date) => {
    return events.filter(event => {
      const eventDate = parseISO(event.startDate);
      return isSameDay(eventDate, date);
    });
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  const upcomingEvents = events
    .filter(e => new Date(e.startDate) >= new Date())
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, 5);

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <CalendarIcon className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold text-foreground" data-testid="text-page-title">Company Calendar</h1>
          <p className="text-muted-foreground">Holidays, events, and important dates</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-4">
              <CardTitle className="text-foreground">{format(currentDate, "MMMM yyyy")}</CardTitle>
              <div className="flex items-center gap-2">
                <Button size="icon" variant="outline" onClick={goToPreviousMonth} data-testid="button-prev-month">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="outline" onClick={goToNextMonth} data-testid="button-next-month">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1 mb-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                  <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {paddingDays.map((_, i) => (
                  <div key={`pad-${i}`} className="h-24 p-1 bg-muted/20 rounded-md" />
                ))}
                {daysInMonth.map(day => {
                  const dayEvents = getEventsForDay(day);
                  const isCurrentMonth = isSameMonth(day, currentDate);
                  const isTodayDate = isToday(day);

                  return (
                    <div
                      key={day.toISOString()}
                      className={`h-24 p-1 rounded-md border transition-colors ${isTodayDate
                          ? "bg-primary/10 border-primary"
                          : isCurrentMonth
                            ? "bg-card border-border hover-elevate"
                            : "bg-muted/30 border-transparent"
                        }`}
                      data-testid={`calendar-day-${format(day, 'yyyy-MM-dd')}`}
                    >
                      <div className={`text-sm font-medium mb-1 ${isTodayDate ? "text-primary" : ""}`}>
                        {format(day, "d")}
                      </div>
                      <div className="space-y-0.5 overflow-hidden">
                        {dayEvents.slice(0, 2).map(event => {
                          const config = eventTypeConfig[event.eventType] || eventTypeConfig.event;
                          return (
                            <div
                              key={event.id}
                              className={`text-xs px-1 py-0.5 rounded truncate ${config.color}`}
                              title={event.title}
                            >
                              {event.title}
                            </div>
                          );
                        })}
                        {dayEvents.length > 2 && (
                          <div className="text-xs text-muted-foreground">
                            +{dayEvents.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="text-lg text-foreground">Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingEvents.length === 0 ? (
                <p className="text-muted-foreground text-sm">No upcoming events</p>
              ) : (
                upcomingEvents.map(event => {
                  const config = eventTypeConfig[event.eventType] || eventTypeConfig.event;
                  const EventIcon = config.icon;
                  return (
                    <div
                      key={event.id}
                      className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                      data-testid={`event-${event.id}`}
                    >
                      <div className={`p-2 rounded-lg ${config.color}`}>
                        <EventIcon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate text-foreground">{event.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {format(parseISO(event.startDate), "MMM d, yyyy")}
                        </p>
                        {event.description && (
                          <p className="text-xs text-muted-foreground mt-1 truncate">
                            {event.description}
                          </p>
                        )}
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {event.eventType}
                      </Badge>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-lg text-foreground">Legend</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {Object.entries(eventTypeConfig).map(([type, config]) => {
                const Icon = config.icon;
                return (
                  <div key={type} className="flex items-center gap-2">
                    <div className={`p-1.5 rounded ${config.color}`}>
                      <Icon className="w-3 h-3" />
                    </div>
                    <span className="text-sm capitalize text-foreground">{type}</span>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
