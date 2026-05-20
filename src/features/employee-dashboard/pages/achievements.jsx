import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/employee-ui/card";
import { Badge } from "~/components/employee-ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/employee-ui/avatar";
import { Skeleton } from "~/components/employee-ui/skeleton";
import { Trophy, Star, Target, Zap, Award, Medal } from "lucide-react";
import { format, parseISO } from "date-fns";

const categoryConfig = {
  performance: { color: "bg-green-500/10 text-green-600 dark:text-green-400", icon: Target },
  innovation: { color: "bg-purple-500/10 text-purple-600 dark:text-purple-400", icon: Zap },
  teamwork: { color: "bg-blue-500/10 text-blue-600 dark:text-blue-400", icon: Star },
  leadership: { color: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400", icon: Award },
  milestone: { color: "bg-pink-500/10 text-pink-600 dark:text-pink-400", icon: Medal },
};

export default function AchievementsPage() {
  const { data: achievements = [], isLoading } = useQuery({
    queryKey: ["/api/achievements"],
  });

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const recentAchievements = achievements.slice(0, 3);
  const allAchievements = achievements;

  const stats = {
    total: achievements.length,
    thisMonth: achievements.filter(a => {
      const date = parseISO(a.awardedAt);
      const now = new Date();
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }).length,
    categories: Object.entries(
      achievements.reduce((acc, a) => {
        acc[a.category] = (acc[a.category] || 0) + 1;
        return acc;
      }, {})
    ),
  };

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <Trophy className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold text-foreground" data-testid="text-page-title">Achievements</h1>
          <p className="text-muted-foreground">Recognizing excellence across the organization</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <Trophy className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-3xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total Achievements</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-green-500/10">
                <Star className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-3xl font-bold">{stats.thisMonth}</p>
                <p className="text-sm text-muted-foreground">This Month</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-orange-500/10">
                <Award className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-3xl font-bold">{stats.categories.length}</p>
                <p className="text-sm text-muted-foreground">Categories</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {recentAchievements.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2 text-foreground">
            <Zap className="w-5 h-5 text-orange-500" />
            Recent Recognitions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentAchievements.map((achievement, index) => (
              <AchievementCard key={achievement.id} achievement={achievement} index={index} featured />
            ))}
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-lg font-semibold mb-3 text-foreground">All Achievements</h2>
        {allAchievements.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No achievements recorded yet</p>
              <p className="text-sm text-muted-foreground mt-2">Start recognizing team members for their contributions!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allAchievements.map((achievement, index) => (
              <AchievementCard key={achievement.id} achievement={achievement} index={index} />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

function AchievementCard({ achievement, index, featured = false }) {
  const config = categoryConfig[achievement.category] || categoryConfig.performance;
  const CategoryIcon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index }}
    >
      <Card className={`h-full ${featured ? "border-primary/30 bg-primary/5" : ""}`} data-testid={`achievement-${achievement.id}`}>
        <CardContent className="pt-6">
          <div className="flex items-start gap-3 mb-4">
            <div className={`p-2 rounded-lg ${config.color}`}>
              <CategoryIcon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate text-foreground">{achievement.title}</h3>
              <Badge variant="secondary" className="text-xs capitalize mt-1">
                {achievement.category}
              </Badge>
            </div>
          </div>

          {achievement.description && (
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {achievement.description}
            </p>
          )}

          <div className="flex items-center gap-3 pt-3 border-t">
            <Avatar className="w-8 h-8">
              <AvatarImage src={achievement.userAvatar} />
              <AvatarFallback className="text-xs bg-primary/10 text-primary">
                {achievement.userName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate text-foreground">{achievement.userName}</p>
              <p className="text-xs text-muted-foreground">
                {format(parseISO(achievement.awardedAt), "MMM d, yyyy")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
