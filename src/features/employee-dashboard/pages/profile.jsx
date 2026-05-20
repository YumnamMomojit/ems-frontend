import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useAuth } from "~/hooks/AuthContext";
import { motion } from "framer-motion";
import { User, Phone, MapPin, Mail, Briefcase, Calendar, Camera } from "lucide-react";
import { Button } from "~/components/employee-ui/button";
import { Input } from "~/components/employee-ui/input";
import { Label } from "~/components/employee-ui/label";
import { Textarea } from "~/components/employee-ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/employee-ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/employee-ui/avatar";
import { useToast } from "~/hooks/use-toast";
import { queryClient } from "~/lib/queryClient";
import api from "~/services/api";
import { format } from "date-fns";
import { resolveFileUrl } from "~/lib/fileUrl";

export default function ProfilePage() {
  const { toast } = useToast();
  const { user: authUser } = useAuth();
  const isManager = authUser?.role?.toUpperCase() === "MANAGER";

  const { register, handleSubmit, setValue, watch, formState: { isDirty } } = useForm();
  const [previewImage, setPreviewImage] = useState(null);

  const { data: profileData, isLoading } = useQuery({
    queryKey: [isManager ? "/api/manager/profile" : "/api/employee/profile"],
  });

  const user = profileData?.user || {};
  const employee = profileData?.employee || {};

  useEffect(() => {
    if (employee) {
      setValue("phone", employee.phone || "");
      setValue("address", employee.address || "");
    }
  }, [employee, setValue]);

  const updateProfileMutation = useMutation({
    mutationFn: async (formData) => {
      const data = new FormData();
      data.append("phone", formData.phone);
      data.append("address", formData.address);
      if (formData.avatar && formData.avatar.length > 0) {
        data.append("avatar", formData.avatar[0]);
      }

      const response = await api.put(isManager ? "/manager/profile" : "/employee/profile", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: [isManager ? "/api/manager/profile" : "/api/employee/profile"] });
      // Also invalidate dashboard since it shows avatar/name
      queryClient.invalidateQueries({ queryKey: [isManager ? "/api/manager/dashboard" : "/api/employee/dashboard"] });
      setPreviewImage(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update profile",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data) => {
    updateProfileMutation.mutate(data);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      // Trigger react-hook-form registration manually if needed or just rely on file input
      // Since we use {...register("avatar")} on input, it captures the file list.
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Loading profile...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="p-4 md:p-6 max-w-4xl mx-auto space-y-6"
    >
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Profile Card */}
        <Card className="w-full md:w-1/3">
          <CardContent className="pt-6 flex flex-col items-center text-center">
            <div className="relative group mb-4">
              <Avatar className="w-32 h-32 border-4 border-background shadow-lg">
                <AvatarImage src={previewImage || resolveFileUrl(user.avatar)} />
                <AvatarFallback className="text-4xl bg-primary/10 text-primary">
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </AvatarFallback>
              </Avatar>
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full cursor-pointer hover:bg-primary/90 transition-colors shadow-sm"
              >
                <Camera className="w-4 h-4" />
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  {...register("avatar")}
                  onChange={(e) => {
                    handleAvatarChange(e);
                    register("avatar").onChange(e);
                  }}
                />
              </label>
            </div>
            <h2 className="text-xl font-bold text-foreground">{user.name}</h2>
            <p className="text-sm text-muted-foreground">{employee.designation || user.role}</p>
            <div className="mt-4 w-full space-y-2 text-sm text-left">
              <div className="flex items-center gap-2 p-2 rounded hover:bg-muted/50">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="truncate">{user.email}</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded hover:bg-muted/50">
                <Briefcase className="w-4 h-4 text-muted-foreground" />
                <span className="truncate">{employee.department?.name || "No Department"}</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded hover:bg-muted/50">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>Joined {employee.dateOfJoining ? format(new Date(employee.dateOfJoining), "MMM d, yyyy") : "N/A"}</span>
              </div>
              {employee.reportsTo && (
                <div className="flex flex-col gap-1 p-2 rounded hover:bg-muted/50 border-t mt-2">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Reports To</p>
                  <div className="flex items-center gap-2">
                    <User className="w-3 h-3 text-primary" />
                    <span className="font-medium">{employee.reportsTo.firstName} {employee.reportsTo.lastName}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground ml-5">{employee.reportsTo.designation}</p>
                </div>
              )}
            </div>

            {user.role === "MANAGER" && (
              <div className="mt-6 w-full space-y-4 text-left border-t pt-4">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-primary" />
                  Management Scope
                </h3>
                {employee.managesDepartments?.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Departments</p>
                    {employee.managesDepartments.map((dept) => (
                      <div key={dept.id} className="text-sm bg-primary/5 p-2 rounded border border-primary/10">
                        {dept.name}
                      </div>
                    ))}
                  </div>
                )}
                {employee.managesTeams?.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Teams</p>
                    {employee.managesTeams.map((team) => (
                      <div key={team.id} className="text-sm bg-primary/5 p-2 rounded border border-primary/10">
                        {team.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Form */}
        <Card className="w-full md:w-2/3">
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" value={employee.firstName || ""} disabled className="bg-muted" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" value={employee.lastName || ""} disabled className="bg-muted" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    className="pl-9"
                    placeholder="+1 234 567 890"
                    {...register("phone")}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Textarea
                    id="address"
                    className="pl-9 min-h-[100px]"
                    placeholder="Your residential address"
                    {...register("address")}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={updateProfileMutation.isPending}>
                  {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
