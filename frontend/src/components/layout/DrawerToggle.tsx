import React from "react";
import { styled } from "@mui/material/styles";
import { IconButton, IconButtonProps } from "@mui/material";
import Logoo from "@/assets/images/Logoo.png";
import { DRAWER_WIDTH } from "@/pages/layout/layout";

// Define props type
interface DrawerToggleProps {
  open: boolean;
  onClick: () => void;
}

// Extend IconButton with custom prop
interface DrawerToggleButtonProps extends IconButtonProps {
  open: boolean;
}

// Styled component with prop filtering
const DrawerToggleButton = styled((props: DrawerToggleButtonProps) => (
  <IconButton {...props} />
))(({ theme, open }) => ({
  position: "fixed",
  top: theme.spacing(3),
  left: open ? DRAWER_WIDTH : 0,
  zIndex: 1301,
  backgroundColor: "#fff",
  border: "1px solid #d1d5db",
  borderRadius: "0 50% 50% 0",
  padding: theme.spacing(1),
  boxShadow: theme.shadows[2],
  color: "#6b7280",
  "&:hover": {
    color: "#374151",
  },
}));

// Logo image style
const LogoImage = styled("img")({
  height: 24,
  width: 24,
  "@keyframes spin": {
    "0%": { transform: "rotate(0deg)" },
    "100%": { transform: "rotate(360deg)" },
  },
});

const DrawerToggle: React.FC<DrawerToggleProps> = ({ open, onClick }) => {
  return (
    <DrawerToggleButton open={open} onClick={onClick}>
      <LogoImage
        src={Logoo}
        alt="logo"
        style={{
          animation: !open ? "spin 2s linear infinite" : "none",
        }}
      />
    </DrawerToggleButton>
  );
};

export default DrawerToggle;
