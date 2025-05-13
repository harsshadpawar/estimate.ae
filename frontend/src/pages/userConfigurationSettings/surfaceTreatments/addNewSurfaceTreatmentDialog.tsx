// import React, { useEffect } from "react";
// import {
//     Dialog,
//     DialogTitle,
//     DialogContent,
//     Box,
//     TextField,
//     Select,
//     MenuItem,
//     Checkbox,
//     ListItemText,
//     DialogActions,
//     Button,
//     FormControl,
//     InputLabel,
// } from "@mui/material";

// // Define the types for props
// interface MaterialGroup {
//     id: number;
//     name: string;
// }

// interface SurfaceTreatment {
//     active: boolean;
//     name: string;
//     price_per_kg: number;
//     surface_price: number;
//     setup_costs: number;
//     minimal_price_per_piece: number;
//     material_group_ids: number[];
// }

// interface AddNewSurfaceTreatmentDialogProps {
//     open: boolean;
//     onDialogClose: () => void;
//     onSaveSurfaceTreatment: (surfaceTreatment: SurfaceTreatment) => void;
//     surfaceTreatment?: SurfaceTreatment;
//     materialGroups: MaterialGroup[];
// }

// const AddNewSurfaceTreatmentDialog: React.FC<AddNewSurfaceTreatmentDialogProps> = ({
//     open,
//     onDialogClose,
//     onSaveSurfaceTreatment,
//     surfaceTreatment,
//     materialGroups,
// }) => {
//     const [newSurfaceTreatment, setNewSurfaceTreatment] = React.useState<SurfaceTreatment>({
//         active: true,
//         name: "",
//         price_per_kg: 0,
//         surface_price: 0,
//         setup_costs: 0,
//         minimal_price_per_piece: 0,
//         material_group_ids: [],
//         ...surfaceTreatment, // Override defaults if `surfaceTreatment` is provided
//     });

//     useEffect(() => {
//         if (surfaceTreatment) {
//             setNewSurfaceTreatment(surfaceTreatment);
//         }
//     }, [surfaceTreatment]);

//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setNewSurfaceTreatment({ ...newSurfaceTreatment, [e.target.name]: e.target.value });
//     };

//     const handleToggleActive = () => {
//         setNewSurfaceTreatment({ ...newSurfaceTreatment, active: !newSurfaceTreatment.active });
//     };

//     const handleMaterialGroupChange = (event: React.ChangeEvent<{ value: unknown }>) => {
//         const value = event.target.value as number[];
//         setNewSurfaceTreatment({ ...newSurfaceTreatment, material_group_ids: value });
//     };

//     return (
//         <Dialog open={open} onClose={onDialogClose} fullWidth>
//             <DialogTitle>
//                 {surfaceTreatment ? "Edit Surface Treatment" : "Add New Surface Treatment"}
//             </DialogTitle>
//             <DialogContent>
//                 <Box display="flex" flexDirection="column" gap={2}>
//                     <TextField
//                         label="Name"
//                         name="name"
//                         value={newSurfaceTreatment.name}
//                         onChange={handleInputChange}
//                         fullWidth
//                     />
//                     <TextField
//                         label="Price per Kg"
//                         name="price_per_kg"
//                         type="number"
//                         value={newSurfaceTreatment.price_per_kg}
//                         onChange={handleInputChange}
//                         fullWidth
//                     />
//                     <TextField
//                         label="Surface Price"
//                         name="surface_price"
//                         type="number"
//                         value={newSurfaceTreatment.surface_price}
//                         onChange={handleInputChange}
//                         fullWidth
//                     />
//                     <TextField
//                         label="Setup Costs"
//                         name="setup_costs"
//                         type="number"
//                         value={newSurfaceTreatment.setup_costs}
//                         onChange={handleInputChange}
//                         fullWidth
//                     />
//                     <TextField
//                         label="Minimal Price per Piece"
//                         name="minimal_price_per_piece"
//                         type="number"
//                         value={newSurfaceTreatment.minimal_price_per_piece}
//                         onChange={handleInputChange}
//                         fullWidth
//                     />
//                     <FormControl fullWidth>
//                         <InputLabel>Material Groups</InputLabel>
//                         <Select
//                             name="material_group_ids"
//                             value={newSurfaceTreatment.material_group_ids}
//                             onChange={handleMaterialGroupChange}
//                             multiple
//                             renderValue={(selected) =>
//                                 (selected as number[])
//                                     .map(
//                                         (id) =>
//                                             materialGroups.find((group) => group.id === id)?.name || ""
//                                     )
//                                     .join(", ")
//                             }
//                         >
//                             {materialGroups.map((materialGroup) => (
//                                 <MenuItem key={materialGroup.id} value={materialGroup.id}>
//                                     <Checkbox
//                                         checked={newSurfaceTreatment.material_group_ids.includes(
//                                             materialGroup.id
//                                         )}
//                                     />
//                                     <ListItemText primary={materialGroup.name} />
//                                 </MenuItem>
//                             ))}
//                         </Select>
//                     </FormControl>
//                 </Box>
//             </DialogContent>
//             <DialogActions>
//                 <Button onClick={onDialogClose}>Cancel</Button>
//                 <Button onClick={() => onSaveSurfaceTreatment(newSurfaceTreatment)}>Save</Button>
//             </DialogActions>
//         </Dialog>
//     );
// };

