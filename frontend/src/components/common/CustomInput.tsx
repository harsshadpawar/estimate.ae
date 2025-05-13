import React, { useState } from "react";
import { TextField, InputAdornment, IconButton, Box, Typography } from "@mui/material";
import { CiLock } from "react-icons/ci";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

interface CustomInputProps {
  type: "withIcon" | "password";
  label?: string;
  icon?: React.ReactNode;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: boolean;
  helperText?: string;
}

function CustomInput({
  type,
  label,
  icon,
  placeholder,
  value,
  onChange,
  error,
  helperText
}: CustomInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((prev) => !prev);

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
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        type={type === "password" && !showPassword ? "password" : "text"}
        error={error}
        helperText={helperText}
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor: error ? '#FFF1F1' : 'transparent',
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
      />
      {/* {error && helperText && (
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1, 
          color: '#FF3B3B',
          mt: 1,
          fontSize: '14px'
        }}>
          <ErrorOutlineIcon sx={{ fontSize: 16 }} />
          {helperText}
        </Box>
      )} */}
    </Box>
  );
}

export default CustomInput;
