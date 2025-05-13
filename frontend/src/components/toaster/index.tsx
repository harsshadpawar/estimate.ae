import React from 'react';
import { Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

const Toaster = ({ open, onClose, message }) => {
  return (
    <Snackbar open={open} autoHideDuration={4000} onClose={onClose}>
      <MuiAlert onClose={onClose} severity="success" variant="filled">
        {message}
      </MuiAlert>
    </Snackbar>
  );
};

export default Toaster;
