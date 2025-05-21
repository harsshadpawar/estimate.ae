import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Typography, Box } from "@mui/material";
import { useDispatch } from "react-redux";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import AuthComponent from "../index";
import Password from "@/assets/images/Password.png";
import CustomButton from "@/components/button";
import CustomInput from "@/components/customInput";
import { TfiLock } from "react-icons/tfi";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { toast } from "react-toastify";
import { resetPassword } from "@/redux/features/authSlice";
import Loader from "@/components/loader";

// Define validation schema using Yup
const CreatePasswordSchema = Yup.object().shape({
  newPassword: Yup.string()
    .min(8, "Password must be at least 8 characters long")
    .required("New password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], "Passwords do not match")
    .required("Confirm password is required")
});

const CreatePassword = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { otp_code, email } = location?.state || {};

  const handleSubmit = async (values, { setSubmitting }) => {
    setIsLoading(true);
    setGeneralError("");

    try {
      const userData = { 
        otp_code: otp_code, 
        new_password: values.newPassword,
        email: email
      };
      
      const response = await dispatch(resetPassword(userData)).unwrap();
      navigate("/login");
    } catch (error) {
      setGeneralError(error?.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <AuthComponent
      image={Password}
      title="Create New Password"
      description="Please enter your new password. Your new password must be different from previous passwords."
    >
      {isLoading && <Loader loading={isLoading} />}
      
      <Container
        maxWidth="sm"
        sx={{ maxWidth: { sm: "sm", md: "xs", lg: "xs" } }}
      >
        <Formik
          initialValues={{ newPassword: "", confirmPassword: "" }}
          validationSchema={CreatePasswordSchema}
          onSubmit={handleSubmit}
          validateOnBlur={true}
          validateOnChange={true}
        >
          {({ isSubmitting, errors, touched, values, handleChange }) => (
            <Form>
              <Box
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
                  value={values.newPassword}
                  onChange={handleChange}
                  error={touched.newPassword && !!errors.newPassword}
                  helperText={touched.newPassword && errors.newPassword}
                  name="newPassword"
                />
                
                <CustomInput
                  type="password"
                  label="Confirm New Password"
                  placeholder="********************"
                  icon={<TfiLock />}
                  value={values.confirmPassword}
                  onChange={handleChange}
                  error={touched.confirmPassword && !!errors.confirmPassword}
                  helperText={touched.confirmPassword && errors.confirmPassword}
                  name="confirmPassword"
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

                <Box sx={{ mt: 3 }}>
                  <CustomButton
                    text="Change Password"
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
              </Box>
            </Form>
          )}
        </Formik>
      </Container>
    </AuthComponent>
  );
};

export default CreatePassword;