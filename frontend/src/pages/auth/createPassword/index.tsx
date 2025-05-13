import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Typography, Link, Box } from "@mui/material";
import { useDispatch } from "react-redux";
import AuthComponent from "../../../pages/auth/index";
import Password from "../../../assets/images/Password.png";
import CustomButton from "../../../components/common/Button";
import CustomInput from "../../../components/common/CustomInput";
import { TfiLock } from "react-icons/tfi";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { toast } from "react-toastify";
import { resetPassword } from "../../../redux/features/authSlice";

const CreatePassword = () => {
  const dispatch = useDispatch();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({
    newPassword: "",
    confirmPassword: "",
    general: "",
  });
  const navigate = useNavigate();
  const location = useLocation();
  const email = location?.state;

  const validateForm = () => {
    let tempErrors = {
      newPassword: "",
      confirmPassword: "",
      general: "",
    };
    let isValid = true;

    // New Password validation
    if (!newPassword) {
      tempErrors.newPassword = "New password is required";
      isValid = false;
    } else if (newPassword.length < 8) {
      tempErrors.newPassword = "Password must be at least 8 characters long";
      isValid = false;
    }

    // Confirm Password validation
    if (!confirmPassword) {
      tempErrors.confirmPassword = "Confirm password is required";
      isValid = false;
    } else if (confirmPassword !== newPassword) {
      tempErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const userData = { email: email?.email, newPassword };
      const response = await dispatch(resetPassword(userData)).unwrap();

      toast.success(response?.message || "Password Reset Successfully!");
      navigate("/login");
    } catch (error: any) {
      toast.error(error?.message || "Password Reset failed!");
      setErrors({
        ...errors,
        general: error?.message || "An error occurred. Please try again.",
      });
    }
  };

  return (
    <AuthComponent
      image={Password}
      title="Create New Password"
      description="Please enter your new password. Your new password must be different from previous passwords."
    >
      <Container
        maxWidth="sm"
        sx={{ maxWidth: { sm: "sm", md: "xs", lg: "xs" } }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            mt: 3,
            gap: 2,
          }}
        >
          <CustomInput
            type="password"
            label="New Password"
            placeholder="********************"
            icon={<TfiLock />}
            value={newPassword}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNewPassword(e.target.value)
            }
            error={!!errors.newPassword}
            helperText={errors.newPassword}
          />
          <CustomInput
            type="password"
            label="Confirm New Password"
            placeholder="********************"
            icon={<TfiLock />}
            value={confirmPassword}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setConfirmPassword(e.target.value)
            }
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
          />

          {errors.general && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                color: "#FF3B3B",
                mt: 1,
                fontSize: "14px",
              }}
            >
              <ErrorOutlineIcon sx={{ fontSize: 16 }} />
              {errors.general}
            </Box>
          )}

          <Box sx={{ mt: 3 }}>
            <CustomButton
              text="Change Password"
              color="#0591FC"
              width="100%"
              height="60px"
              padding="15px"
              borderRadius="12px"
              textColor="#FFFFFF"
              onClick={handleSubmit}
              type="submit"
            />
          </Box>
        </Box>
      </Container>
    </AuthComponent>
  );
};

export default CreatePassword;