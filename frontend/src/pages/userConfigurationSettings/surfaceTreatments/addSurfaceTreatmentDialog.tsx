import React from "react";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography,
} from "@mui/material";
import DrawerModal from "@/components/drawerModel";

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
    <DrawerModal
      isOpen={open}
      onClose={onDrawerClose}
      title="Select an Option"
      width={400}
      anchor="right"
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {/* Import Option */}
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

        {/* Add New Option */}
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
    </DrawerModal>
  );
};

export default AddSurfaceTreatmentDrawer;