import React from "react";

interface CustomButtonProps {
  text: string;
  color?: string;
  width?: string;
  height?: string;
  padding?: string;
  borderRadius?: string;
  textColor?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  text,
  color = "#0591FC",
  width = "100%",
  height = "60px",
  padding = "15px",
  borderRadius = "12px",
  textColor = "#FFFFFF",
  onClick,
  type = "button",
  disabled = false,
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
        fontSize: "16px",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.7 : 1,
        transition: "opacity 0.3s ease",
      }}
    >
      {text}
    </button>
  );
};

export default CustomButton;