import React from "react";
import Settings from "~/features/hr-dashboard/pages/Settings"; // Reuse existing HR settings page logic as it handles role/profile data internally

// Or better, refactor settings logic to be truly shared if it has hardcoded HR stuff.
// Checking Settings.jsx... it mostly uses `getEmployeeProfile` which is generic.
// It uses `hrApi.getNotifications` - this might need to use generic `notificationsApi` if exists, 
// OR we just assume the Settings page is generic enough.
// The provided Settings.jsx seems to have some HR specific text but logic is mostly profile based.

const SharedSettings = () => {
    return <Settings />;
};

export default SharedSettings;
