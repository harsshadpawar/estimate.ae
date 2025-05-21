import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    Container,
    Typography,
    Link,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
} from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { Formik, Form, Field, useField } from "formik";
import * as Yup from "yup";
import AuthComponent from "../index";
import image from "@/assets/images/register1.png";
import CustomButton from "@/components/button";
import CustomInput from "@/components/customInput";
import { TfiEmail, TfiReload } from "react-icons/tfi";
import { LuUser } from "react-icons/lu";
import { TbPhone } from "react-icons/tb";
import { MdErrorOutline } from "react-icons/md";
import { Modal } from "@/components/customModal";
import { OTPInput } from "@/components/otpInput";
import Captcha from "./captcha";
import { useDispatch } from "react-redux";
import { register, verifyOtp } from "@/redux/features/authSlice";
import Loader from "@/components/loader";
import FormikDatePicker from "@/components/formikDatePicker"
const today = new Date();
const minDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());

// Define validation schema for Formik
const RegisterSchema = Yup.object().shape({
    first_name: Yup.string().required("First Name is required"),
    last_name: Yup.string().required("Last Name is required"),
    email: Yup.string()
        .email("Please enter a valid email address")
        .required("Email is required"),
    password: Yup.string()
        .min(8, "Password must be at least 8 characters long")
        .required("Password is required"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], "Passwords do not match")
        .required("Confirm Password is required"),
    phone: Yup.string()
        .required("Phone number is required")
        .matches(/^\+?[0-9]{10,15}$/, "Please enter a valid phone number"),
    date_of_birth: Yup.date()
        .required("Date of Birth is required")
        .max(today, "Date of Birth cannot be in the future")
        .max(minDate, "You must be at least 18 years old"),
    gender: Yup.string().required("Please select your gender"),
    captcha: Yup.string()
        .required("CAPTCHA is required")
        .test(
            "match-captcha",
            "CAPTCHA does not match",
            function (value) {
                return value === this.parent.generatedCaptcha;
            }
        ),
    terms: Yup.boolean()
        .oneOf([true], "You must agree to the terms and conditions")
        .required("You must agree to the terms and conditions")
});

// Custom FormikSelect component to handle Material-UI Select with Formik
const FormikSelect = ({ label, name, children, ...props }) => {
    const [field, meta] = useField(name);
    const isError = meta.touched && !!meta.error;

    return (
        <FormControl fullWidth error={isError}>
            <InputLabel id={`${name}-label`}>{label}</InputLabel>
            <Select
                labelId={`${name}-label`}
                label={label}
                {...field}
                {...props}
            >
                {children}
            </Select>
            {isError && <FormHelperText>{meta.error}</FormHelperText>}
        </FormControl>
    );
};


