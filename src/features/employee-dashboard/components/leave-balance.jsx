import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/employee-ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

function LeaveDonut({ label, total, used, color, bgColor }) {
  const remaining = total - used;
  const data = [
    { name: "Used", value: used },
    { name: "Remaining", value: remaining },
  ];

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={28}
              outerRadius={40}
              startAngle={90}
              endAngle={-270}
              paddingAngle={2}
              dataKey="value"
            >
              <Cell key="used" fill={bgColor} />
              <Cell key="remaining" fill={color} />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-semibold" style={{ color }}>
            {remaining}
          </span>
          <span className="text-[10px] text-muted-foreground">left</span>
        </div>
      </div>
      <p className="mt-2 text-sm font-medium text-foreground">{label}</p>
      <p className="text-xs text-muted-foreground">
        {used} used of {total}
      </p>
    </div>
  );
}

export function LeaveBalance({
  casualLeave,
  sickLeave,
  privilegeLeave,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <Card className="h-full" data-testid="leave-balance-card">
        <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-medium text-foreground">Leave Balance</CardTitle>        </CardHeader>
        <CardContent>
          <div className="flex justify-around items-start py-2">
            <LeaveDonut
              label="Casual"
              total={casualLeave.total}
              used={casualLeave.used}
              color="hsl(var(--chart-1))"
              bgColor="hsl(var(--muted))"
            />
            <LeaveDonut
              label="Sick"
              total={sickLeave.total}
              used={sickLeave.used}
              color="hsl(var(--chart-3))"
              bgColor="hsl(var(--muted))"
            />
            <LeaveDonut
              label="Privilege"
              total={privilegeLeave.total}
              used={privilegeLeave.used}
              color="hsl(var(--chart-4))"
              bgColor="hsl(var(--muted))"
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
