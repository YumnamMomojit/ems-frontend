import React from "react";
import { useAuth } from "~/hooks/AuthContext";
import { useEffect, useState, useRef } from "react";
import { getEmployeeProfile, updateEmployeeProfile, changePassword } from "~/services/employee.api";
import { toast } from "react-toastify";
import { useSearchParams, Link } from "react-router-dom";
import hrApi from "../services/hr.api";
import api from "~/services/api";
import { formatDistanceToNow } from "date-fns";

const Settings = () => {
    const { user, logout } = useAuth();
    const [searchParams] = useSearchParams();
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
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    const handleLogoutConfirm = () => {
        setIsLogoutModalOpen(false);
        logout();
    };

    // Notification Settings State (Mock)
    const [notificationSettings, setNotificationSettings] = useState({
        emailNotifications: true,
        pushNotifications: true,
        weeklyDigest: false,
        marketingEmails: false
    });

    const [notifications, setNotifications] = useState([]);
    const [loadingNotifications, setLoadingNotifications] = useState(true);

    useEffect(() => {
        fetchProfile();
        fetchNotifications();
    }, []);

    // Handle scroll to section based on query param
    useEffect(() => {
        const section = searchParams.get("section");
        if (section) {
            const element = document.getElementById(section);
            if (element) {
                // Small timeout to ensure rendering
                setTimeout(() => {
                    element.scrollIntoView({ behavior: "smooth", block: "start" });
                }, 100);
            }
        }
    }, [searchParams, loading]);

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

    const fetchNotifications = async () => {
        try {
            // Use generic notifications endpoint for all roles
            const res = await api.get("/notifications");
            setNotifications(res.data.data);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        } finally {
            setLoadingNotifications(false);
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

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    if (loading) {
        return <div className="p-8 text-center">Loading settings...</div>;
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-foreground dark:text-foreground tracking-tight">Personal Settings</h1>
                        <p className="text-muted-foreground mt-1 font-medium">Manage your account preferences, security, and interface theme.</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Settings Sidebar */}
                <aside className="lg:col-span-3 sticky top-24">
                    <div className="bg-card dark:bg-card rounded-xl border border-border shadow-sm overflow-hidden p-2">
                        <nav className="flex flex-col gap-1">
                            <button
                                onClick={() => scrollToSection('account')}
                                className="flex items-center justify-between px-4 py-3 rounded-lg text-foreground hover:bg-muted/50 font-semibold transition-all w-full text-left"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined">person</span>
                                    Account
                                </div>
                            </button>
                            <button
                                onClick={() => scrollToSection('security')}
                                className="flex items-center justify-between px-4 py-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 font-semibold transition-all group w-full text-left"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined group-hover:scale-110 transition-transform">security</span>
                                    Security
                                </div>
                            </button>
                            <button
                                onClick={() => scrollToSection('notifications')}
                                className="flex items-center justify-between px-4 py-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 font-semibold transition-all group w-full text-left"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined group-hover:scale-110 transition-transform">notifications</span>
                                    Notifications
                                </div>
                            </button>

                            <button
                                onClick={() => setIsLogoutModalOpen(true)}
                                className="flex items-center justify-between px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 font-semibold transition-all group w-full text-left mt-2"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined group-hover:scale-110 transition-transform">logout</span>
                                    Log out
                                </div>
                            </button>
                        </nav>
                    </div>
                </aside>

                {/* Main Content */}
                <div className="col-span-1 lg:col-span-9 flex flex-col gap-6 pb-20">
                    {/* Profile Section */}
                    <section id="account" className="bg-card dark:bg-card rounded-xl border border-border shadow-sm overflow-hidden">
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

                    {/* Security Section */}
                    <section id="security" className="bg-card dark:bg-card rounded-xl border border-border shadow-sm overflow-hidden">
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

                    {/* Notifications Section */}
                    <section id="notifications" className="bg-card dark:bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                        <header className="px-6 py-5 border-b border-border bg-muted/30">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary text-[22px]">notifications_active</span>
                                <h3 className="text-lg font-bold text-foreground dark:text-foreground">Notifications</h3>
                            </div>
                        </header>
                        <div className="p-0">
                            {loadingNotifications ? (
                                <div className="p-8 text-center text-muted-foreground">Loading notifications...</div>
                            ) : notifications.length > 0 ? (
                                <div className="divide-y divide-border">
                                    {notifications.map((notification) => (
                                        <Link
                                            key={notification.id}
                                            to={notification.link}
                                            className={`block p-4 hover:bg-muted/50 transition-colors cursor-pointer ${notification.isRead ? '' : 'bg-primary/5'}`}
                                        >
                                            <div className="flex gap-4">
                                                <div className={`mt-1 size-10 rounded-full flex items-center justify-center shrink-0 ${notification.bg} ${notification.color}`}>
                                                    <span className="material-symbols-outlined text-[20px]">{notification.icon}</span>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start">
                                                        <p className={`text-sm font-bold text-foreground ${notification.isRead ? '' : 'text-primary'}`}>
                                                            {notification.title}
                                                        </p>
                                                        <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                                                            {formatDistanceToNow(new Date(notification.time), { addSuffix: true })}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground mt-1">{notification.description}</p>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-12 text-center text-muted-foreground">
                                    <div className="bg-muted size-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span className="material-symbols-outlined text-[32px] text-muted-foreground/50">notifications_off</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-foreground">No notifications</h3>
                                    <p className="text-sm">You're all caught up! Check back later for updates.</p>
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </div >

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
            {/* Logout Confirmation Modal */}
            {isLogoutModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]" onClick={() => setIsLogoutModalOpen(false)}>
                    <div
                        className="border border-border rounded-xl shadow-2xl w-96 max-w-md p-6"
                        style={{ backgroundColor: 'hsl(var(--background))' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-lg font-bold text-foreground text-center mb-6">
                            Log out of your account
                        </h2>
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={handleLogoutConfirm}
                                className="w-full py-3 bg-destructive hover:bg-destructive/90 text-red-500 font-semibold rounded-lg transition-colors text-center"
                            >
                                Log out
                            </button>
                            <button
                                onClick={() => setIsLogoutModalOpen(false)}
                                className="w-full py-3 bg-muted hover:bg-muted/80 text-foreground font-semibold rounded-lg transition-colors text-center"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Settings;

