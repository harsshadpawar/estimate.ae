import React from "react";
import { toast, ToastContainer, ToastOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Typography, Box } from "@mui/material";

// Toast types with corresponding Material UI colors
const getToastStyle = (type: "success" | "error" | "info" | "warning") => {
  switch (type) {
    case "success":
      return {
        background: "#E8F5E9",
        color: "#2E7D32",
        border: "1px solid #81C784"
      };
    case "error":
      return {
        background: "#FFEBEE",
        color: "#C62828",
        border: "1px solid #EF5350"
      };
    case "info":
      return {
        background: "#E3F2FD",
        color: "#1565C0",
        border: "1px solid #64B5F6"
      };
    case "warning":
      return {
        background: "#FFF3E0",
        color: "#EF6C00",
        border: "1px solid #FFB74D"
      };
    default:
      return {};
  }
};

// Toast container
export const ToastMessage = () => (
  <ToastContainer
    position="top-right"
    autoClose={5000}
    hideProgressBar={false}
    newestOnTop
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
    toastClassName="mui-toast"
    bodyClassName="mui-toast-body"
  />
);

// Trigger toast with MUI styles
export const triggerToast = (
  message: string,
  type: "success" | "error" | "info" | "warning" = "info",
  duration = 3
) => {
  const toastId = toast(
    <Box display="flex" alignItems="center">
      <Typography variant="body2">{message}</Typography>
    </Box>,
    {
      type,
      style: {
        ...getToastStyle(type),
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        borderRadius: "8px",
        boxShadow:
          "0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)"
      },
    } as ToastOptions
  );

  setTimeout(() => {
    toast.dismiss(toastId);
  }, duration * 1000);

  return toastId;
};

// Dismiss all toasts
export const dismissToast = () => {
  toast.dismiss();
};

export default ToastMessage;
