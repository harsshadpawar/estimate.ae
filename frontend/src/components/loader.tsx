
import React from 'react';
import { Backdrop, CircularProgress } from '@mui/material';

const Loader = ({ loading }:any) => {
  return (
    <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={loading}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default Loader;
