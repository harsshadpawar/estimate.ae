import React from "react";
import {
  Drawer,
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

// Define the props type
interface AddSurfaceTreatmentDrawerProps {
  open: boolean;
  onDrawerClose: () => void;
  onImportSurfaceTreatment: () => void;
  onAddNewSurfaceTreatment: () => void;
}

const AddSurfaceTreatmentDrawer: React.FC<AddSurfaceTreatmentDrawerProps> = ({
  open,
  onDrawerClose,
  onImportSurfaceTreatment,
  onAddNewSurfaceTreatment,
}) => {
  return (
    <Drawer anchor="right" open={open} onClose={onDrawerClose}>
      <Box
        sx={{
          width: 400,
          padding: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {/* Header with Close Button */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Select an Option</Typography>
          <IconButton onClick={onDrawerClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Options */}
        <Card
          onClick={onImportSurfaceTreatment}
          sx={{ cursor: "pointer", textAlign: "center" }}
        >
          <CardActionArea>
            <CardContent>
              <Typography variant="h6">Import from Default</Typography>
            </CardContent>
          </CardActionArea>
        </Card>
        <Card
          onClick={onAddNewSurfaceTreatment}
          sx={{ cursor: "pointer", textAlign: "center" }}
        >
          <CardActionArea>
            <CardContent>
              <Typography variant="h6">Add New Surface Treatment</Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Box>
    </Drawer>
  );
};

export default AddSurfaceTreatmentDrawer;