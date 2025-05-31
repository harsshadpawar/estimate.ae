import React, { memo } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

interface LoadingFallbackProps {
  message?: string;
}

// Memoized component to prevent unnecessary re-renders
const LoadingFallback: React.FC<LoadingFallbackProps> = memo(({ message = 'Loading...' }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="200px"
      width="100%"
      sx={{
        // Use CSS-in-JS for better performance
        '& .MuiCircularProgress-root': {
          marginBottom: 2
        }
      }}
    >
      <CircularProgress size={40} thickness={4} />
      <Typography variant="body1" component="div">
        {message}
      </Typography>
    </Box>
  );
});

LoadingFallback.displayName = 'LoadingFallback';

export default LoadingFallback;