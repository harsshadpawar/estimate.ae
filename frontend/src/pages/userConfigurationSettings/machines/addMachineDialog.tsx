import React from "react";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography,
} from "@mui/material";
import DrawerModal from "@/components/drawerModel";

interface AddMachineDrawerProps {
  open: boolean;
  onDrawerClose: () => void;
  onImportMachines: () => void;
  onAddNewMachine: () => void;
}

const AddMachineDrawer: React.FC<AddMachineDrawerProps> = ({ 
  open, 
  onDrawerClose, 
  onImportMachines, 
  onAddNewMachine 
}) => {
  return (
    <DrawerModal
      isOpen={open}
      onClose={onDrawerClose}
      title="Select an Option"
      width={400}
      anchor="right"
    >
      {/* Content */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Card
          onClick={onImportMachines}
          sx={{
            flex: 1,
            cursor: "pointer",
            "&:hover": { boxShadow: 3 },
          }}
        >
          <CardActionArea>
            <CardContent>
              <Typography variant="h6" align="center">
                Import from Default
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
        <Card
          onClick={onAddNewMachine}
          sx={{
            flex: 1,
            cursor: "pointer",
            "&:hover": { boxShadow: 3 },
          }}
        >
          <CardActionArea>
            <CardContent>
              <Typography variant="h6" align="center">
                Add New Machine
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Box>
    </DrawerModal>
  );
};

export default AddMachineDrawer;