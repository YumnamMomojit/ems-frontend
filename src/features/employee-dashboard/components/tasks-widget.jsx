import { motion } from "framer-motion";
import { CheckSquare, ArrowRight, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/employee-ui/card";
import { Progress } from "~/components/employee-ui/progress";
import { Badge } from "~/components/employee-ui/badge";
import { Button } from "~/components/employee-ui/button";

export function TasksWidget({ tasks = [] }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
        >
            <Card className="h-full" data-testid="tasks-widget">
                <CardHeader className="pb-3 border-b border-border/50">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-medium flex items-center gap-2">
                            <CheckSquare className="w-5 h-5 text-primary" />
                            My Tasks
                        </CardTitle>
                        <Button variant="ghost" size="sm" className="hidden lg:flex text-xs h-8">
                            View All <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar">
                    {tasks.length === 0 ? (
                        <div className="text-center text-muted-foreground py-8">
                            <CheckSquare className="w-10 h-10 mx-auto mb-2 opacity-20" />
                            <p className="text-sm">No active tasks assigned.</p>
                        </div>
                    ) : (
                        tasks.map((task, index) => (
                            <div
                                key={task.id || index}
                                className="p-3 rounded-lg border border-border/50 bg-card hover:bg-muted/50 transition-colors space-y-3"
                            >
                                <div className="flex justify-between items-start gap-2">
                                    <h4 className="text-sm font-medium line-clamp-1">{task.title}</h4>
                                    <Badge
                                        variant={
                                            task.priority === "high"
                                                ? "destructive"
                                                : task.priority === "medium"
                                                    ? "default" // Changed from "warning" (often not standard shadcn variant) to default or secondary. Assuming default is fine or we can use custom class.
                                                    : "secondary"
                                        }
                                        className="text-[10px] px-1.5 py-0 h-5"
                                    >
                                        {task.priority || "Normal"}
                                    </Badge>
                                </div>

                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs text-muted-foreground">
                                        <span>Progress</span>
                                        <span>{task.progress}%</span>
                                    </div>
                                    <Progress value={task.progress} className="h-1.5" />
                                </div>

                                <div className="flex justify-between items-center text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                        Due: <span className={task.isOverdue ? "text-destructive font-medium" : ""}>{task.dueDate}</span>
                                    </span>
                                    {task.isOverdue && <AlertTriangle className="w-3 h-3 text-destructive" />}
                                </div>
                            </div>
                        ))
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
}
