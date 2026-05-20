import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/employee-ui/card";
import { Badge } from "~/components/employee-ui/badge";
import { Skeleton } from "~/components/employee-ui/skeleton";
import { Megaphone, AlertCircle, Info, Star, Clock } from "lucide-react";
import { format, parseISO, formatDistanceToNow } from "date-fns";

const categoryConfig = {
  general: { color: "bg-secondary/10 text-secondary", icon: Info },
  urgent: { color: "bg-destructive/10 text-destructive", icon: AlertCircle },
  policy: { color: "bg-accent/10 text-accent", icon: Megaphone },
  celebration: { color: "bg-orange-500/10 text-orange-600", icon: Star },
};

const priorityConfig = {
  low: "bg-muted text-muted-foreground",
  normal: "bg-secondary text-secondary-foreground",
  high: "bg-destructive/10 text-destructive",
};

export default function AnnouncementsPage() {
  const { data: announcements = [], isLoading } = useQuery({
    queryKey: ["/api/announcements"],
  });

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-40 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const urgentAnnouncements = announcements.filter(a => a.priority === "high" || a.category === "urgent");
  const regularAnnouncements = announcements.filter(a => a.priority !== "high" && a.category !== "urgent");

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <Megaphone className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold text-foreground" data-testid="text-page-title">Announcements</h1>
          <p className="text-muted-foreground">Company news and updates</p>
        </div>
      </motion.div>

      {urgentAnnouncements.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2 text-foreground">
            <AlertCircle className="w-5 h-5 text-destructive" />
            Important Announcements
          </h2>
          <div className="space-y-4">
            {urgentAnnouncements.map((announcement, index) => (
              <AnnouncementCard key={announcement.id} announcement={announcement} index={index} />
            ))}
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-lg font-semibold mb-3 text-foreground">All Announcements</h2>
        {regularAnnouncements.length === 0 && urgentAnnouncements.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Megaphone className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No announcements yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {regularAnnouncements.map((announcement, index) => (
              <AnnouncementCard key={announcement.id} announcement={announcement} index={index} />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

function AnnouncementCard({ announcement, index }) {
  const config = categoryConfig[announcement.category] || categoryConfig.general;
  const CategoryIcon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index }}
    >
      <Card className={announcement.priority === "high" ? "border-destructive/50" : ""} data-testid={`announcement-${announcement.id}`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${config.color}`}>
                <CategoryIcon className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-lg text-foreground">{announcement.title}</CardTitle>
                <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                  <span>By {announcement.authorName}</span>
                  <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDistanceToNow(parseISO(announcement.publishedAt), { addSuffix: true })}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className={`capitalize ${config.color}`}>
                {announcement.category}
              </Badge>
              {announcement.priority === "high" && (
                <Badge variant="destructive">Urgent</Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground whitespace-pre-wrap">{announcement.content}</p>
          {announcement.expiresAt && (
            <p className="text-xs text-muted-foreground mt-4">
              Expires: {format(parseISO(announcement.expiresAt), "MMM d, yyyy")}
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
