import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Container,
    Typography,
    Link,
    Box,
} from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import AuthComponent from "../index";
import image from "@/assets/images/login-1.png";
import CustomButton from "@/components/button";
import DividerWithText from "@/components/divider";
import SocialButton from "@/components/socialButton";
import CustomInput from "@/components/customInput";
import { TfiEmail } from "react-icons/tfi";
import { MdErrorOutline } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile, login } from "@/redux/features/authSlice";
import Loader from "@/components/loader";

// Define validation schema using Yup
const LoginSchema = Yup.object().shape({
    email: Yup.string()
        .email("Please enter a valid email address")
        .required("Email is required"),
    password: Yup.string()
        .required("Password is required")
});

const Login = () => {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [generalError, setGeneralError] = useState("");
    const userdata = useSelector((state: RootState) => state?.auth?.basicUserInfo);

    const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
        setIsLoading(true);
        setGeneralError("");
        console.log("Form submitted with values:", values);

        try {
            const payload = {
                email: values.email,
                password: values.password
            };

            const loginResponse = await dispatch(login(payload)).unwrap();
            console.log("Login successful:", loginResponse);

            const profileResponse = await dispatch(fetchUserProfile()).unwrap();
            const userRole = profileResponse?.data?.role_name;
            console.log("userRole", userRole)

            if (userRole == 'customer' || userRole == 'user') {
                navigate('/dashboard');
            } else if (userRole == 'super-admin' || userRole == 'admin') {
                navigate('/admin/user-managemnet');
                // navigate('/admin/admin-dashboard');
            }
        } catch (error) {
            console.error("Login Error: ", error);
            // Handle API error
            setGeneralError(error?.message || 'Invalid email or password');
        } finally {
            setIsLoading(false);
            setSubmitting(false);
        }
    };

    const handleButtonClick = () => {
        alert("Login button clicked!");
    };

    return (
        <AuthComponent
            image={image}
            title="Login"
            description="Log in to your account"
        >
            {isLoading && <Loader loading={isLoading} />}

            <Container maxWidth="sm" sx={{ maxWidth: { sm: 'sm', md: 'xs', lg: 'xs' } }}>
                <Formik
                    initialValues={{ email: "", password: "" }}
                    validationSchema={LoginSchema}
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
                                {/* Email Input */}
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

                                {/* Password Input */}
                                <CustomInput
                                    type="password"
                                    label="Password"
                                    placeholder="**************"
                                    value={values.password}
                                    onChange={handleChange}
                                    error={touched.password && !!errors.password}
                                    helperText={touched.password && errors.password}
                                    name="password"
                                />

                                {generalError && (
                                    <Box sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        color: '#FF3B3B',
                                        mt: -1,
                                        fontSize: '14px'
                                    }}>
                                        <MdErrorOutline /> <b>Error:</b> {generalError}
                                    </Box>
                                )}

                                <Typography
                                    variant="body2"
                                    color="Primary"
                                    align="right"
                                    sx={{ mb: 2 }}
                                >
                                    <Link href="/forgot-password" color="primary" underline="hover">
                                        Forgot Password?
                                    </Link>
                                </Typography>

                                {/* Login Button */}
                                {/* <button 
                                    type="submit"
                                    style={{ display: 'none' }}
                                    disabled={isSubmitting}
                                >
                                    Submit
                                </button> */}
                                <CustomButton
                                    text="Login"
                                    type="submit"
                                    color="#0591FC"
                                    width="100%"
                                    height="60px"
                                    padding="15px"
                                    borderRadius="12px"
                                    textColor="#FFFFFF"
                                    onClick={() => {
                                        const submitBtn = document.querySelector('button[type="submit"]');
                                        if (submitBtn) submitBtn.click();
                                    }}
                                    disabled={isSubmitting}
                                />

                                {/* Divider */}
                                <DividerWithText />

                                {/* Social Login Button */}
                                <SocialButton
                                    platform="google"
                                    text="Sign in with Google"
                                    color="#CAE8FF4D"
                                    width="100%"
                                    height="59px"
                                    borderRadius="7px"
                                    border="1px solid #33333333"
                                    padding="12px 15px"
                                    gap="15px"
                                    onClick={handleButtonClick}
                                />
                            </Box>
                        </Form>
                    )}
                </Formik>

                {/* Footer */}
                <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                    Don't have an account?{" "}
                    <Link href="/register" color="primary" underline="hover">
                        Sign up now
                    </Link>
                </Typography>
            </Container>
        </AuthComponent>
    );
};

export default Login;