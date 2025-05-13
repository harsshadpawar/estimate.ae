import React, { useEffect, useState } from "react";
import {
  Drawer,
  Box,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  MenuItem,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const MaterialFormDrawer: React.FC<MaterialFormDrawerProps> = ({
  open,
  material,
  onDrawerClose,
  onSaveMaterial,
  materialGroups,
}) => {
  const [newMaterial, setNewMaterial] = useState<Material>({
    name: "",
    material_number: "",
    price_per_kg: 0,
    refund_per_kg: 0,
    density: 0,
    co2_emission: 0,
    active: true,
    material_group_id: "",
  });

  useEffect(() => {
    if (material) {
      setNewMaterial({
        ...material,
        price_per_kg: material.price_per_kg || 0,
        refund_per_kg: material.refund_per_kg || 0,
        density: material.density || 0,
        co2_emission: material.co2_emission || 0,
      });
    }
  }, [material]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewMaterial({ ...newMaterial, [e.target.name]: e.target.value });
  };

  const handleToggleActive = () => {
    setNewMaterial((prev) => ({ ...prev, active: !prev.active }));
  };

  const handleSubmit = () => {
    onSaveMaterial(newMaterial);
  };

  return (
    <Drawer anchor="right" open={open} onClose={onDrawerClose}>
      <Box
        sx={{
          width: 500,
          padding: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          height: "100%",
        }}
      >
        {/* Header with Close Button */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            {material ? "Edit Material" : "Add New Material"}
          </Typography>
          <IconButton onClick={onDrawerClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Content */}
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Material Number"
            variant="outlined"
            fullWidth
            name="material_number"
            value={newMaterial.material_number}
            onChange={handleInputChange}
          />
          <TextField
            label="Material Name"
            variant="outlined"
            fullWidth
            name="name"
            value={newMaterial.name}
            onChange={handleInputChange}
          />
          <TextField
            label="Price per KG"
            variant="outlined"
            fullWidth
            name="price_per_kg"
            type="number"
            value={newMaterial.price_per_kg}
            onChange={handleInputChange}
          />
          <TextField
            label="Refund per KG"
            variant="outlined"
            fullWidth
            name="refund_per_kg"
            type="number"
            value={newMaterial.refund_per_kg}
            onChange={handleInputChange}
          />
          <TextField
            label="Density"
            variant="outlined"
            fullWidth
            name="density"
            type="number"
            value={newMaterial.density}
            onChange={handleInputChange}
          />
          <TextField
            label="CO2 Emission"
            variant="outlined"
            fullWidth
            name="co2_emission"
            type="number"
            value={newMaterial.co2_emission}
            onChange={handleInputChange}
          />
          <TextField
            label="Group"
            variant="outlined"
            fullWidth
            select
            name="material_group_id"
            value={newMaterial.material_group_id}
            onChange={handleInputChange}
          >
            {materialGroups.map((group) => (
              <MenuItem key={group.id} value={group.id}>
                {group.name}
              </MenuItem>
            ))}
          </TextField>
          <FormControlLabel
            control={
              <Checkbox
                checked={newMaterial.active}
                onChange={handleToggleActive}
                name="active"
              />
            }
            label="Active"
          />
        </Box>

        {/* Actions */}
        <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
          <Button onClick={onDrawerClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {material ? "Save" : "Add"}
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default MaterialFormDrawer;