// export default AddNewSurfaceTreatmentDialog;
import React, { useEffect, useState } from "react";
import {
  Drawer,
  Box,
  TextField,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  Button,
  FormControl,
  InputLabel,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

// Type Definitions
interface MaterialGroup {
  id: string;
  name: string;
}

interface SurfaceTreatment {
  id?: string;
  active: boolean;
  name: string;
  price_per_kg: number;
  surface_price: number;
  setup_costs?: number;
  minimal_price_per_piece?: number;
  material_group_ids?: string[];
}

interface AddNewSurfaceTreatmentDialogProps {
  open: boolean;
  onDialogClose: () => void;
  onSaveSurfaceTreatment: (surfaceTreatment: SurfaceTreatment) => void;
  surfaceTreatment: SurfaceTreatment | null;
  materialGroups: MaterialGroup[];
}

const AddNewSurfaceTreatmentDialog: React.FC<AddNewSurfaceTreatmentDialogProps> = ({
  open,
  onDialogClose,
  onSaveSurfaceTreatment,
  surfaceTreatment,
  materialGroups,
}) => {
  const initialState: SurfaceTreatment = {
    active: true,
    name: "",
    price_per_kg: 0,
    surface_price: 0,
    setup_costs: 0,
    minimal_price_per_piece: 0,
    material_group_ids: [],
  };

  const [newSurfaceTreatment, setNewSurfaceTreatment] = useState<SurfaceTreatment>(initialState);

  useEffect(() => {
    if (surfaceTreatment) {
      setNewSurfaceTreatment(surfaceTreatment);
    } else {
      setNewSurfaceTreatment(initialState);
    }
  }, [surfaceTreatment, open]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Handle number inputs correctly
    if (["price_per_kg", "surface_price", "setup_costs", "minimal_price_per_piece"].includes(name)) {
      setNewSurfaceTreatment({ 
        ...newSurfaceTreatment, 
        [name]: parseFloat(value) || 0 
      });
    } else {
      setNewSurfaceTreatment({ 
        ...newSurfaceTreatment, 
        [name]: value 
      });
    }
  };

  const handleMaterialGroupChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const value = event.target.value as string[];
    setNewSurfaceTreatment({ ...newSurfaceTreatment, material_group_ids: value });
  };

  const handleSave = () => {
    onSaveSurfaceTreatment({
      ...newSurfaceTreatment,
      // If existing treatment, preserve ID
      ...(surfaceTreatment?.id ? { id: surfaceTreatment.id } : {})
    });
  };

  return (
    <Drawer anchor="right" open={open} onClose={onDialogClose}>
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
            {surfaceTreatment ? "Edit Surface Treatment" : "Add New Surface Treatment"}
          </Typography>
          <IconButton onClick={onDialogClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Content */}
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Name"
            name="name"
            value={newSurfaceTreatment.name}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            label="Price per Kg"
            name="price_per_kg"
            type="number"
            value={newSurfaceTreatment.price_per_kg}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            label="Surface Price"
            name="surface_price"
            type="number"
            value={newSurfaceTreatment.surface_price}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            label="Setup Costs"
            name="setup_costs"
            type="number"
            value={newSurfaceTreatment.setup_costs}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            label="Minimal Price per Piece"
            name="minimal_price_per_piece"
            type="number"
            value={newSurfaceTreatment.minimal_price_per_piece}
            onChange={handleInputChange}
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel>Material Groups</InputLabel>
            <Select
              name="material_group_ids"
              value={newSurfaceTreatment.material_group_ids}
              onChange={handleMaterialGroupChange}
              multiple
              renderValue={(selected) =>
                (selected as string[])
                  .map(
                    (id) =>
                      materialGroups.find((group) => group.id === id)?.name || ""
                  )
                  .join(", ")
              }
            >
              {materialGroups.map((materialGroup) => (
                <MenuItem key={materialGroup.id} value={materialGroup.id}>
                  <Checkbox
                    checked={newSurfaceTreatment.material_group_ids?.includes(
                      materialGroup.id
                    ) || false}
                  />
                  <ListItemText primary={materialGroup.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Actions */}
        <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
          <Button onClick={onDialogClose}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSave}
          >
            Save
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default AddNewSurfaceTreatmentDialog;