import { motion } from "framer-motion";
import { Clock, Calendar, FileEdit } from "lucide-react";
import { Button } from "~/components/employee-ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/employee-ui/card";
import { useToast } from "~/hooks/use-toast";

export function QuickActions({
  isClockedIn,
  onClockToggle,
  onApplyLeave,
  onRegularize,
  worksheetSubmitted
}) {
  const { toast } = useToast();

  const handleClockClick = () => {
    if (isClockedIn && !worksheetSubmitted) {
      toast({
        title: "Action Required",
        description: "Please submit your daily worksheet before clocking out.",
        variant: "destructive",
      });
      return;
    }
    onClockToggle();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card className="h-full" data-testid="quick-actions-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium text-foreground">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            onClick={handleClockClick}
            className={`w-full rounded-full h-12 text-base font-medium ${isClockedIn
              ? "bg-red-500 hover:bg-red-600 text-destructive-foreground"
              : "bg-primary text-primary-foreground"}`}
            data-testid="button-clock-toggle"
          >
            <Clock className="w-5 h-5 mr-2" />
            {isClockedIn ? "Clock Out" : "Clock In"}
          </Button>

          <Button
            onClick={onApplyLeave}
            variant="outline"
            className="w-full rounded-full h-12 text-base font-medium"
            data-testid="button-apply-leave"
          >
            <Calendar className="w-5 h-5 mr-2" />
            Apply Leave
          </Button>

          <Button
            onClick={onRegularize}
            variant="outline"
            className="w-full rounded-full h-12 text-base font-medium"
            data-testid="button-regularize"
          >
            <FileEdit className="w-5 h-5 mr-2" />
            Regularize Attendance
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
