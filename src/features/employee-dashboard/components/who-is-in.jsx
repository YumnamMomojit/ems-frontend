import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/employee-ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/employee-ui/avatar";
import { Badge } from "~/components/employee-ui/badge";

const statusColors = {
  online: "bg-status-online",
  offline: "bg-status-offline",
  away: "bg-status-away",
  "on-leave": "bg-orange",
};

const statusLabels = {
  online: "Online",
  offline: "Offline",
  away: "Away",
  "on-leave": "On Leave",
};

export function WhoIsIn({ members }) {
  const onlineCount = members.filter((m) => m.status === "online").length;
  const onLeaveCount = members.filter((m) => m.status === "on-leave").length;

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="h-full" data-testid="who-is-in-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <CardTitle className="text-lg font-medium text-foreground">Who's In?</CardTitle>
            <div className="flex gap-2 flex-wrap">
              <Badge variant="secondary" className="text-xs">
                {onlineCount} Online
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {onLeaveCount} On Leave
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-4 gap-4">
            {members.slice(0, 8).map((member) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center text-center"
                data-testid={`team-member-${member.id}`}
              >
                <div className="relative">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={member.avatarUrl} alt={member.name} />
                    <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                      {getInitials(member.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-background ${
                      statusColors[member.status]
                    }`}
                    title={statusLabels[member.status]}
                  />
                </div>
                <span className="mt-2 text-xs text-muted-foreground truncate max-w-full">
                  {member.name.split(" ")[0]}
                </span>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
