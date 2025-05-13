import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { TfiReload } from "react-icons/tfi";

const Captcha = ({ onCaptchaChange,value }: { onCaptchaChange: (value: string) => void,value:any }) => {
    const [captcha, setCaptcha] = useState();
    useEffect(() => {
        generateCaptcha()
    }, [])
    const refreshCaptcha = () => {
        const newCaptcha = generateCaptcha();
        onCaptchaChange(newCaptcha);
    };

    const generateCaptcha = () => {
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let result = "";
        for (let i = 0; i < 6; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        setCaptcha(result)
        return result;

    };

    return (
        <div style={{ display: "flex", alignItems: "center" }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "#E7F3FF", borderRadius: "8px", width: "150px", height: "50px", position: "relative", overflow: "hidden" }}>
                <Typography sx={{ fontSize: "18px", fontWeight: "bold", color: "#000" }}>
                    {value}
                </Typography>
            </Box>
        </div>
    );
};

export default Captcha;
