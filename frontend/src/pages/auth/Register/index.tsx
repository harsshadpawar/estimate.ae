import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    Container,
    Typography,
    Link,
    Box,
} from "@mui/material";
import AuthComponent from "../index";
import image from "../../../assets/images/register1.png";
import CustomButton from "../../../components/common/Button";
import DividerWithText from "../../../components/common/Divider";
import SocialButton from "../../../components/common/SocialButton";
import CustomInput from "../../../components/common/CustomInput";
import { TfiEmail, TfiReload } from "react-icons/tfi";
import InputWithDropdown from "../../../components/common/InputWithDropdown";
import { LuUser } from "react-icons/lu";
import { TbBuildingSkyscraper } from "react-icons/tb";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { Modal } from "../../../components/common/CustomModal";
import { OTPInput } from "../../../components/common/OtpInput";
import Captcha from "./captcha";
import { useDispatch } from "react-redux";
import { register, verifyOtp } from "../../../redux/features/authSlice";

const Register = () => {
    const dispatch = useDispatch();


    const titleOptions = ["Mr.", "Mrs.", "Dr.", "Prof."];
    const [title, setTitle] = useState("");
    const [first_name, setfirst_name] = useState("");
    const [last_name, setlast_name] = useState("");
    const [company_name, setcompany_Name] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [openModal, setOpenModal] = useState(false)
    const [errors, setErrors] = useState({
        title: "",
        first_name: "",
        last_name: "",
        company_name: "",
        email: "",
        password: "",
        confirmPassword: "",
        general: "",
        captcha: ""
    });
    const navigate = useNavigate();
    const location = useLocation();
    const [captchaInput, setCaptchaInput] = useState("");
    const [generatedCaptcha, setGeneratedCaptcha] = useState("");

    useEffect(() => {
        // Generate a new CAPTCHA when the component mounts
        generateCaptcha();
    }, []);

    const generateCaptcha = () => {
        // Function to generate a random CAPTCHA string (for simplicity, you can customize it)
        const randomCaptcha = Math.random().toString(36).substring(2, 8).toUpperCase();
        setGeneratedCaptcha(randomCaptcha);
    };

    const handleCaptchaChange = (value) => {
        setGeneratedCaptcha(value);
    };

    const handleCaptchaReload = () => {
        generateCaptcha(); // Regenerate the CAPTCHA
        setCaptchaInput(''); // Clear the current CAPTCHA input
    };

    const validateCaptcha = () => {
        return captchaInput === generatedCaptcha;
    };
    const handleButtonClick = () => {
        alert("Register button clicked!");
    };

    const validateForm = () => {
        let tempErrors = {
            title: "",
            first_name: "",
            last_name: "",
            company_name: "",
            email: "",
            password: "",
            confirmPassword: "",
            general: "",
            captcha: ""
        };
        let isValid = true;

        // Title validation
        if (!title) {
            tempErrors.title = "Title is required";
            isValid = false;
        }

        // First Name validation
        if (!first_name) {
            tempErrors.first_name = "First Name is required";
            isValid = false;
        }

        // Last Name validation
        if (!last_name) {
            tempErrors.last_name = "Last Name is required";
            isValid = false;
        }

        // Company Name validation
        if (!company_name) {
            tempErrors.company_name = "Company Name is required";
            isValid = false;
        }

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
        } else if (password.length < 8) {
            tempErrors.password = "Password must be at least 8 characters long";
            isValid = false;
        }

        // Confirm Password validation
        if (!confirmPassword) {
            tempErrors.confirmPassword = "Confirm Password is required";
            isValid = false;
        } else if (password !== confirmPassword) {
            tempErrors.confirmPassword = "Passwords do not match";
            isValid = false;
        }
        if (captchaInput !== generatedCaptcha) {
            tempErrors.captcha = "Captcha do not match";
            isValid = false;
        }

        setErrors(tempErrors);
        return isValid;
    };

    const handleComplete = (completedOtp: any) => {
        dispatch(verifyOtp({ email, otp: completedOtp }));
        setOpenModal(false)
        navigate("/login");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const userData = {
            title,
            first_name,
            last_name,
            company_name,
            email,
            password,
        };

        dispatch(register(userData));
        setOpenModal(true)
    };
    return (
        <AuthComponent
            image={image}
            title="Create an account"
            description="Start your journey by setting up a profile that suits your needs. "
        >
            <Container sx={{ mx: 2 }}>
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
                    <InputWithDropdown
                        label="Title"
                        options={titleOptions}
                        value={title}
                        onChange={setTitle}
                        error={!!errors.title}
                        helperText={errors.title}
                    />

                    <Box display="flex" flexWrap="wrap" gap={2}>
                        <Box flex="1 1 45%">
                            <CustomInput
                                type="withIcon"
                                label="First Name"
                                placeholder="Enter Your First Name"
                                icon={<LuUser />}
                                value={first_name}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setfirst_name(e.target.value)
                                }
                                error={!!errors.first_name}
                                helperText={errors.first_name}
                            />
                        </Box>
                        <Box flex="1 1 45%">
                            <CustomInput
                                type="withIcon"
                                label="Last Name"
                                placeholder="Enter Your Last Name"
                                icon={<LuUser />}
                                value={last_name}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setlast_name(e.target.value)
                                }
                                error={!!errors.last_name}
                                helperText={errors.last_name}
                            />
                        </Box>
                    </Box>

                    <Box display="flex" flexWrap="wrap" gap={2}>
                        <Box flex="1 1 45%">
                            <CustomInput
                                type="withIcon"
                                label="Company Name"
                                placeholder="Enter Company Name"
                                icon={<TbBuildingSkyscraper />}
                                value={company_name}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setcompany_Name(e.target.value)
                                }
                                error={!!errors.company_name}
                                helperText={errors.company_name}
                            />
                        </Box>
                        <Box flex="1 1 45%">
                            <CustomInput
                                type="withIcon"
                                label="Email Id"
                                placeholder="Enter your email id"
                                icon={<TfiEmail />}
                                value={email}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setEmail(e.target.value)
                                }
                                error={!!errors.email}
                                helperText={errors.email}
                            />
                        </Box>
                    </Box>

                    <Box display="flex" flexWrap="wrap" gap={2}>
                        <Box flex="1 1 45%">
                            <CustomInput
                                type="password"
                                label="Password"
                                placeholder="**************"
                                value={password}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setPassword(e.target.value)
                                }
                                error={!!errors.password}
                                helperText={errors.password}
                            />
                        </Box>
                        <Box flex="1 1 45%">
                            <CustomInput
                                type="password"
                                label="Confirm Password"
                                placeholder="**************"
                                value={confirmPassword}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setConfirmPassword(e.target.value)
                                }
                                error={!!errors.confirmPassword}
                                helperText={errors.confirmPassword}
                            />
                        </Box>
                    </Box>

                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1, alignItems: "flex-start", mt: 2 }}>
                        <Typography sx={{ fontSize: "14px", fontWeight: 500, color: "#000" }}>
                            Please input the symbols from the CAPTCHA*
                        </Typography>

                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5, mt: 1 }}>
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "#E7F3FF", borderRadius: "8px", width: "150px", height: "50px", position: "relative", overflow: "hidden", px: 5 }}>
                                <Captcha onCaptchaChange={handleCaptchaChange} value={generatedCaptcha} />
                                <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'absolute', right: '5px', cursor: 'pointer', color: 'blue', mr: 2 }} onClick={handleCaptchaReload}>
                                    <TfiReload />
                                </Box>
                            </Box>
                            <CustomInput
                                placeholder="Enter the text in the Image"
                                value={captchaInput}
                                onChange={(e) => setCaptchaInput(e.target.value)}
                                error={!!errors.captcha}
                                helperText={errors.captcha}
                            />
                        </Box>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                        <input type="checkbox" style={{ margin: 0 }} />
                        <Typography variant="body2" color="text.primary">
                            Agree to{" "}
                            <Link href="/terms-and-privacy" color="primary" underline="hover">
                                Terms and Privacy Policy
                            </Link>
                        </Typography>
                    </Box>

                    {errors.general && (
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            color: '#FF3B3B',
                            mt: 1,
                            fontSize: '14px'
                        }}>
                            <ErrorOutlineIcon sx={{ fontSize: 16 }} />
                            {errors.general}
                        </Box>
                    )}

                    <CustomButton
                        text="Register Now"
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

                <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                    Already have an account?{" "}
                    <Link href="/login" color="primary" underline="hover">
                        Login
                    </Link>
                </Typography>
            </Container>
            <Modal
                isOpen={openModal}
                onClose={() => setOpenModal(false)}
                title="OTP"
                width="sm"
            >
                <Box sx={{ pb: 5 }}>
                    <Typography variant="h6" sx={{ textAlign: 'center', pb: 2 }}>Enter your 6-digit OTP</Typography>
                    <OTPInput length={6} onComplete={handleComplete} />
                </Box>
            </Modal>
        </AuthComponent>
    );
};

export default Register;



