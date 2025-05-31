import { ChevronRight } from "@mui/icons-material";
import React from "react";

interface CustomButtonProps {
  text: string;
  color?: string;
  width?: string;
  height?: string;
  padding?: string;
  borderRadius?: string;
  textColor?: string;
  fontSize?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  showArrow?: boolean; // New prop for arrow
}

const CustomButton: React.FC<CustomButtonProps> = ({
  text,
  color = "#0591FC",
  width = "100%",
  height = "60px",
  padding = "15px",
  borderRadius = "12px",
  textColor = "#FFFFFF",
  fontSize = "16px",
  onClick,
  type = "button",
  disabled = false,
  showArrow = false,
}) => {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      style={{
        width,
        height,
        padding,
        background: color,
        borderRadius,
        color: textColor,
        border: "none",
        fontWeight: 600,
        fontSize,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.7 : 1,
        transition: "opacity 0.3s ease",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
      }}
    >
      <span>{text}</span>
      {showArrow && <ChevronRight size={18} color={textColor} />}
    </button>
  );
};

export default CustomButton;