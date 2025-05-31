import React from 'react';

// Route configuration types
export interface RouteConfig {
  path: string;
  component: React.LazyExoticComponent<React.ComponentType<any>>;
  protected?: boolean;
  loadingMessage?: string;
  layout?: 'sidebar' | 'none';
  isAdmin?: boolean;
}

// Create a custom lazy loader with loading message
// Optimized lazy loader - removed unnecessary LoadingFallback call
export const createLazyComponent = (
  importFunc: () => Promise<{ default: React.ComponentType<any> }>,
  loadingMessage = 'Loading...'
) => {
  return React.lazy(importFunc); // Simplified - let Suspense handle the loading
};

// Public routes
export const publicRoutes: RouteConfig[] = [
  {
    path: '/',
    component: createLazyComponent(() => import('@/pages/Home/home'), 'Loading homepage...'),
    layout: 'none'
  },
  {
    path: '/login',
    component: createLazyComponent(() => import('@/pages/auth/login/login'), 'Loading login page...'),
    layout: 'none'
  },
  {
    path: '/register',
    component: createLazyComponent(() => import('@/pages/auth/Register/register'), 'Loading registration form...'),
    layout: 'none'
  },
  {
    path: '/forgot-password',
    component: createLazyComponent(() => import('@/pages/auth/forgotpassword/forgotPassword')),
    layout: 'none'
  },
  {
    path: '/create-password',
    component: createLazyComponent(() => import('@/pages/auth/createPassword/createPassword')),
    layout: 'none'
  },
  {
    path: '/login-success',
    component: createLazyComponent(() => import('@/templates/ExploreTemplate')),
    layout: 'none'
  },
  {
    path: '/register-success',
    component: createLazyComponent(() => import('@/templates/Registration')),
    layout: 'none'
  },
  {
    path: '/email-confirmation',
    component: createLazyComponent(() => import('@/templates/emailConfirmation')),
    layout: 'none'
  },
  {
    path: '/email-sent',
    component: createLazyComponent(() => import('@/templates/emailConfirmation')),
    layout: 'none'
  },
  {
    path: '/reset-password-success',
    component: createLazyComponent(() => import('@/templates/ResetPassword')),
    layout: 'none'
  },
  
];

// Protected routes with sidebar layout
export const protectedRoutes: RouteConfig[] = [
  {
    path: '/user-configuration',
    component: createLazyComponent(() => import('@/pages/userConfigurationSettings/userConfigurationSettings'), 'Loading user settings...'),
    protected: true,
    layout: 'sidebar'
  },
  {
    path: '/machine',
    component: createLazyComponent(() => import('@/pages/dashboard/PreviewOfSelectedModel'), 'Loading preview...'),
    protected: true,
    layout: 'sidebar'
  },
  {
    path: '/surface',
    component: createLazyComponent(() => import('@/pages/dashboard/PreviewOfSelectedModel/SurfaceTreatmentData'), 'Loading surface treatment form...'),
    protected: true,
    layout: 'sidebar'
  },
  {
    path: '/material',
    component: createLazyComponent(() => import('@/pages/dashboard/PreviewOfSelectedModel/metirialform'), 'Loading material data form...'),
    protected: true,
    layout: 'sidebar'
  },
  {
    path: '/material-group',
    component: createLazyComponent(() => import('@/pages/dashboard/PreviewOfSelectedModel/MetirialGroupData'), 'Loading material group form...'),
    protected: true,
    layout: 'sidebar'
  },
  {
    path: '/dashboard',
    component: createLazyComponent(() => import('@/pages/dashboard/dashboard/dashboard')),
    protected: true,
    layout: 'sidebar'
  },
  {
    path: '/profile',
    component: createLazyComponent(() => import('@/pages/profile/profile'), 'Loading profile page...'), 
    layout: 'none'
  }
];

// Admin routes
export const adminRoutes: RouteConfig[] = [
  {
    path: 'admin-dashboard',
    component: createLazyComponent(() => import('@/pages/dashboard/admin/dashboard/dashboard'), 'Loading admin dashboard...'),
    protected: true,
    layout: 'sidebar',
    isAdmin: true
  },
  {
    path: 'user-managemnet',
    component: createLazyComponent(() => import('@/pages/dashboard/admin/UserManagement/userManagement'), 'Loading user management...'),
    protected: true,
    layout: 'sidebar',
    isAdmin: true
  },
  {
    path: 'company-management',
    component: createLazyComponent(() => import('@/pages/dashboard/admin/Company/companyManagement'), 'Loading user management...'),
    protected: true,
    layout: 'sidebar',
    isAdmin: true
  },
  {
    path: 'product-management',
    component: createLazyComponent(() => import('@/pages/dashboard/admin/Product/productManagement'), 'Loading product management...'),
    protected: true,
    layout: 'sidebar',
    isAdmin: true
  },
  {
    path: 'reports-analytics',
    component: createLazyComponent(() => import('@/pages/dashboard/admin/ReportsAnalytics/reportAnalysis'), 'Loading reports and analytics...'),
    protected: true,
    layout: 'sidebar',
    isAdmin: true
  },
  {
    path: 'customer-transactions',
    component: createLazyComponent(() => import('@/pages/dashboard/admin/CustomerTransactions/customerTransaction'), 'Loading customer transactions...'),
    protected: true,
    layout: 'sidebar',
    isAdmin: true
  },
  {
    path: 'configuration-setting',
    component: createLazyComponent(() => import('@/pages/dashboard/admin/ConfigurationSetting/configurationSetting'), 'Loading configuration settings...'),
    protected: true,
    layout: 'sidebar',
    isAdmin: true
  },
  {
    path: 'notifications',
    component: createLazyComponent(() => import('@/pages/dashboard/admin/Notifications/notification'), 'Loading notifications...'),
    protected: true,
    layout: 'sidebar',
    isAdmin: true
  },
  {
    path: 'subscription-management',
    component: createLazyComponent(() => import('@/pages/dashboard/admin/SubscriptionManagement/subscriptionManagement'), 'Loading subscription management...'),
    protected: true,
    layout: 'sidebar',
    isAdmin: true
  },
  {
    path: 'user-configuration',
    component: createLazyComponent(() => import('@/pages/userConfigurationSettings/userConfigurationSettings'), 'Loading user settings...'),
    protected: true,
    layout: 'sidebar',
    isAdmin: true
  },
  {
    path: 'machine',
    component: createLazyComponent(() => import('@/pages/dashboard/PreviewOfSelectedModel'), 'Loading preview...'),
    protected: true,
    layout: 'sidebar',
    isAdmin: true
  },
  {
    path: 'surface',
    component: createLazyComponent(() => import('@/pages/dashboard/PreviewOfSelectedModel/SurfaceTreatmentData'), 'Loading surface treatment form...'),
    protected: true,
    layout: 'sidebar',
    isAdmin: true
  },
  {
    path: 'material',
    component: createLazyComponent(() => import('@/pages/dashboard/PreviewOfSelectedModel/metirialform'), 'Loading material data form...'),
    protected: true,
    layout: 'sidebar',
    isAdmin: true
  },
  {
    path: 'material-group',
    component: createLazyComponent(() => import('@/pages/dashboard/PreviewOfSelectedModel/MetirialGroupData'), 'Loading material group form...'),
    protected: true,
    layout: 'sidebar',
    isAdmin: true
  },
];