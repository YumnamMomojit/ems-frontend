import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/employee-ui/card";
import { Button } from "~/components/employee-ui/button";
import { Badge } from "~/components/employee-ui/badge";
import { Check, X, Calendar, FileText, DollarSign } from "lucide-react";

const typeIcons = {
  leave: Calendar,
  expense: DollarSign,
  document: FileText,
};

const typeColors = {
  leave: "text-accent bg-accent/10",
  expense: "text-primary bg-primary/10",
  document: "text-secondary bg-secondary/10",
};

export function ActionCenter({ actions, onApprove, onReject }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card className="h-full" data-testid="action-center-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <CardTitle className="text-lg font-medium text-foreground">Action Center</CardTitle>
            {actions.length > 0 && (
              <Badge className="bg-primary text-primary-foreground">
                {actions.length} Pending
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {actions.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              <Check className="w-12 h-12 mx-auto mb-3 text-primary opacity-50" />
              <p className="text-sm">All caught up! No pending actions.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {actions.slice(0, 4).map((action) => {
                const Icon = typeIcons[action.type] || FileText;
                return (
                  <motion.div
                    key={action.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                    data-testid={`action-item-${action.id}`}
                  >
                    <div className={`p-2 rounded-lg ${typeColors[action.type]}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{action.title}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {action.requesterName} • {action.date}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-primary hover:text-primary-foreground hover:bg-primary/10"
                        onClick={() => onApprove(action.id)}
                        data-testid={`button-approve-${action.id}`}
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-destructive hover:text-destructive-foreground hover:bg-destructive/10"
                        onClick={() => onReject(action.id)}
                        data-testid={`button-reject-${action.id}`}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
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
