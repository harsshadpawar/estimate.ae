// src/config/menuConfig.ts

export const getMenuItemsByRole = (role:any) => {
  if (role === 'super-admin') {
    return [
      { text: "Admin Dashboard", icon: "Dashboard", path: "/admin/admin-dashboard" },
      { text: "User Management", icon: "ManageAccounts", path: "/admin/user-managemnet" },
      { text: "Report and Analytics", icon: "Analytics", path: "/admin/reports-analytics" },
      { text: "Customer Transactions", icon: "MonetizationOn", path: "/admin/customer-transactions" },
      { text: "Configuration and Setting", icon: "Tune", path: "/admin/configuration-setting" },
      { text: "Notifications", icon: "NotificationsActive", path: "/admin/notifications" },
      { text: "Subscription Management", icon: "Subscriptions", path: "/admin/subscription-management" }
    ];
  } else {
    return [
      { text: "Quote Generation", icon: "Home", path: "/dashboard" },
      { text: "Machining Jobs", icon: "SpaceDashboard", path: "/user-configuration" },
      { text: "Machining Setup", icon: "People", path: "/user-configuration" },
      { text: "Account Setup", icon: "Settings", path: "/user-configuration" }
    ];
  }
};
