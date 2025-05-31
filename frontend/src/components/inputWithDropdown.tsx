import React from "react";
import { Select, MenuItem, FormControl, InputLabel, Box, Typography } from "@mui/material";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

// Define the type for the props
interface InputWithDropdownProps {
  label: string;
  options: string[]; // Array of options for the dropdown
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  helperText?: string;
}

function InputWithDropdown({
  label,
  options,
  value,
  onChange,
  error,
  helperText,
}: InputWithDropdownProps) {
  return (
    <Box sx={{ minWidth: "100%", margin: "auto", paddingTop: 1 }}>
      {/* Label */}
      <Typography
        sx={{
          fontWeight: '500',
          textAlign: 'left',
          fontFamily: "Inter, sans-serif",
          lineHeight: "18.15px",
          marginBottom: "8px",
          color: "#333333",
          fontSize: "15px",
        }}
      >
        {label}
      </Typography>

      {/* Dropdown */}
      <FormControl fullWidth sx={{ marginTop: 1 }}>
        <InputLabel id="dropdown-label" error={error}>{label}</InputLabel>
        <Select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          label={label}
          error={error}
          sx={{
            height: "55px",
            borderRadius: "7px",
            border: error ? "1px solid #FF3B3B" : "1px solid #33333333",
            padding: "12px 15px",
            backgroundColor: error ? '#FFF1F1' : 'transparent',
          }}
        >
          {options.map((option, index) => (
            <MenuItem key={index} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
        {error && helperText && (
          <Typography color="error" variant="caption" sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ErrorOutlineIcon sx={{ fontSize: 16 }} />
            {helperText}
          </Typography>
        )}
      </FormControl>
    </Box>
  );
}

export default InputWithDropdown;

