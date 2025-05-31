import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchMachineCategories } from "@/redux/features/machines/machinesSlice";
import DrawerModal from "@/components/drawerModel";

interface AddNewMachineDrawerProps {
  open: boolean;
  machine?: any;
  onDrawerClose: () => void;
  onSaveMachine: (machine: any) => void;
}

const AddNewMachineDrawer: React.FC<AddNewMachineDrawerProps> = ({ 
  open, 
  machine, 
  onDrawerClose, 
  onSaveMachine 
}) => {
  const dispatch = useDispatch();
  const { machineCategories, categoriesStatus } = useSelector((state: any) => state.machines);
  
  const [newMachine, setNewMachine] = useState({
    name: "",
    abbreviation: "",
    hourly_rate: "",
    working_span: "",
    category: "",
    currency: "$",  // Default currency
  });
  
  const [formErrors, setFormErrors] = useState<any>({});
  
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

  const handleInputChange = (field: string, value: string) => {
    setNewMachine((prev) => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear error for the field being changed
    if (formErrors[field]) {
      setFormErrors((prev: any) => ({
        ...prev,
        [field]: "",
      }));
    }
  };
  
  const validateForm = () => {
    const errors: any = {};
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

  const actions = (
    <>
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
    </>
  );

  return (
    <DrawerModal
      isOpen={open}
      onClose={onDrawerClose}
      title={machine ? "Edit Machine" : "Add a New Machine"}
      width={500}
      anchor="right"
      actions={actions}
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
            {machineCategories.map((category: string) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      )}
    </DrawerModal>
  );
};

export default AddNewMachineDrawer;