const Register = () => {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [generatedCaptcha, setGeneratedCaptcha] = useState("");
    const [generalError, setGeneralError] = useState("");
    const [email, setEmail] = useState(""); // For OTP verification

    const navigate = useNavigate();

    useEffect(() => {
        // Generate a new CAPTCHA when the component mounts
        generateCaptcha();
    }, []);

    const generateCaptcha = () => {
        // Function to generate a random CAPTCHA string
        const randomCaptcha = Math.random().toString(36).substring(2, 8).toUpperCase();
        setGeneratedCaptcha(randomCaptcha);
    };

    const handleCaptchaChange = (value) => {
        setGeneratedCaptcha(value);
    };

    const handleCaptchaReload = () => {
        generateCaptcha(); // Regenerate the CAPTCHA
    };

    const handleComplete = (completedOtp) => {
        dispatch(verifyOtp({ email, otp_code: completedOtp, purpose: "register" }))
            .then((res) => {
                if (!res.error) {
                    setOpenModal(false);
                    navigate("/login");
                }
            });
    };

    const handleSubmit = async (values, { setSubmitting }) => {
        setIsLoading(true);
        setGeneralError("");
        setEmail(values.email); // Store email for OTP verification

        try {
            const userData = {
                first_name: values.first_name,
                last_name: values.last_name,
                email: values.email,
                password: values.password,
                phone: values.phone,
                date_of_birth: values.date_of_birth,
                gender: values.gender
            };

            const response = await dispatch(register(userData)).unwrap();
            setOpenModal(true);
        } catch (error) {
            setGeneralError(error?.message || "Registration failed. Please try again.");
        } finally {
            setIsLoading(false);
            setSubmitting(false);
        }
    };

    return (
        <AuthComponent
            image={image}
            title="Create an account"
            description="Start your journey by setting up a profile that suits your needs."
        >
            {isLoading && <Loader loading={isLoading} />}

            <Container sx={{ mx: 2 }}>
                <Formik
                    initialValues={{
                        first_name: "",
                        last_name: "",
                        email: "",
                        password: "",
                        confirmPassword: "",
                        phone: "",
                        date_of_birth: "",
                        gender: "",
                        captcha: "",
                        generatedCaptcha: generatedCaptcha,
                        terms: false
                    }}
                    validationSchema={RegisterSchema}
                    onSubmit={handleSubmit}
                    enableReinitialize={true} // Important for captcha validation
                >
                    {({ errors, touched, values, handleChange, handleBlur, isSubmitting, setFieldValue }) => (
                        <Form>
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    mt: 3,
                                    gap: 2,
                                }}
                            >
                                <Box display="flex" flexWrap="wrap" gap={2}>
                                    {/* First Name */}
                                    <Box flex="1 1 45%">
                                        <CustomInput
                                            type="withIcon"
                                            label="First Name*"
                                            placeholder="Enter Your First Name"
                                            icon={<LuUser />}
                                            value={values.first_name}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.first_name && !!errors.first_name}
                                            helperText={touched.first_name && errors.first_name}
                                            name="first_name"
                                        />
                                    </Box>

                                    {/* Last Name */}
                                    <Box flex="1 1 45%">
                                        <CustomInput
                                            type="withIcon"
                                            label="Last Name*"
                                            placeholder="Enter Your Last Name"
                                            icon={<LuUser />}
                                            value={values.last_name}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.last_name && !!errors.last_name}
                                            helperText={touched.last_name && errors.last_name}
                                            name="last_name"
                                        />
                                    </Box>
                                </Box>

                                <Box display="flex" flexWrap="wrap" gap={2}>
                                    {/* Email */}
                                    <Box flex="1 1 45%">
                                        <CustomInput
                                            type="withIcon"
                                            label="Email*"
                                            placeholder="Enter your email"
                                            icon={<TfiEmail />}
                                            value={values.email}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.email && !!errors.email}
                                            helperText={touched.email && errors.email}
                                            name="email"
                                        />
                                    </Box>

                                    {/* Phone */}
                                    <Box flex="1 1 45%">
                                        <CustomInput
                                            type="withIcon"
                                            label="Phone*"
                                            placeholder="Enter your phone number"
                                            icon={<TbPhone />}
                                            value={values.phone}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.phone && !!errors.phone}
                                            helperText={touched.phone && errors.phone}
                                            name="phone"
                                        />
                                    </Box>
                                </Box>

                                <Box display="flex" flexWrap="wrap" gap={2}>
                                    {/* Password */}
                                    <Box flex="1 1 45%">
                                        <CustomInput
                                            type="password"
                                            label="Password*"
                                            placeholder="**************"
                                            value={values.password}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.password && !!errors.password}
                                            helperText={touched.password && errors.password}
                                            name="password"
                                        />
                                    </Box>

                                    {/* Confirm Password */}
                                    <Box flex="1 1 45%">
                                        <CustomInput
                                            type="password"
                                            label="Confirm Password*"
                                            placeholder="**************"
                                            value={values.confirmPassword}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.confirmPassword && !!errors.confirmPassword}
                                            helperText={touched.confirmPassword && errors.confirmPassword}
                                            name="confirmPassword"
                                        />
                                    </Box>
                                </Box>

                                <Box display="flex" flexWrap="wrap" gap={2}>
                                    {/* Date of Birth - New MUI DatePicker */}
                                    <Box flex="1 1 45%">
                                        <FormikDatePicker
                                            name="date_of_birth"
                                            label="Date of Birth*"
                                            disableFuture
                                            maxDate={dayjs(minDate)} // Apply the age restriction (18 years)
                                        />
                                    </Box>

                                    {/* Gender */}
                                    <Box flex="1 1 45%">
                                        <FormikSelect
                                            name="gender"
                                            label="Gender*"
                                        >
                                            <MenuItem value="">Select</MenuItem>
                                            <MenuItem value="male">Male</MenuItem>
                                            <MenuItem value="female">Female</MenuItem>
                                            <MenuItem value="other">Other</MenuItem>
                                            <MenuItem value="prefer_not_to_say">Prefer not to say</MenuItem>
                                        </FormikSelect>
                                    </Box>
                                </Box>

                                {/* CAPTCHA Section */}
                                <Box sx={{ display: "flex", flexDirection: "column", gap: 1, alignItems: "flex-start", mt: 2 }}>
                                    <Typography sx={{ fontSize: "14px", fontWeight: 500, color: "#000" }}>
                                        Please input the symbols from the CAPTCHA*
                                    </Typography>

                                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5, mt: 1 }}>
                                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "#E7F3FF", borderRadius: "8px", width: "150px", height: "50px", position: "relative", overflow: "hidden", px: 5 }}>
                                            <Captcha onCaptchaChange={handleCaptchaChange} value={generatedCaptcha} />
                                            <Box
                                                sx={{
                                                    flex: 1,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    position: 'absolute',
                                                    right: '5px',
                                                    cursor: 'pointer',
                                                    color: 'blue',
                                                    mr: 2
                                                }}
                                                onClick={() => {
                                                    handleCaptchaReload();
                                                    setFieldValue('captcha', '');
                                                    setFieldValue('generatedCaptcha', generatedCaptcha);
                                                }}
                                            >
                                                <TfiReload />
                                            </Box>
                                        </Box>
                                        <CustomInput
                                            placeholder="Enter the text in the Image"
                                            value={values.captcha}
                                            onChange={(e) => {
                                                handleChange(e);
                                                setFieldValue('generatedCaptcha', generatedCaptcha);
                                            }}
                                            onBlur={handleBlur}
                                            error={touched.captcha && !!errors.captcha}
                                            helperText={touched.captcha && errors.captcha}
                                            name="captcha"
                                        />
                                    </Box>
                                </Box>

                                {/* Terms and Conditions */}
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                                    <input
                                        type="checkbox"
                                        name="terms"
                                        checked={values.terms}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        style={{ margin: 0 }}
                                    />
                                    <Typography variant="body2" color="text.primary">
                                        Agree to{" "}
                                        <Link href="/terms-and-privacy" color="primary" underline="hover">
                                            Terms and Privacy Policy
                                        </Link>
                                    </Typography>
                                </Box>
                                {touched.terms && errors.terms && (
                                    <Typography color="error" variant="caption">
                                        {errors.terms}
                                    </Typography>
                                )}

                                {/* General Error Display */}
                                {generalError && (
                                    <Box sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        color: '#FF3B3B',
                                        mt: 1,
                                        fontSize: '14px'
                                    }}>
                                        <MdErrorOutline /> <b>Error:</b> {generalError}
                                    </Box>
                                )}

                                {/* Submit Button */}
                                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <CustomButton
                                        text="Register Now"
                                        color="#0591FC"
                                        width="50%"
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

                <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                    Already have an account?{" "}
                    <Link href="/login" color="primary" underline="hover">
                        Login
                    </Link>
                </Typography>
            </Container>

            {/* OTP Modal */}
            <Modal
                isOpen={openModal}
                onClose={() => setOpenModal(false)}
                title="OTP"
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