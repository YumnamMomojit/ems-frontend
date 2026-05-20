import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Users, Calendar, Clock, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/employee-ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/employee-ui/avatar";
import { Badge } from "~/components/employee-ui/badge";
import { Skeleton } from "~/components/employee-ui/skeleton";

export default function Team() {
  const { data: teamData, isLoading } = useQuery({
    queryKey: ["/api/team"],
  });

  const defaultTeamMembers = [
    { id: "1", name: "John Doe", role: "Software Engineer", department: "Engineering", status: "online", todayStatus: "present" },
    { id: "2", name: "Sarah Wilson", role: "Product Manager", department: "Product", status: "online", todayStatus: "present" },
    { id: "3", name: "Mike Johnson", role: "UI Designer", department: "Design", status: "away", todayStatus: "wfh" },
    { id: "4", name: "Emily Davis", role: "HR Manager", department: "Human Resources", status: "offline", todayStatus: "leave" },
    { id: "5", name: "Alex Brown", role: "DevOps Engineer", department: "Engineering", status: "online", todayStatus: "present" },
    { id: "6", name: "Rachel Green", role: "Marketing Lead", department: "Marketing", status: "online", todayStatus: "present" },
    { id: "7", name: "Chris Lee", role: "Data Analyst", department: "Analytics", status: "on-leave", todayStatus: "leave" },
    { id: "8", name: "Lisa Chen", role: "QA Engineer", department: "Engineering", status: "online", todayStatus: "present" },
  ];

  const defaultStats = {
    totalMembers: 8,
    presentToday: 5,
    onLeave: 2,
    wfh: 1,
  };

  const members = teamData?.members || defaultTeamMembers;
  const stats = teamData?.stats || defaultStats;

  const statusColors = {
    online: "bg-green-500",
    offline: "bg-gray-500",
    away: "bg-yellow-500",
    "on-leave": "bg-orange-500",
  };

  const todayStatusBadges = {
    present: { label: "In Office", className: "bg-green-500/10 text-green-600" },
    wfh: { label: "WFH", className: "bg-blue-500/10 text-blue-600" },
    leave: { label: "On Leave", className: "bg-orange-500/10 text-orange-600" },
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const statCards = [
    { label: "Team Members", value: stats.totalMembers, icon: Users, color: "text-primary" },
    { label: "Present Today", value: stats.presentToday, icon: Clock, color: "text-green-600" },
    { label: "On Leave", value: stats.onLeave, icon: Calendar, color: "text-orange-600" },
    { label: "Working from Home", value: stats.wfh, icon: Award, color: "text-blue-600" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="p-4 md:p-6 max-w-7xl mx-auto space-y-6"
      data-testid="team-page"
    >
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground mb-1">My Team</h1>
        <p className="text-muted-foreground text-sm">
          View your team members and their current status
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card data-testid={`stat-card-${index}`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-muted ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card data-testid="team-members-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium flex items-center gap-2 text-foreground">
            <Users className="w-5 h-5 text-primary" />
            Team Members
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {members.map((member, index) => {
                const todayBadge = member.todayStatus ? todayStatusBadges[member.todayStatus] : null;
                return (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between gap-4 p-4 rounded-lg bg-muted/30 hover-elevate"
                    data-testid={`team-member-row-${member.id}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={member.avatarUrl} alt={member.name} />
                          <AvatarFallback className="bg-primary/10 text-primary font-medium">
                            {getInitials(member.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span
                          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-background dark:ring-card ${statusColors[member.status]
                            }`}
                        />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{member.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {member.role} • {member.department}
                        </p>
                      </div>
                    </div>
                    {todayBadge && (
                      <span className={`text-xs px-3 py-1 rounded-full ${todayBadge.className}`}>
                        {todayBadge.label}
                      </span>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
