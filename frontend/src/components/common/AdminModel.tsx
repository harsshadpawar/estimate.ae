import React, { useEffect, useState } from "react";
import {
    Drawer,
    Box,
    Typography,
    IconButton,
    Divider,
    styled,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Logoo from "../../Assets/images/Logoo.png";

interface DrawerModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    width?: number | string;
    anchor?: "right" | "left" | "top" | "bottom";
    actions?: React.ReactNode;
}

const StyledLogoButton = styled(IconButton)(({ theme, width }) => ({
    position: "fixed",
    top: theme.spacing(3),
    right: width, // Adjust to match drawer width (when anchor="right")
    zIndex: 1301, // MUI drawer zIndex is 1200+, ensure it's above
    backgroundColor: "#fff",
    border: "1px solid #d1d5db",
    borderTopLeftRadius: "9999px",
    borderBottomLeftRadius: "9999px",
    padding: theme.spacing(1),
    boxShadow: theme.shadows[2],
    "&:hover": {
        color: "#374151",
    },
    color: "#6b7280",

}));
// Inside your component file or in a separate CSS module
const StyledLogo = styled("img")({
    height: 24,
    width: 24,
    margin: "0 8px",
    animation: "spin 2s linear infinite", // Spin continuously
    "@keyframes spin": {
        "0%": { transform: "rotate(0deg)" },
        "100%": { transform: "rotate(360deg)" },
    },
});


const DrawerModal: React.FC<DrawerModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    width = 600,
    anchor = "right",
    actions,
}) => {
    const [showLogoButton, setShowLogoButton] = useState(false);
    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
                setShowLogoButton(true);
            }, 250); // Show logo button after 1 second

            return () => clearTimeout(timer); // Clean up timer if component unmounts
        } else {
            setShowLogoButton(false); // Hide button if drawer is closed
        }
    }, [isOpen]);
    return (
        <>
            {/* Floating logo button (outside the drawer) */}
            {isOpen && showLogoButton && (
                // <StyledLogoButton width={width} onClick={onClose}>
                //     <img
                //         src={Logoo}
                //         alt="logo"
                //         style={{ height: 24, width: 24, margin: "0 8px" }}
                //     />
                // </StyledLogoButton>
                <StyledLogoButton width={width} onClick={onClose}>
                    <StyledLogo src={Logoo} alt="logo" />
                </StyledLogoButton>

            )}

            <Drawer
                anchor={anchor}
                open={isOpen}
                onClose={onClose}
                PaperProps={{
                    sx: {
                        width,
                        borderTopLeftRadius: anchor === "right" ? 12 : 0,
                        borderBottomLeftRadius: anchor === "right" ? 12 : 0,
                        borderTopRightRadius: anchor === "left" ? 12 : 0,
                        borderBottomRightRadius: anchor === "left" ? 12 : 0,
                    },
                }}
            >
                {/* Header */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        background: "#CAE8FF",
                        px: 3,
                        py: 2,
                    }}
                >
                    <Typography variant="h6" fontWeight={600} color="#2c2c2c">
                        {title}
                    </Typography>
                    <IconButton onClick={onClose} sx={{ color: "#666" }}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                <Divider />

                {/* Content */}
                <Box sx={{ p: 3, flexGrow: 1, overflowY: "auto" }}>{children}</Box>

                {/* Actions */}
                {actions && (
                    <>
                        <Divider />
                        <Box
                            sx={{ display: "flex", justifyContent: "end", px: 3, py: 2 }}
                        >
                            {actions}
                        </Box>
                    </>
                )}
            </Drawer>
        </>
    );
};

export default DrawerModal;
