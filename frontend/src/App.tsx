import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { validateToken } from '@/utils/utils';
import "react-toastify/dist/ReactToastify.css";
import LoadingFallback from '@/components/loadingFallback';
import ErrorBoundary from '@/utils/errorBoundary';
import ToastMessage from '@/components/customToast';
import AppRoutes from '@/routes/appRoutes';

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
        <AppRoutes />
      </Router>
      <ToastMessage />
    </ErrorBoundary>
  );
};

export default App;