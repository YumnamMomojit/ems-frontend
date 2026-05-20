import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "~/hooks/AuthContext";
import { useToast } from "~/hooks/use-toast";
import { Pencil } from "lucide-react";
import { getEmployeeProfile } from "~/services/employee.api";

/**
 * DashboardWelcome Component
 * Displays the user's cover photo, avatar, name, and basic info.
 * Reusable across all dashboards.
 */
const DashboardWelcome = () => {
    const { user } = useAuth();
    const { toast } = useToast();
    const [employeeName, setEmployeeName] = useState(user?.firstName ? `${user.firstName} ${user.lastName}` : "User");
    const [isCoverModalOpen, setIsCoverModalOpen] = useState(false);
    const [coverImage, setCoverImage] = useState("https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80");
    const [designation, setDesignation] = useState("Employee");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const profileRes = await getEmployeeProfile();
                if (profileRes.employee) {
                    setEmployeeName(`${profileRes.employee.firstName} ${profileRes.employee.lastName}`);
                    setDesignation(profileRes.employee.designation || user?.role || "Employee");
                }
            } catch (error) {
                console.error("Error fetching profile for welcome header:", error);
            }
        };
        fetchProfile();
    }, [user]);

    const handleCoverImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCoverImage(reader.result);
                setIsCoverModalOpen(false);
                toast({ title: "Success", description: "Cover image updated successfully!" });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="relative w-full rounded-2xl bg-card dark:bg-card shadow-sm border border-border mb-8">
            {/* Blurred Background with overflow-visible to show popup */}
            <div className="overflow-visible rounded-t-2xl">
                <div className="h-48 w-full bg-cover bg-center relative rounded-t-2xl" style={{ backgroundImage: `url('${coverImage}')` }}>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent backdrop-blur-[2px] rounded-t-2xl"></div>

                    {/* Pencil Edit Button with Popup */}
                    <div className="absolute bottom-4 right-4 z-10">
                        <button
                            onClick={() => setIsCoverModalOpen(!isCoverModalOpen)}
                            className="p-2 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 rounded-full shadow-lg transition-all cursor-pointer"
                            title="Edit Cover Image"
                        >
                            <Pencil className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                        </button>

                        {/* Popup Menu */}
                        {isCoverModalOpen && (
                            <>
                                {/* Backdrop to close popup */}
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setIsCoverModalOpen(false)}
                                ></div>

                                {/* Popup content - Dropdown below pencil */}
                                <div className="absolute top-full right-0 mt-2 bg-card dark:bg-card border border-border rounded-lg shadow-xl z-50 w-64 animate-in fade-in zoom-in-95 duration-200">
                                    <div className="p-3 border-b border-border">
                                        <h3 className="font-semibold text-sm text-foreground">Cover photo</h3>
                                    </div>
                                    <div className="p-3">
                                        <input
                                            type="file"
                                            id="coverImageInput"
                                            accept="image/*"
                                            onChange={handleCoverImageUpload}
                                            className="hidden"
                                        />
                                        <label
                                            htmlFor="coverImageInput"
                                            className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md cursor-pointer transition-colors"
                                        >
                                            <Pencil className="h-4 w-4" />
                                            Edit image
                                        </label>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <div className="px-8 pb-8 relative flex flex-col md:flex-row gap-6 items-start md:items-end -mt-12">
                {/* Avatar */}
                <div className="relative group">
                    <div className="h-32 w-32 rounded-full border-4 border-background dark:border-card shadow-lg overflow-hidden bg-background">
                        <img alt="Profile" className="h-full w-full object-cover" src={`https://ui-avatars.com/api/?name=${employeeName.replace(" ", "+")}&background=random`} />
                    </div>
                    <div className="absolute bottom-2 right-2 h-6 w-6 bg-green-500 border-2 border-background dark:border-card rounded-full" title="Online"></div>
                </div>
                {/* Basic Info */}
                <div className="flex-1 mb-2">
                    <div className="flex flex-wrap items-center gap-3 mb-1">
                        <h1 className="text-3xl font-bold text-foreground dark:text-foreground">{employeeName}</h1>
                        <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary ring-1 ring-inset ring-primary/20">
                            {user?.role?.replace("_", " ")}
                        </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-muted-foreground dark:text-muted-foreground text-sm font-medium">
                        <span className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[18px]">work</span>
                            {designation}
                        </span>
                        <span className="hidden sm:block text-muted-foreground/40">•</span>
                        <span className="flex items-center gap-1.5 blocks">
                            <span className="material-symbols-outlined text-[18px]">location_on</span>
                            Corporate Office
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardWelcome;
