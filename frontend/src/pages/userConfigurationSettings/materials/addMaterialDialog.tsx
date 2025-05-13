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
interface AddMaterialDrawerProps {
  open: boolean;
  onDrawerClose: () => void;
  onImportMaterial: () => void;
  onAddNewMaterial: () => void;
}

const AddMaterialDrawer: React.FC<AddMaterialDrawerProps> = ({
  open,
  onDrawerClose,
  onImportMaterial,
  onAddNewMaterial,
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
          height: "100%",
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
        <Box display="flex" justifyContent="space-between" gap={2} mt={2}>
          <Card
            onClick={onImportMaterial}
            sx={{ flex: 1, cursor: "pointer", textAlign: "center" }}
          >
            <CardActionArea>
              <CardContent>
                <Typography variant="h6">Import from Default</Typography>
              </CardContent>
            </CardActionArea>
          </Card>
          <Card
            onClick={onAddNewMaterial}
            sx={{ flex: 1, cursor: "pointer", textAlign: "center" }}
          >
            <CardActionArea>
              <CardContent>
                <Typography variant="h6">Add New Material</Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Box>
      </Box>
    </Drawer>
  );
};

export default AddMaterialDrawer;