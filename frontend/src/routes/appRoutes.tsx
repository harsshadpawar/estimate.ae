import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import SidebarLayout from '@/pages/layout/layout';
import ProtectedRoute from './protectedRoute';
import LoadingFallback from '@/components/loadingFallback';
import { publicRoutes, protectedRoutes, adminRoutes } from './routeConfig';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public routes */}
      {publicRoutes.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={
            <Suspense fallback={<LoadingFallback message={route.loadingMessage || 'Loading...'} />}>
              <route.component />
            </Suspense>
          }
        />
      ))}

      {/* Protected routes with sidebar layout */}
      <Route path="/" element={<SidebarLayout />}>
        <Route element={<ProtectedRoute />}>
          {protectedRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                <Suspense fallback={<LoadingFallback message={route.loadingMessage || 'Loading...'} />}>
                  <route.component />
                </Suspense>
              }
            />
          ))}
        </Route>
      </Route>

      {/* Admin routes */}
      <Route path="/admin/" element={<SidebarLayout />}>
        <Route element={<ProtectedRoute />}>
          {adminRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                <Suspense fallback={<LoadingFallback message={route.loadingMessage || 'Loading...'} />}>
                  <route.component />
                </Suspense>
              }
            />
          ))}
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;