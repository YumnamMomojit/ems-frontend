import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "~/hooks/AuthContext";
import { getEmployeeProfile, updateEmployeeProfile, changePassword } from "~/services/employee.api";
import { toast } from "react-toastify";

const ProfileSettings = () => {
    const { user } = useAuth();
    const [profileData, setProfileData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: ""
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [loading, setLoading] = useState(true);
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [isEditingPassword, setIsEditingPassword] = useState(false);
    const [originalProfileData, setOriginalProfileData] = useState({});
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);
    const fileInputRef = useRef(null);

    // Notification Settings State (Mock)
    const [notificationSettings, setNotificationSettings] = useState({
        emailNotifications: true,
        pushNotifications: true,
        weeklyDigest: false,
        marketingEmails: false
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const data = await getEmployeeProfile();
            // data.employee contains the employee details
            if (data.employee) {
                setProfileData({
                    firstName: data.employee.firstName || "",
                    lastName: data.employee.lastName || "",
                    email: data.employee.email || "",
                    phone: data.employee.phone || "",
                    address: data.employee.address || ""
                });
                setOriginalProfileData({
                    firstName: data.employee.firstName || "",
                    lastName: data.employee.lastName || "",
                    email: data.employee.email || "",
                    phone: data.employee.phone || "",
                    address: data.employee.address || ""
                });
            } else if (data.user) {
                // Fallback if employee record is missing or incomplete
                setProfileData(prev => ({
                    ...prev,
                    email: data.user.email
                }));
                setOriginalProfileData(prev => ({ ...prev, email: data.user.email }));
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
            toast.error("Failed to load profile data");
        } finally {
            setLoading(false);
        }
    };

    const handleProfileChange = (e) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handleNotificationChange = (e) => {
        setNotificationSettings({ ...notificationSettings, [e.target.name]: e.target.checked });
        toast.info("Notification preference updated");
    };

    const submitProfileUpdate = async () => {
        try {
            await updateEmployeeProfile({
                firstName: profileData.firstName,
                lastName: profileData.lastName,
                phone: profileData.phone,
                address: profileData.address
            });
            toast.success("Profile updated successfully");
            setIsEditingProfile(false);
            setOriginalProfileData(profileData);
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error(error.response?.data?.message || "Failed to update profile");
        }
    };

    const handleEditProfile = () => {
        setOriginalProfileData(profileData);
        setIsEditingProfile(true);
    };

    const handleCancelProfile = () => {
        setProfileData(originalProfileData);
        setIsEditingProfile(false);
    };

    const handleEditPassword = () => {
        setIsEditingPassword(true);
    };

    const handleCancelPassword = () => {
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setIsEditingPassword(false);
    };

    const handlePhotoClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                toast.error('Please select an image file');
                return;
            }
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image size should be less than 5MB');
                return;
            }
            setSelectedPhoto(file);
            // Create preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const submitPasswordUpdate = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("New passwords do not match");
            return;
        }
        if (!passwordData.currentPassword) {
            toast.error("Please enter current password");
            return;
        }

        try {
            await changePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            toast.success("Password updated successfully");
            setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
            setIsEditingPassword(false);
        } catch (error) {
            console.error("Error updating password:", error);
            toast.error(error.response?.data?.message || "Failed to update password");
        }
    };

    if (loading) {
        return <div className="p-8 text-center">Loading settings...</div>;
    }

    return (
        <div className="flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-300">
            {/* Profile Section */}
            <section className="bg-card dark:bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                <header className="px-6 py-5 border-b border-border flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-bold text-foreground dark:text-foreground">Profile Details</h3>
                        <p className="text-sm text-muted-foreground">Basic information used across the portal.</p>
                    </div>
                    <div className="flex gap-2">
                        {!isEditingProfile ? (
                            <button
                                onClick={handleEditProfile}
                                className="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary-dark rounded-lg text-sm font-bold shadow-md shadow-primary/20 transition-all"
                            >
                                Edit Profile
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={handleCancelProfile}
                                    className="px-4 py-2 bg-background border border-border text-foreground hover:bg-muted rounded-lg text-sm font-bold transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={submitProfileUpdate}
                                    className="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary-dark rounded-lg text-sm font-bold shadow-md shadow-primary/20 transition-all"
                                >
                                    Save Changes
                                </button>
                            </>
                        )}
                    </div>
                </header>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-foreground">First Name</label>
                        <input
                            name="firstName"
                            className={`w-full rounded-lg border-input focus:ring-primary focus:border-primary text-sm font-medium py-2.5 px-4 ${isEditingProfile ? "bg-background" : "bg-muted text-muted-foreground"}`}
                            type="text"
                            value={profileData.firstName}
                            onChange={handleProfileChange}
                            disabled={!isEditingProfile}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-foreground">Last Name</label>
                        <input
                            name="lastName"
                            className={`w-full rounded-lg border-input focus:ring-primary focus:border-primary text-sm font-medium py-2.5 px-4 ${isEditingProfile ? "bg-background" : "bg-muted text-muted-foreground"}`}
                            type="text"
                            value={profileData.lastName}
                            onChange={handleProfileChange}
                            disabled={!isEditingProfile}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-foreground">Email Address</label>
                        <input
                            className="w-full rounded-lg border-input bg-muted text-muted-foreground focus:ring-primary focus:border-primary text-sm font-medium py-2.5 px-4"
                            type="email"
                            value={profileData.email}
                            readOnly
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-foreground">Phone</label>
                        <input
                            name="phone"
                            className={`w-full rounded-lg border-input focus:ring-primary focus:border-primary text-sm font-medium py-2.5 px-4 ${isEditingProfile ? "bg-background" : "bg-muted text-muted-foreground"}`}
                            type="text"
                            value={profileData.phone}
                            onChange={handleProfileChange}
                            disabled={!isEditingProfile}
                        />
                    </div>
                    <div className="md:col-span-2 space-y-4">
                        <label className="block text-sm font-bold text-foreground">Profile Photo</label>
                        <div className="flex items-center gap-6">
                            <div className="h-20 w-20 rounded-full overflow-hidden bg-muted shadow-inner">
                                <img
                                    alt="Profile"
                                    className="h-full w-full object-cover"
                                    src={photoPreview || `https://ui-avatars.com/api/?name=${profileData.firstName}+${profileData.lastName}&background=random`}
                                />
                            </div>
                            <div className="flex gap-3">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handlePhotoChange}
                                    className="hidden"
                                />
                                <button
                                    type="button"
                                    onClick={handlePhotoClick}
                                    className="px-4 py-2 bg-background border border-border text-foreground hover:bg-muted rounded-lg text-sm font-bold transition-colors cursor-pointer"
                                >
                                    Change Photo
                                </button>

                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Security Section */}
            <section className="bg-card dark:bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                <header className="px-6 py-5 border-b border-border bg-muted/30">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-[22px]">lock_reset</span>
                        <h3 className="text-lg font-bold text-foreground dark:text-foreground">Security & Password</h3>
                    </div>
                </header>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-foreground">Current Password</label>
                            <input
                                name="currentPassword"
                                className={`w-full rounded-lg border-input focus:ring-primary focus:border-primary text-sm font-medium py-2.5 px-4 ${isEditingPassword ? "bg-background" : "bg-muted text-muted-foreground"}`}
                                type="password"
                                placeholder={isEditingPassword ? "********" : "********"}
                                value={passwordData.currentPassword}
                                onChange={handlePasswordChange}
                                disabled={!isEditingPassword}
                            />
                        </div>
                        <div className="hidden md:block"></div>
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-foreground">New Password</label>
                            <input
                                name="newPassword"
                                className={`w-full rounded-lg border-input focus:ring-primary focus:border-primary text-sm font-medium py-2.5 px-4 ${isEditingPassword ? "bg-background" : "bg-muted text-muted-foreground"}`}
                                placeholder={isEditingPassword ? "Enter new password" : "Locked"}
                                type="password"
                                value={passwordData.newPassword}
                                onChange={handlePasswordChange}
                                disabled={!isEditingPassword}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-foreground">Confirm New Password</label>
                            <input
                                name="confirmPassword"
                                className={`w-full rounded-lg border-input focus:ring-primary focus:border-primary text-sm font-medium py-2.5 px-4 ${isEditingPassword ? "bg-background" : "bg-muted text-muted-foreground"}`}
                                placeholder={isEditingPassword ? "Repeat new password" : "Locked"}
                                type="password"
                                value={passwordData.confirmPassword}
                                onChange={handlePasswordChange}
                                disabled={!isEditingPassword}
                            />
                        </div>
                    </div>
                    <div className="pt-6 border-t border-border">
                        <div className="flex gap-2">
                            {!isEditingPassword ? (
                                <button
                                    onClick={handleEditPassword}
                                    className="px-4 py-2 border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-lg text-sm font-bold transition-all uppercase tracking-wide"
                                >
                                    Change Password
                                </button>
                            ) : (
                                <>
                                    <button
                                        onClick={handleCancelPassword}
                                        className="px-4 py-2 border-2 border-muted-foreground text-muted-foreground hover:bg-muted rounded-lg text-sm font-bold transition-all uppercase tracking-wide"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={submitPasswordUpdate}
                                        className="px-4 py-2 border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-lg text-sm font-bold transition-all uppercase tracking-wide"
                                    >
                                        Update Password
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Notification Preferences (Moved to Account Section) */}
            <section className="bg-card dark:bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                <header className="px-6 py-5 border-b border-border bg-muted/30">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-[22px]">tune</span>
                        <h3 className="text-lg font-bold text-foreground dark:text-foreground">Notification Preferences</h3>
                    </div>
                </header>
                <div className="p-6">
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="font-bold text-foreground">Email Notifications</h4>
                                <p className="text-sm text-muted-foreground">Receive emails about your leave requests and approvals.</p>
                            </div>
                            <div className="relative inline-block w-12 align-middle select-none transition duration-200 ease-in">
                                <input
                                    checked={notificationSettings.emailNotifications}
                                    onChange={handleNotificationChange}
                                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-background border-4 appearance-none cursor-pointer right-0 border-primary"
                                    id="toggle-email"
                                    name="emailNotifications"
                                    type="checkbox"
                                />
                                <label className="toggle-label block overflow-hidden h-6 rounded-full bg-primary/20 cursor-pointer" htmlFor="toggle-email"></label>
                            </div>
                        </div>
                        <div className="border-t border-border/50"></div>
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="font-bold text-foreground">Push Notifications</h4>
                                <p className="text-sm text-muted-foreground">Receive real-time push notifications on this device.</p>
                            </div>
                            <div className="relative inline-block w-12 align-middle select-none transition duration-200 ease-in">
                                <input
                                    checked={notificationSettings.pushNotifications}
                                    onChange={handleNotificationChange}
                                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-background border-4 appearance-none cursor-pointer right-0 border-primary"
                                    id="toggle-push"
                                    name="pushNotifications"
                                    type="checkbox"
                                />
                                <label className="toggle-label block overflow-hidden h-6 rounded-full bg-primary/20 cursor-pointer" htmlFor="toggle-push"></label>
                            </div>
                        </div>
                        <div className="border-t border-border/50"></div>
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="font-bold text-foreground">Weekly Digest</h4>
                                <p className="text-sm text-muted-foreground">Get a weekly summary of your activities and reports.</p>
                            </div>
                            <div className="relative inline-block w-12 align-middle select-none transition duration-200 ease-in">
                                <input
                                    checked={notificationSettings.weeklyDigest}
                                    onChange={handleNotificationChange}
                                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-background border-4 appearance-none cursor-pointer right-0 border-primary"
                                    id="toggle-digest"
                                    name="weeklyDigest"
                                    type="checkbox"
                                />
                                <label className="toggle-label block overflow-hidden h-6 rounded-full bg-primary/20 cursor-pointer" htmlFor="toggle-digest"></label>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <style>{`
                .toggle-checkbox:checked {
                    right: 0;
                    border-color: #ec131e;
                    background-color: #ec131e;
                }
                .toggle-checkbox:checked + .toggle-label {
                    background-color: rgba(236, 19, 30, 0.2);
                }
                .toggle-checkbox {
                     right: auto;
                     left: 0;
                     border-color: #e5e7eb;
                     background-color: #9ca3af;
                }
                 .toggle-checkbox:checked {
                    right: 0;
                    left: auto;
                }
            `}</style>
        </div>
    );
};

export default ProfileSettings;
