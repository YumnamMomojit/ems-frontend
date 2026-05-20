import { useState } from "react";
import { motion } from "framer-motion";
import {
  Settings as SettingsIcon,
  Bell,
  Shield,
  Eye,
  Palette,
  Globe,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "~/components/employee-ui/card";
import { Switch } from "~/components/employee-ui/switch";
import { Label } from "~/components/employee-ui/label";
import { Button } from "~/components/employee-ui/button";
import { useTheme } from "~/lib/theme-provider";
import { useToast } from "~/hooks/use-toast";
import { Separator } from "~/components/employee-ui/separator";
import { useAuth } from "~/hooks/AuthContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/employee-ui/select";

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const { logout } = useAuth();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    leaveApprovals: true,
    attendanceReminders: false,
    payrollAlerts: true,
  });

  const [privacy, setPrivacy] = useState({
    showOnlineStatus: true,
    showPhone: false,
    showEmail: true,
  });

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="p-4 md:p-6 max-w-4xl mx-auto space-y-6"
      data-testid="settings-page">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground mb-1">
          Settings
        </h1>
        <p className="text-muted-foreground text-sm">
          Manage your account preferences and notifications
        </p>
      </div>

      <Card data-testid="appearance-card">
        <CardHeader>
          <CardTitle className="text-lg font-medium flex items-center gap-2 text-foreground">
            <Palette className="w-5 h-5 text-primary" />
            Appearance
          </CardTitle>
          <CardDescription>
            Customize how PulseHR looks on your device
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="theme" className="text-base">
                Theme
              </Label>
              <p className="text-sm text-muted-foreground">
                Select your preferred color theme
              </p>
            </div>
            <Select value={theme} onValueChange={(value) => setTheme(value)}>
              <SelectTrigger className="w-[120px]" data-testid="select-theme">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {" "}
                <SelectItem value="dark">Light</SelectItem>
                <SelectItem value="light">Dark</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card data-testid="notifications-card">
        <CardHeader>
          <CardTitle className="text-lg font-medium flex items-center gap-2 text-foreground">
            <Bell className="w-5 h-5 text-primary" />
            Notifications
          </CardTitle>
          <CardDescription>
            Configure how you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications via email
              </p>
            </div>
            <Switch
              checked={notifications.email}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, email: checked })
              }
              data-testid="switch-email"
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Push Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive push notifications in browser
              </p>
            </div>
            <Switch
              checked={notifications.push}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, push: checked })
              }
              data-testid="switch-push"
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Leave Approval Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Get notified when leave requests need your action
              </p>
            </div>
            <Switch
              checked={notifications.leaveApprovals}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, leaveApprovals: checked })
              }
              data-testid="switch-leave-approvals"
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Attendance Reminders</Label>
              <p className="text-sm text-muted-foreground">
                Remind to clock in/out daily
              </p>
            </div>
            <Switch
              checked={notifications.attendanceReminders}
              onCheckedChange={(checked) =>
                setNotifications({
                  ...notifications,
                  attendanceReminders: checked,
                })
              }
              data-testid="switch-attendance"
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Payroll Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Get notified when payslip is available
              </p>
            </div>
            <Switch
              checked={notifications.payrollAlerts}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, payrollAlerts: checked })
              }
              data-testid="switch-payroll"
            />
          </div>
        </CardContent>
      </Card>

      <Card data-testid="privacy-card">
        <CardHeader>
          <CardTitle className="text-lg font-medium flex items-center gap-2 text-foreground">
            <Shield className="w-5 h-5 text-primary" />
            Privacy
          </CardTitle>
          <CardDescription>
            Control what information others can see about you
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Show Online Status</Label>
              <p className="text-sm text-muted-foreground">
                Let others see when you're online
              </p>
            </div>
            <Switch
              checked={privacy.showOnlineStatus}
              onCheckedChange={(checked) =>
                setPrivacy({ ...privacy, showOnlineStatus: checked })
              }
              data-testid="switch-online-status"
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Show Phone Number</Label>
              <p className="text-sm text-muted-foreground">
                Display phone in employee directory
              </p>
            </div>
            <Switch
              checked={privacy.showPhone}
              onCheckedChange={(checked) =>
                setPrivacy({ ...privacy, showPhone: checked })
              }
              data-testid="switch-phone"
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Show Email Address</Label>
              <p className="text-sm text-muted-foreground">
                Display email in employee directory
              </p>
            </div>
            <Switch
              checked={privacy.showEmail}
              onCheckedChange={(checked) =>
                setPrivacy({ ...privacy, showEmail: checked })
              }
              data-testid="switch-email-privacy"
            />
          </div>
        </CardContent>
      </Card>

      <Card data-testid="language-card">
        <CardHeader>
          <CardTitle className="text-lg font-medium flex items-center gap-2 text-foreground">
            <Globe className="w-5 h-5 text-primary" />
            Language & Region
          </CardTitle>
          <CardDescription>
            Set your preferred language and regional settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Language</Label>
              <p className="text-sm text-muted-foreground">
                Select your preferred language
              </p>
            </div>
            <Select defaultValue="en">
              <SelectTrigger
                className="w-[150px]"
                data-testid="select-language">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="fr">French</SelectItem>
                <SelectItem value="de">German</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Date Format</Label>
              <p className="text-sm text-muted-foreground">
                How dates are displayed
              </p>
            </div>
            <Select defaultValue="mdy">
              <SelectTrigger
                className="w-[150px]"
                data-testid="select-date-format">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                <SelectItem value="ymd">YYYY-MM-DD</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center pt-6">
        <Button variant="destructive" onClick={() => setIsLogoutModalOpen(true)} className="w-full md:w-auto">
          <span className="material-symbols-outlined mr-2">logout</span>
          Log Out
        </Button>
        <Button onClick={handleSave} data-testid="button-save-settings" className="w-full md:w-auto">
          Save Changes
        </Button>
      </div>

      {/* Logout Confirmation Modal */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]" onClick={() => setIsLogoutModalOpen(false)}>
          <div
            className="border border-border rounded-xl shadow-2xl w-96 max-w-md p-6 bg-background bg-popover"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold text-foreground text-center mb-6">
              Log out of your account
            </h2>
            <div className="flex flex-col gap-3">
              <Button
                variant="destructive"
                onClick={() => {
                  setIsLogoutModalOpen(false);
                  logout();
                }}
                className="w-full py-3 font-semibold rounded-lg transition-colors text-center"
              >
                Log out
              </Button>
              <Button
                variant="secondary"
                onClick={() => setIsLogoutModalOpen(false)}
                className="w-full py-3 font-semibold rounded-lg transition-colors text-center"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
