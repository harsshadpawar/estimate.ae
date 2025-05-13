import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    Container,
    Typography,
    Link,
    Box,
} from "@mui/material";
import AuthComponent from "../index";
import image from "../../../assets/images/login-1.png";
import CustomButton from "../../../components/common/Button";
import DividerWithText from "../../../components/common/Divider";
import SocialButton from "../../../components/common/SocialButton";
import CustomInput from "../../../components/common/CustomInput";
import { TfiEmail } from "react-icons/tfi";
import { MdErrorOutline } from "react-icons/md";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { login } from "../../../redux/features/authSlice";
const Login = () => {
    const dispatch = useDispatch()
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const [errors, setErrors] = useState({
        email: "",
        password: "",
        general: ""
    });
    const validateForm = () => {
        let tempErrors = {
            email: "",
            password: "",
            general: ""
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

        // Password validation
        if (!password) {
            tempErrors.password = "Password is required";
            isValid = false;
        }

        setErrors(tempErrors);
        return isValid;
    };
    useEffect(() => {
    }, [email])
    const handleButtonClick = () => {
        alert("Login button clicked!");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }
        const payload = { email, password }
        try {
            try {
                await dispatch(login(payload)).unwrap()
                    .then((res: any) => {
                        // toast.success('Login Successful');
                        console.log("Login successful:", res);
                        navigate('/dashboard')
                        // if (res?.data?.user_role === 'customer' || res?.data?.user_role === 'user') {
                        //     console.log("Login successful:", res);
                        //     const redirectTo = "/login-success";
                        //     navigate('/login-success');
                        // }
                        // else if (res?.data?.user_role === 'admin') {
                        //     navigate('/admin/admin-dashboard')
                        // }
                    })
                    .catch((error: any) => console.log(error));
            } catch (e) {
                setErrors(
                    {
                        email: '',
                        password: '',
                        general: e?.message || 'Invalid email or password'
                    });
                console.error("error", e);
            }
        } catch (error) {
            console.error("Login Error: ", error);
            setErrors({
                ...errors,
                general: "An error occurred. Please try again."
            });
        }
    };

    return (
        <AuthComponent
            image={image}
            title="Login"
            description="Log in to your account"
        >
            <Container maxWidth="sm" sx={{ maxWidth: { sm: 'sm', md: 'xs', lg: 'xs' }, }} >
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        mt: 3,
                        gap: 2, // Add consistent spacing between form elements
                    }}
                >
                    {/* Email Input */}
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

                    {/* Password Input */}
                    <CustomInput
                        type="password"
                        label="Password"
                        placeholder="**************"
                        value={password}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setPassword(e.target.value)
                        }
                        error={!!errors.password || !!errors.general}
                        helperText={errors.password}
                    />

                    {errors.general && (
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            color: '#FF3B3B',
                            mt: -1,
                            fontSize: '14px'
                        }}>
                            <MdErrorOutline sx={{ fontSize: 16 }} /> <b>Error:</b>
                            {errors.general}
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
                    <CustomButton
                        text="Login"
                        color="#0591FC"
                        width="100%"
                        height="60px"
                        padding="15px"
                        borderRadius="12px"
                        textColor="#FFFFFF"
                        onClick={handleSubmit}
                        type="submit"
                    />

                    {/* Forgot Password Link */}


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

                {/* Footer */}
                <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                    Don’t have an account?{" "}
                    <Link href="/register" color="primary" underline="hover">
                        Sign up now
                    </Link>
                </Typography>
            </Container>
        </AuthComponent>
    );
};

export default Login;
