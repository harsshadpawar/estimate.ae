import React from 'react';
import ErrorBoundary from './errorBoundary';
import { Navigate } from 'react-router-dom';
import { Button, Box, Typography, Paper } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

interface RouteErrorBoundaryProps {
  children: React.ReactNode;
  redirectPath?: string;
  showHome?: boolean;
  routeName?: string;
}

const RouteErrorBoundary: React.FC<RouteErrorBoundaryProps> = ({
  children,
  redirectPath,
  showHome = true,
  routeName = 'this page'
}) => {
  const handleNavigateHome = () => {
    window.location.href = '/';
  };

  const ErrorFallback = () => (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="80vh"
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          maxWidth: 500,
          textAlign: 'center',
          borderRadius: 2
        }}
      >
        <ErrorOutlineIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
        <Typography variant="h5" gutterBottom color="error">
          Error Loading {routeName}
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          We encountered a problem while loading this content. Please try again later.
        </Typography>
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
          {redirectPath && (
            <Button
              variant="contained"
              color="primary"
              component={Navigate}
              to={redirectPath}
            >
              Go Back
            </Button>
          )}
          {showHome && (
            <Button
              variant="outlined"
              color="primary"
              onClick={handleNavigateHome}
            >
              Go to Home
            </Button>
          )}
        </Box>
      </Paper>
    </Box>
  );

  return <ErrorBoundary fallback={<ErrorFallback />}>{children}</ErrorBoundary>;
};

export default RouteErrorBoundary;