import { Box, Container, Typography } from "@mui/material";
import React from "react";
import LOGO from '../../assets/images/Group 11.png';

interface AuthProps {
    image?: string; // Optional image for flexibility
    children: React.ReactNode;
    title: string;
    description: string;
    heights?:boolean
}

const AuthComponent = ({ image = LOGO, title, description, children ,heights}: AuthProps) => {
    return (
        <Box
            sx={{
                display: "flex",
                bgcolor: "#F1F1F1",
                padding: '10px',
                backgroundColor: "white",
                height: 'auto%', // Full screen height
                // alignItems: "center", // Vertical centering
                // justifyContent: "center", // Horizontal centering
            }}
        >
            {/* Left Side - Image Section */}
            <Box
                sx={{
                    flex: { xs: 0, sm: 6, md: 6, },
                    height:heights? '95vh': null,
                    width:'900px',
                    display: { xs: "none", sm:'none',md: "flex" }, // Use flex to center the image
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "16px", // Corner radius
                    overflow: "hidden", // Ensures the background image respects the border radius
                    backgroundImage: `url(${image})`,
                    backgroundSize: "100% 100%", // Adjust image size
                    // backgroundPosition: "center",
                }}
            />

            {/* Right Side - Content Section */}
            <Box
                sx={{
                    flex: { xs: 12, sm: 6, md: 6 },
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center", // Vertical centering
                    alignItems: "center", // Horizontal centering
                    p: 3,
                    // mx: "auto",
                }}
            >
                {/* Logo */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: 2,
                        mb: 3,
                        width: '336.84px',
                        height: '70px',
                        // img: {
                        //     height: { xs: '70px', sm: '90px', md: '110px' },
                        //     width: { xs: '70px', sm: '90px', md: '110px' }
                        // }
                    }}
                >
                    <img src={LOGO} alt="logo" />
                    {/* <Typography sx={{ color: '#0C55C7', fontWeight: '700', fontSize: { xs: '34px', sm: '36px', md: '44px' }, lineHeight: '53.25px', fontFamily: "Inter, sans-serif", }}>Logo Text</Typography> */}
                </Box>

                {/* Content Container */}
                <Box
                    sx={{
                        width: "100%",
                        textAlign: "center", // Center text horizontally
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: { xs: "25px", sm: "30px", md: "40px" },
                            fontWeight: "700",
                            textAlign: "center",
                            mb: 1,
                        }}
                    >
                        {title}
                    </Typography>
                    <Typography
                        sx={{
                            fontSize: { xs: "14px", sm: "14px", md: "18px" },
                            fontWeight: "400",
                            color: "#6B7280",
                            textAlign: "center",
                            mb: 3,
                        }}
                    >
                        {description}
                    </Typography>
                    {children}
                </Box>
            </Box>
        </Box>
    );
};

export default AuthComponent;
