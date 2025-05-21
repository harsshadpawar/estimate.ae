import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Typography, Link, Box } from "@mui/material";
import { useDispatch } from "react-redux";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import AuthComponent from "../index";
import image from "@/assets/images/forgot1.png";
import CustomButton from "@/components/button";
import CustomInput from "@/components/customInput";
import { TfiEmail } from "react-icons/tfi";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { toast } from "react-toastify";
import { Modal } from "@/components/customModal";
import { OTPInput } from "@/components/otpInput";
import { requestResetOtp, verifyOtp } from "@/redux/features/authSlice";
import Loader from "@/components/loader";

// Define validation schema using Yup
const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email is required"),
});

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (values, { setSubmitting }) => {
    setIsLoading(true);
    setGeneralError("");

    try {
      const response = await dispatch(requestResetOtp({ email: values.email })).unwrap();
      toast.success(response?.message || "Reset link sent successfully!");
      setOpenModal(true);
    } catch (error) {
      setGeneralError(error?.message || "Failed to send reset link. Please try again.");
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  const handleComplete = async (completedOtp: string) => {
    try {
      const formValues = await document.querySelector('form')?.getAttribute('data-email');
      const email = formValues || "";
      const response = await dispatch(verifyOtp({ email, otp_code: completedOtp, purpose: "forgot_password" })).unwrap();
      navigate("/create-password", { state: { otp_code: completedOtp, email } });
    } catch (error: any) {
      setGeneralError(error?.message || "OTP verification failed. Please try again.");
    }
  };

  return (
    <AuthComponent
      image={image}
      title="Forget Password?"
      description="Please enter the email address you'd like your password reset info sent to:"
      heights={true}
    >
      {isLoading && <Loader loading={isLoading} />}
      
      <Container maxWidth="xs">
        <Formik
          initialValues={{ email: "" }}
          validationSchema={ForgotPasswordSchema}
          onSubmit={handleSubmit}
          validateOnBlur={true}
          validateOnChange={true}
        >
          {({ isSubmitting, errors, touched, values, handleChange, handleSubmit }) => (
            <Form data-email={values.email}>
              <Box
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
                  value={values.email}
                  onChange={handleChange}
                  error={touched.email && !!errors.email}
                  helperText={touched.email && errors.email}
                  name="email"
                />

                {generalError && (
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
                    {generalError}
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
                  type="submit"
                  disabled={isSubmitting}
                />
              </Box>
            </Form>
          )}
        </Formik>
      </Container>
      
      <Modal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        title="OTP"
        width="40%"
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