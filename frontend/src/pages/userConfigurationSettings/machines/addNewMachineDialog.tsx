import React, { useEffect, useState } from "react";
import {
  Drawer,
  Box,
  TextField,
  Button,
  MenuItem,
  Typography,
  IconButton,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import { fetchMachineCategories } from "@/redux/features/machines/machinesSlice";

const AddNewMachineDrawer = ({ open, machine, onDrawerClose, onSaveMachine }) => {
  const dispatch = useDispatch();
  const { machineCategories, categoriesStatus } = useSelector((state) => state.machines);
  
  const [newMachine, setNewMachine] = useState({
    name: "",
    abbreviation: "",
    hourly_rate: "",
    working_span: "",
    category: "",
    currency: "$",  // Default currency
  });
  
  const [formErrors, setFormErrors] = useState({});
  
  const isLoading = categoriesStatus === 'loading';

  // Fetch machine categories when drawer opens
  useEffect(() => {
    if (open) {
      dispatch(fetchMachineCategories());
    }
  }, [open, dispatch]);

  // Set machine data if editing
  useEffect(() => {
    if (machine) {
      setNewMachine({
        name: machine.name || "",
        abbreviation: machine.abbreviation || "",
        hourly_rate: machine.hourly_rate || "",
        working_span: machine.working_span || "",
        category: machine.category || "",
        currency: machine.currency || "$",
      });
    } else {
      // Reset form when adding new machine
      setNewMachine({
        name: "",
        abbreviation: "",
        hourly_rate: "",
        working_span: "",
        category: "",
        currency: "$",
      });
    }
    // Reset errors when opening the drawer
    setFormErrors({});
  }, [machine, open]);

  const handleInputChange = (field, value) => {
    setNewMachine((prev) => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear error for the field being changed
    if (formErrors[field]) {
      setFormErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };
  
  const validateForm = () => {
    const errors = {};
    if (!newMachine.name.trim()) {
      errors.name = "Machine name is required";
    }
    if (!newMachine.abbreviation.trim()) {
      errors.abbreviation = "Abbreviation is required";
    }
    if (!newMachine.category) {
      errors.category = "Category is required";
    }
    
    // Validate hourly rate is a number if provided
    if (newMachine.hourly_rate && isNaN(Number(newMachine.hourly_rate))) {
      errors.hourly_rate = "Hourly rate must be a number";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = () => {
    if (validateForm()) {
      // Format the hourly_rate as a number if it's a valid number string
      const formattedMachine = {
        ...newMachine,
        hourly_rate: newMachine.hourly_rate 
          ? Number(newMachine.hourly_rate) 
          : 0
      };
      
      onSaveMachine(formattedMachine);
    }
  };

  return (
    <Drawer
      anchor="right" // Drawer slides in from the right
      open={open}
      onClose={onDrawerClose}
      PaperProps={{
        sx: {
          width: "500px", // Set the width of the drawer
          borderRadius: "12px 0 0 12px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#CAE8FF",
          padding: "16px",
          borderBottom: "1px solid #ddd",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontSize: "18px",
            fontWeight: 600,
            lineHeight: "24px",
          }}
        >
          {machine ? "Edit Machine" : "Add a New Machine"}
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onDrawerClose}
          sx={{
            color: "#666666",
            "&:hover": {
              color: "#333333",
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Content */}
      <Box
        sx={{
          padding: "16px",
          flex: 1,
          overflowY: "auto",
        }}
      >
        {isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="200px">
            <CircularProgress />
          </Box>
        ) : (
          <Box
            display="flex"
            flexDirection="column"
            gap={2}
          >
            <TextField
              label="Machine Name"
              variant="outlined"
              fullWidth
              required
              value={newMachine.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              error={!!formErrors.name}
              helperText={formErrors.name}
            />
            
            <TextField
              label="Abbreviation"
              variant="outlined"
              fullWidth
              required
              value={newMachine.abbreviation}
              onChange={(e) => handleInputChange("abbreviation", e.target.value)}
              error={!!formErrors.abbreviation}
              helperText={formErrors.abbreviation}
            />
            
            <Box display="flex" gap={2}>
              <TextField
                label="Currency"
                variant="outlined"
                select
                fullWidth
                value={newMachine.currency}
                onChange={(e) => handleInputChange("currency", e.target.value)}
              >
                <MenuItem value="$">$ (USD)</MenuItem>
                <MenuItem value="€">€ (EUR)</MenuItem>
                <MenuItem value="£">£ (GBP)</MenuItem>
                <MenuItem value="¥">¥ (JPY/CNY)</MenuItem>
              </TextField>
              
              <TextField
                label="Hourly Rate"
                variant="outlined"
                fullWidth
                value={newMachine.hourly_rate}
                onChange={(e) => handleInputChange("hourly_rate", e.target.value)}
                error={!!formErrors.hourly_rate}
                helperText={formErrors.hourly_rate}
                type="number"
                inputProps={{ min: 0, step: "0.01" }}
              />
            </Box>
            
            <TextField
              label="Working Span"
              variant="outlined"
              fullWidth
              placeholder="e.g., 8:00 AM - 5:00 PM"
              value={newMachine.working_span}
              onChange={(e) => handleInputChange("working_span", e.target.value)}
            />
            
            <TextField
              label="Category"
              variant="outlined"
              fullWidth
              required
              select
              value={newMachine.category}
              onChange={(e) => handleInputChange("category", e.target.value)}
              error={!!formErrors.category}
              helperText={formErrors.category}
            >
              {machineCategories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        )}
      </Box>

      {/* Footer Actions */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 2,
          padding: "16px",
          borderTop: "1px solid #ddd",
        }}
      >
        <Button onClick={onDrawerClose} color="secondary">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          variant="contained"
          disabled={isLoading}
        >
          {machine ? "Save" : "Add"}
        </Button>
      </Box>
    </Drawer>
  );
};

export default AddNewMachineDrawer;