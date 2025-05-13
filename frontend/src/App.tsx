import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { validateToken } from './utils/utils';
import SidebarLayout from './components/sidebarLayout';
import ProtectedRoute from './routes/protectedRoute/index';
import "react-toastify/dist/ReactToastify.css";
import LoadingFallback from './components/LoadingFallback';
import ErrorBoundary from './utils/ErrorBoundary';
import useLazyComponent from './hooks/useLazyComponent';
import ToastMessage from './components/common/Snackbar';
// import ENSLanguageResolver from './components/others/ENSLanguageResolver';

// Lazy loaded components with custom loading messages
const Home = useLazyComponent(() => import('./pages/Home'), {
  loadingMessage: 'Loading homepage...'
});

const Register = useLazyComponent(() => import('./pages/auth/Register'), {
  loadingMessage: 'Loading registration form...',
  errorRedirectPath: '/'
});

const Login = useLazyComponent(() => import('./pages/auth/login'), {
  loadingMessage: 'Loading login page...',
  // errorRedirectPath: '/'
});

const Dashboard = useLazyComponent(() => import('./pages/dashboard'), {
  loadingMessage: 'Loading dashboard...',
  routeName: 'Dashboard'
});

const UserConfigurationSettings = useLazyComponent(
  () => import('./pages/userConfigurationSettings/index'),
  { loadingMessage: 'Loading user settings...' }
);

const EmailConfirmation = useLazyComponent(
  () => import("./templates/emailConfirmation")
);

const ForgotPassword = useLazyComponent(
  () => import('./pages/auth/forgotpassword')
);

const CreatePassword = useLazyComponent(
  () => import("./pages/auth/createPassword")
);

const ExploreTemplate = useLazyComponent(
  () => import('./templates/ExploreTemplate')
);

const ResetPassword = useLazyComponent(
  () => import('./templates/ResetPassword')
);

const Registration = useLazyComponent(
  () => import('./templates/Registration')
);

const Preview = useLazyComponent(
  () => import('./pages/dashboard/PreviewOfSelectedModel'),
  { loadingMessage: 'Loading preview...' }
);

const UserAccount = useLazyComponent(
  () => import('./components/useraccount'),
  { loadingMessage: 'Loading account information...' }
);

const SurfaceTreatmentForm = useLazyComponent(
  () => import('./pages/dashboard/PreviewOfSelectedModel/SurfaceTreatmentData'),
  { loadingMessage: 'Loading surface treatment form...' }
);

const MaterialDataForm = useLazyComponent(
  () => import('./pages/dashboard/PreviewOfSelectedModel/metirialform'),
  { loadingMessage: 'Loading material data form...' }
);

const MaterialGroupForm = useLazyComponent(
  () => import('./pages/dashboard/PreviewOfSelectedModel/MetirialGroupData'),
  { loadingMessage: 'Loading material group form...' }
);

const SelectProcessingData = useLazyComponent(
  () => import('./pages/dashboard/SelectProcessingData')
);

// Admin components
const AdminDashboard = useLazyComponent(
  () => import('./pages/dashboard/admin/dashboard/index'),
  { loadingMessage: 'Loading admin dashboard...' }
);

const UserManagement = useLazyComponent(
  () => import('./pages/dashboard/admin/UserManagement/index'),
  { loadingMessage: 'Loading user management...' }
);

const ReportsAnalytics = useLazyComponent(
  () => import('./pages/dashboard/admin/ReportsAnalytics/index'),
  { loadingMessage: 'Loading reports and analytics...' }
);

const CustomerTransactions = useLazyComponent(
  () => import('./pages/dashboard/admin/CustomerTransactions/index'),
  { loadingMessage: 'Loading customer transactions...' }
);

const ConfigurationSetting = useLazyComponent(
  () => import('./pages/dashboard/admin/ConfigurationSetting/index'),
  { loadingMessage: 'Loading configuration settings...' }
);

const Notifications = useLazyComponent(
  () => import('./pages/dashboard/admin/Notifications/index'),
  { loadingMessage: 'Loading notifications...' }
);

const SubscriptionManagement = useLazyComponent(
  () => import('./pages/dashboard/admin/SubscriptionManagement/index'),
  { loadingMessage: 'Loading subscription management...' }
);

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    setIsAuthenticated(validateToken(token));
  }, []);

  if (isAuthenticated === null) {
    return <LoadingFallback message="Initializing application..." />;
  }

  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/" element={<SidebarLayout />}>
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard1" element={<Dashboard />} />
              <Route path="/user-configuration" element={<UserConfigurationSettings />} />
              <Route path="/machine" element={<Preview />} />
              <Route path="/surface" element={<SurfaceTreatmentForm />} />
              <Route path="/material" element={<MaterialDataForm />} />
              <Route path="/material-group" element={<MaterialGroupForm />} />
              <Route path="/account-page" element={<UserAccount />} />
              <Route path="/dashboard" element={<SelectProcessingData />} />
            </Route>
          </Route>
          <Route path="/admin/" element={<SidebarLayout />}>
            <Route element={<ProtectedRoute />}>
              <Route path="admin-dashboard" element={<AdminDashboard />} />
              <Route path="user-managemnet" element={<UserManagement />} />
              <Route path="reports-analytics" element={<ReportsAnalytics />} />
              <Route path="customer-transactions" element={<CustomerTransactions />} />
              <Route path="configuration-setting" element={<ConfigurationSetting />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="subscription-management" element={<SubscriptionManagement />} />
            </Route>
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/create-password" element={<CreatePassword />} />
          <Route path="/login-success" element={<ExploreTemplate />} />
          <Route path="/register-success" element={<Registration />} />
          <Route path="/email-confirmation" element={<EmailConfirmation />} />
          <Route path="/email-sent" element={<EmailConfirmation />} />
          <Route path="/reset-password-success" element={<ResetPassword />} />
        </Routes>
      </Router>
      <ToastMessage />
      {/* <ENSLanguageResolver ensName="example.eth" /> */}
    </ErrorBoundary>
  );
};

export default App;