import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import "react-toastify/dist/ReactToastify.css";
import ToastMessage from '@/components/customToast';
import AppRoutes from '@/routes/appRoutes';
import ErrorBoundary from '@/utils/errorBoundary';

const App: React.FC = () => {
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