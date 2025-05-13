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

const AddMachineDrawer = ({ open, onDrawerClose, onImportMachines, onAddNewMachine }) => {
  return (
    <Drawer
      anchor="right" // Drawer slides in from the right
      open={open}
      onClose={onDrawerClose}
      PaperProps={{
        sx: {
          width: "400px", // Set the width of the drawer
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
          Select an Option
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
    </Drawer>
  );
};

export default AddMachineDrawer;
