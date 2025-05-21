import React from "react";
import { useField } from "formik";
import { Box } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { BsCalendarDate } from "react-icons/bs";

const FormikDatePicker = ({ label, name, ...props }) => {
  const [field, meta, helpers] = useField(name);
  const { setValue } = helpers;
  const isError = meta.touched && !!meta.error;
  
  // Convert string date to dayjs object if it exists
  const dateValue = field.value ? dayjs(field.value) : null;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label={label}
        value={dateValue}
        onChange={(newValue) => {
          // Format the date as YYYY-MM-DD for form submission
          const formattedDate = newValue ? newValue.format("YYYY-MM-DD") : "";
          setValue(formattedDate);
        }}
        slotProps={{
          textField: {
            fullWidth: true,
            error: isError,
            helperText: isError ? meta.error : "",
            InputProps: {
              // Add the calendar icon
              startAdornment: (
                <Box 
                  component="span" 
                  sx={{ 
                    color: isError ? "#FF3B3B" : "#666",
                    marginRight: "8px",
                    display: "flex",
                    alignItems: "center"
                  }}
                >
                  <BsCalendarDate size={18} />
                </Box>
              )
            },
            sx: {
              width: "100%",
              '& .MuiInputBase-root': {
                borderRadius: "8px",
                height: "48px",
                '&.Mui-focused': {
                  boxShadow: "0 0 0 2px rgba(5, 145, 252, 0.2)",
                },
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: isError ? "#FF3B3B" : "#E0E0E0",
              },
              '& .MuiInputBase-input': {
                padding: "14px 14px 14px 0",
              },
              '& .MuiInputLabel-root': {
                color: isError ? "#FF3B3B" : "#666",
                '&.Mui-focused': {
                  color: "#0591FC",
                },
                marginLeft: "28px", // Adjust label position for icon
              },
              '& .MuiInputLabel-shrink': {
                marginLeft: "0", // Reset margin when label shrinks
              },
            },
          },
          popper: {
            sx: {
              '& .MuiPaper-root': {
                boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
                borderRadius: "12px",
                border: "1px solid #E0E0E0",
              },
              '& .MuiPickersDay-root': {
                borderRadius: "50%",
                '&.Mui-selected': {
                  backgroundColor: "#0591FC",
                  color: "#fff",
                  '&:hover': {
                    backgroundColor: "#0479d1",
                  },
                },
                '&:hover': {
                  backgroundColor: "rgba(5, 145, 252, 0.1)",
                },
              },
              '& .MuiDayCalendar-weekDayLabel': {
                color: "#666",
                fontWeight: "bold",
              },
              '& .MuiPickersCalendarHeader-root': {
                '& .MuiIconButton-root': {
                  borderRadius: "50%",
                  padding: "8px",
                  backgroundColor: "#f5f5f5",
                },
              },
              // Current day highlighting
              '& .MuiPickersDay-today': {
                border: "1px solid #0591FC",
                color: "#0591FC",
              },
            },
          },
        }}
        format="DD/MM/YYYY"
        {...props}
      />
    </LocalizationProvider>
  );
};

export default FormikDatePicker;