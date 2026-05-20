import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/employee-ui/card";
import { Badge } from "~/components/employee-ui/badge";
import { Progress } from "~/components/employee-ui/progress";
import { Skeleton } from "~/components/employee-ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/employee-ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { TrendingUp, Target, CheckCircle2, Clock, Star, Award } from "lucide-react";

const ratingLabels = ["", "Needs Improvement", "Below Expectations", "Meets Expectations", "Exceeds Expectations", "Outstanding"];

export default function PerformancePage() {
  const { data, isLoading } = useQuery({
    queryKey: ["/api/performance"],
  });

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-80 rounded-xl" />
      </div>
    );
  }

  const { reviews = [], summary, skillsData = [], quarterlyData = [] } = data || {
    reviews: [],
    summary: { averageRating: 0, totalReviews: 0, pendingReviews: 0, goalsCompleted: 0, goalsTotal: 0 },
    skillsData: [],
    quarterlyData: []
  };

  const goalsProgress = summary.goalsTotal > 0 ? (summary.goalsCompleted / summary.goalsTotal) * 100 : 0;

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <TrendingUp className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold text-foreground" data-testid="text-page-title">Performance</h1>
          <p className="text-muted-foreground">Track your growth and achievements</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <Star className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground">{summary.averageRating.toFixed(1)}</p>
                <p className="text-sm text-muted-foreground">Average Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-green-500/10">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground">{summary.totalReviews}</p>
                <p className="text-sm text-muted-foreground">Reviews Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-orange-500/10">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground">{summary.pendingReviews}</p>
                <p className="text-sm text-muted-foreground">Pending Reviews</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-accent/10">
                <Target className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground">{summary.goalsCompleted}/{summary.goalsTotal}</p>
                <p className="text-sm text-muted-foreground">Goals Achieved</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Goals Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-foreground">
                <span>Overall Progress</span>
                <span className="font-medium">{goalsProgress.toFixed(0)}%</span>
              </div>
              <Progress value={goalsProgress} className="h-3" />
              <p className="text-xs text-muted-foreground mt-2">
                {summary.goalsCompleted} of {summary.goalsTotal} goals completed this period
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
            <TabsTrigger value="skills" data-testid="tab-skills">Skills</TabsTrigger>
            <TabsTrigger value="reviews" data-testid="tab-reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">Quarterly Performance Trend</CardTitle>
              </CardHeader>
              <CardContent>
                {quarterlyData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={quarterlyData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="quarter" className="text-xs text-muted-foreground" />
                      <YAxis domain={[0, 5]} className="text-xs text-muted-foreground" />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload?.length) {
                            return (
                              <div className="bg-popover border rounded-lg p-3 shadow-lg">
                                <p className="font-medium text-foreground">{payload[0].payload.quarter}</p>
                                <p className="text-sm text-muted-foreground">
                                  Rating: {payload[0].value} - {ratingLabels[Math.round(payload[0].value)]}
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar dataKey="rating" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    No performance data available yet
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="skills">
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">Skills Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                {skillsData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={350}>
                    <RadarChart data={skillsData}>
                      <PolarGrid className="stroke-muted" />
                      <PolarAngleAxis dataKey="skill" className="text-xs text-muted-foreground" />
                      <PolarRadiusAxis angle={30} domain={[0, 5]} />
                      <Radar
                        name="Score"
                        dataKey="score"
                        stroke="hsl(var(--primary))"
                        fill="hsl(var(--primary))"
                        fillOpacity={0.3}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    No skills assessment data available yet
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews">
            <div className="space-y-4">
              {reviews.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Award className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No reviews yet</p>
                  </CardContent>
                </Card>
              ) : (
                reviews.map((review, index) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <Card data-testid={`review-${review.id}`}>
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
                          <div>
                            <h3 className="font-semibold text-foreground">{review.period}</h3>
                            <p className="text-sm text-muted-foreground">Reviewed by {review.reviewerName}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10">
                              <Star className="w-4 h-4 text-primary fill-primary" />
                              <span className="font-bold text-primary">{review.rating}</span>
                            </div>
                            <Badge variant={review.status === "completed" ? "default" : "secondary"}>
                              {review.status}
                            </Badge>
                          </div>
                        </div>

                        {review.strengths && (
                          <div className="mb-3">
                            <p className="text-sm font-medium mb-1 text-foreground">Strengths</p>
                            <p className="text-sm text-muted-foreground">{review.strengths}</p>
                          </div>
                        )}

                        {review.improvements && (
                          <div className="mb-3">
                            <p className="text-sm font-medium mb-1 text-foreground">Areas for Improvement</p>
                            <p className="text-sm text-muted-foreground">{review.improvements}</p>
                          </div>
                        )}

                        {review.goals && (
                          <div>
                            <p className="text-sm font-medium mb-1 text-foreground">Goals</p>
                            <p className="text-sm text-muted-foreground">{review.goals}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
