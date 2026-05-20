import React, { useState } from 'react';
import { useAuth } from '~/hooks/AuthContext';
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "~/hooks/use-toast";
import { queryClient } from "~/lib/queryClient";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "~/components/employee-ui/dialog";
import { Input } from "~/components/employee-ui/input";
import { Label } from "~/components/employee-ui/label";
import { Button } from "~/components/employee-ui/button";
import { Badge } from "~/components/employee-ui/badge";
import { Skeleton } from "~/components/employee-ui/skeleton";
import { Separator } from "~/components/employee-ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from "~/components/employee-ui/avatar"; // Assuming avatar can be reused
import api from "../../../services/api";
import {
  User,
  Mail,
  Phone,
  Building2,
  Calendar,
  MapPin,
  Briefcase,
  Edit2,
  Lock,
} from 'lucide-react';

const adminProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  phone: z.string().optional(),
  designation: z.string().optional(),
});

const AdminProfilePage = () => {
  const { user } = useAuth(); // Keep this for role check if needed, or if user data comes from context
  const { toast } = useToast();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { data: adminProfileData, isLoading } = useQuery({
    queryKey: ["/api/admin/profile"],
    queryFn: async () => {
      const response = await api.get("/admin/profile");
      return response.data;
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(adminProfileSchema),
  });

  const updateAdminProfileMutation = useMutation({
    mutationFn: async (updatedData) => {
      const response = await api.put("/admin/profile", updatedData);
      return response.data;
    },
    onSuccess: () => {
      toast({ title: "Profile Updated", description: "Admin profile has been updated successfully." });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/profile"] });
      setIsEditModalOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Profile Update Failed",
        description: error.response?.data?.message || error.message || "An unknown error occurred.",
        variant: "destructive",
      });
    },
  });

  const handleEditClick = () => {
    reset({
      firstName: adminProfileData.firstName,
      lastName: adminProfileData.lastName,
      email: adminProfileData.userEmail,
      phone: adminProfileData.employeePhone,
      designation: adminProfileData.employeeDesignation,
    });
    setIsEditModalOpen(true);
  };

  const onSubmit = (data) => {
    updateAdminProfileMutation.mutate(data);
  };


  if (isLoading || !adminProfileData) {
    return (
      <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }


  const infoItems = [
    { icon: Mail, label: "Email", value: adminProfileData.userEmail },
    { icon: Phone, label: "Phone", value: adminProfileData.employeePhone || "N/A" },
    { icon: Briefcase, label: "Designation", value: adminProfileData.employeeDesignation || "N/A" },
    { icon: Building2, label: "Department", value: adminProfileData.departmentName || "N/A" },
    { icon: Building2, label: "Organization", value: adminProfileData.organizationName },
    { icon: Calendar, label: "Joining Date", value: adminProfileData.employeeDateOfJoining ? new Date(adminProfileData.employeeDateOfJoining).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "N/A" },
    { icon: User, label: "User Status", value: adminProfileData.userStatus || "N/A" },
    { icon: Lock, label: "User Role", value: adminProfileData.userRole || "N/A" },
  ];

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="universal-card-parent max-w-4xl mx-auto space-y-6"
        data-testid="admin-profile-page"
      >
        <Card
          data-testid="profile-header-card"
          className="universal-card-child"
        >
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="relative">
                <Avatar className="w-32 h-32">
                  <AvatarImage src={adminProfileData.avatarUrl} alt={`${adminProfileData.firstName} ${adminProfileData.lastName}`} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-3xl font-semibold">
                    {`${adminProfileData.firstName?.[0] || ""}${adminProfileData.lastName?.[0] || ""}`.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {/* <Button
                  size="icon"
                  variant="secondary"
                  className="absolute bottom-0 right-0 rounded-full"
                  data-testid="button-edit-avatar"
                >
                  <Edit2 className="w-4 h-4" />
                </Button> */}
              </div>
              <div className="text-center md:text-left flex-1">
                <h1 className="text-2xl font-semibold text-foreground">
                  {adminProfileData.firstName} {adminProfileData.lastName}
                </h1>
                <p className="text-muted-foreground mt-1">{adminProfileData.employeeDesignation || "Admin"}</p>
                <div className="flex items-center justify-center md:justify-start gap-2 mt-3 flex-wrap">
                  <Badge variant="secondary">{adminProfileData.departmentName || "N/A"}</Badge>
                  <Badge variant="outline">{adminProfileData.employeeCode || adminProfileData.userRole}</Badge>
                </div>
              </div>
              <Button variant="outline" data-testid="button-edit-profile" onClick={handleEditClick}>
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card
          data-testid="profile-details-card"
          className="universal-card-child"
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium text-foreground">Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {infoItems.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="flex items-center gap-4 py-3">
                    <div className="p-2 rounded-lg bg-muted">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                      <p className="text-sm font-medium text-foreground">{item.value}</p>
                    </div>
                  </div>
                  {index < infoItems.length - 1 && <Separator />}
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats (keeping as is, as no direct backend data for these) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card
            data-testid="quick-stats-card"
            className="universal-card-child"
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium text-foreground">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-muted/50 text-center">
                  <p className="text-2xl font-semibold text-primary">23</p>
                  <p className="text-xs text-muted-foreground">Leave Balance</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50 text-center">
                  <p className="text-2xl font-semibold text-status-online">98%</p>
                  <p className="text-xs text-muted-foreground">Attendance</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50 text-center">
                  <p className="text-2xl font-semibold text-foreground">2.8</p>
                  <p className="text-xs text-muted-foreground">Years at Company</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50 text-center">
                  <p className="text-2xl font-semibold text-secondary">12</p>
                  <p className="text-xs text-muted-foreground">Team Members</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Documents (keeping as is, as no direct backend data for these) */}
          <Card
            data-testid="documents-card"
            className="universal-card-child"
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium text-foreground">Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {["Offer Letter", "ID Proof", "Address Proof", "Tax Documents"].map((doc, i) => (
                  <div
                    key={doc}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover-elevate cursor-pointer"
                  >
                    <span className="text-sm text-foreground">{doc}</span>
                    <Badge variant="secondary" className="text-xs">View</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Edit Admin Profile Dialog */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Admin Profile</DialogTitle>
            <DialogDescription>
              Make changes to the admin profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="firstName" className="text-right">
                First Name
              </Label>
              <Input id="firstName" {...register("firstName")} className="col-span-3" />
              {errors.firstName && <p className="col-span-4 text-right text-sm text-red-600">{errors.firstName.message}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lastName" className="text-right">
                Last Name
              </Label>
              <Input id="lastName" {...register("lastName")} className="col-span-3" />
              {errors.lastName && <p className="col-span-4 text-right text-sm text-red-600">{errors.lastName.message}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input id="email" {...register("email")} className="col-span-3" />
              {errors.email && <p className="col-span-4 text-right text-sm text-red-600">{errors.email.message}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Phone
              </Label>
              <Input id="phone" {...register("phone")} className="col-span-3" />
              {errors.phone && <p className="col-span-4 text-right text-sm text-red-600">{errors.phone.message}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="designation" className="text-right">
                Designation
              </Label>
              <Input id="designation" {...register("designation")} className="col-span-3" />
              {errors.designation && <p className="col-span-4 text-right text-sm text-red-600">{errors.designation.message}</p>}
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting || updateAdminProfileMutation.isPending}>
                {isSubmitting || updateAdminProfileMutation.isPending ? "Saving..." : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminProfilePage;