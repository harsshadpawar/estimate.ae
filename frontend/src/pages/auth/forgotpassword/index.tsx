import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Typography, Link, Box } from "@mui/material";
import { useDispatch } from "react-redux";
import AuthComponent from "../../../pages/auth/index";
import image from "../../../assets/images/forgot1.png";
import CustomButton from "../../../components/common/Button";
import CustomInput from "../../../components/common/CustomInput";
import { TfiEmail } from "react-icons/tfi";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { toast } from "react-toastify";
import { Modal } from "../../../components/common/CustomModal";
import { OTPInput } from "../../../components/common/OtpInput";
import { requestResetOtp, verifyOtp } from "../../../redux/features/authSlice";

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState(false);
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    general: "",
  });
  const navigate = useNavigate();
  const location = useLocation();

  const validateForm = () => {
    let tempErrors = {
      email: "",
      general: "",
    };
    let isValid = true;

    // Email validation
    if (!email) {
      tempErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = "Please enter a valid email address";
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
      const response = await dispatch(requestResetOtp({ email })).unwrap();
      toast.success(response?.message || "Reset link sent successfully!");
      setOpenModal(true);
    } catch (error: any) {
      setErrors({
        ...errors,
        general: error?.message || "Failed to send reset link. Please try again.",
      });
    }
  };

  const handleComplete = async (completedOtp: string) => {
    try {
      const response = await dispatch(verifyOtp({ email, otp: completedOtp })).unwrap();
      toast.success(response?.message || "OTP verified successfully!");
      navigate("/create-password", { state: { email } });
    } catch (error: any) {
      setErrors({
        ...errors,
        general: error?.message || "OTP verification failed. Please try again.",
      });
    }
  };

  return (
    <AuthComponent
      image={image}
      title="Forget Password?"
      description="Please enter the email address you'd like your password reset info sent to:"
      heights={true}
    >
      <Container maxWidth="xs">
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
            type="withIcon"
            label="Email Id"
            placeholder="Enter your email id"
            icon={<TfiEmail />}
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
            error={!!errors.email || !!errors.general}
            helperText={errors.email}
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

          <CustomButton
            text="Request Reset Link"
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
      </Container>
      <Modal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        title="OTP"
        width="sm"
      >
        <Box sx={{ pb: 5 }}>
          <Typography variant="h6" sx={{ textAlign: "center", pb: 2 }}>
            Enter your 6-digit OTP
          </Typography>
          <OTPInput length={6} onComplete={handleComplete} />
        </Box>
      </Modal>
    </AuthComponent>
  );
};

export default ForgotPassword;