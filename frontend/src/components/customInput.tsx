import React, { useState } from "react";
import { TextField, InputAdornment, IconButton, Box, Typography } from "@mui/material";
import { CiLock } from "react-icons/ci";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useField } from "formik";

interface CustomInputProps {
  type: "withIcon" | "password";
  label?: string;
  icon?: React.ReactNode;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: boolean;
  helperText?: string;
  name: string; // Required for Formik integration
}

function CustomInput({
  type,
  label,
  icon,
  placeholder,
  value,
  onChange,
  error,
  helperText,
  name,
  ...props
}: CustomInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((prev) => !prev);
  
  // Use Formik's useField hook if available, otherwise fall back to provided props
  const [field, meta] = useField(name);
  
  // Determine if we should use Formik's field props or the directly provided props
  const inputValue = value !== undefined ? value : field.value;
  const handleChange = onChange || field.onChange;
  const handleBlur = field.onBlur;
  const isError = error !== undefined ? error : (meta.touched && !!meta.error);
  const errorMessage = helperText !== undefined ? helperText : (meta.touched && meta.error);

  return (
    <Box sx={{ width: "100%", margin: "auto" }}>
      {label && (
        <Typography
          sx={{
            fontWeight: "500",
            textAlign: "left",
            fontFamily: "Inter, sans-serif",
            lineHeight: "18.15px",
            marginBottom: "8px",
            color: "#333333",
            fontSize: "15px",
          }}
        >
          {label}
        </Typography>
      )}

      <TextField
        variant="outlined"
        fullWidth
        value={inputValue}
        onChange={handleChange}
        onBlur={handleBlur}
        name={name}
        placeholder={placeholder}
        type={type === "password" && !showPassword ? "password" : "text"}
        error={isError}
        helperText={errorMessage}
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor: isError ? '#FFF1F1' : 'transparent',
            '&.Mui-error .MuiOutlinedInput-notchedOutline': {
              borderColor: '#FF3B3B',
            }
          },
          '& .MuiFormHelperText-root': {
            color: '#FF3B3B',
            marginLeft: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              {type === "password" ? <CiLock size={20} /> : icon}
            </InputAdornment>
          ),
          endAdornment: type === "password" ? (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ) : null,
        }}
        {...props}
      />
    </Box>
  );
}

export default CustomInput;