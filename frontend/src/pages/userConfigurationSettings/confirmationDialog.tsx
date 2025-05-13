import React from "react";
import { Dialog, DialogTitle, DialogActions, Button } from "@mui/material";

// Define the props type for the component
interface ConfirmationDialogProps {
  open: boolean;
  confirmDialogTest: string;
  onDialogClose: () => void;
  onConfirm: () => void;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  confirmDialogTest,
  onDialogClose,
  onConfirm,
}) => {
  return (
    <Dialog open={open} onClose={onDialogClose}>
      <DialogTitle>{confirmDialogTest}</DialogTitle>
      <DialogActions>
        <Button onClick={onDialogClose}>Cancel</Button>
        <Button onClick={onConfirm}>Confirm</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
