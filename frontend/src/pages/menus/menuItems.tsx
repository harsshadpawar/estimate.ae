// src/config/menuConfig.ts

export const getMenuItemsByRole = (role:any) => {
  if (role === 'super-admin' || role === 'admin') {
    return [
      // { text: "Admin Dashboard", icon: "Dashboard", path: "/admin/admin-dashboard" },
      { text: "User Management", icon: "ManageAccounts", path: "/admin/user-managemnet" },
      { text: "Company Management", icon: "ManageAccounts", path: "/admin/company-management" },
      { text: "Product Management", icon: "ManageAccounts", path: "/admin/product-management" },
      // { text: "Report and Analytics", icon: "Analytics", path: "/admin/reports-analytics" },
      // { text: "Customer Transactions", icon: "MonetizationOn", path: "/admin/customer-transactions" },
      // { text: "Configuration and Setting", icon: "Tune", path: "/admin/configuration-setting" },
      // { text: "Notifications", icon: "NotificationsActive", path: "/admin/notifications" },
      { text: "Subscription Management", icon: "Subscriptions", path: "/admin/subscription-management" },
      { text: "User Configuration", icon: "Subscriptions", path: "/admin/user-configuration" }
    ];
  } else {
    return [
      { text: "Quote Generation", icon: "Home", path: "/dashboard" },
      { text: "Machining Jobs", icon: "SpaceDashboard", path: "/user-configuration" },
      { text: "Machining Setup", icon: "People", path: "/machine-setup" },
      { text: "Account Setup", icon: "Settings", path: "/account-setup" }
    ];
  }
};
