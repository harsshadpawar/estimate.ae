import { useEffect, useState } from "react";
import {
  Drawer,
  Box,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  TableHead,
  IconButton,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import "./machines.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchDefaultMachines } from "../../../redux/features/machines/machinesSlice";

const ImportMachineDrawer = ({ open, onDrawerClose, onImportMachine }) => {
  const dispatch = useDispatch();
  const { defaultMachines, defaultMachinesTotal, defaultMachinesStatus } = useSelector(
    (state) => state.machines
  );
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Fetch default machines when drawer opens or pagination changes
  useEffect(() => {
    if (open) {
      dispatch(fetchDefaultMachines({ page: page + 1, size: rowsPerPage }));
    }
  }, [open, page, rowsPerPage, dispatch]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage - 1); // Pagination component is 1-indexed, but our state is 0-indexed
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to the first page when rows per page changes
  };

  // Calculate pagination values
  const totalPages = Math.ceil(defaultMachinesTotal / rowsPerPage);
  const isLoading = defaultMachinesStatus === 'loading';

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
          Select a Default Machine
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
        ) : defaultMachines.length === 0 ? (
          <Box textAlign="center" mt={2}>
            <Typography variant="body1" color="textSecondary">
              No default machines available.
            </Typography>
          </Box>
        ) : (
          <>
            <Box className="import-machine-table">
              <Table stickyHeader>
                <TableHead className="import-machine-table-header">
                  <TableRow>
                    <TableCell>
                      <Typography variant="subtitle1" fontWeight="bold">Machine Name</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="subtitle1" fontWeight="bold">Hourly Rate</Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {defaultMachines.map((machine) => (
                    <TableRow
                      key={machine.id}
                      hover
                      sx={{ cursor: "pointer" }}
                      onClick={() => onImportMachine(machine)}
                    >
                      <TableCell>
                        <Typography variant="body2">{machine.name}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2">
                          {machine.hourly_rate > 0
                            ? `${machine.currency || "$"} ${machine.hourly_rate}`
                            : "Free"}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
            
            {/* Custom Pagination */}
            <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
              <FormControl variant="outlined" size="small">
                <InputLabel>Rows</InputLabel>
                <Select
                  value={rowsPerPage}
                  onChange={handleChangeRowsPerPage}
                  label="Rows"
                >
                  {[5, 10, 25, 50].map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <Pagination
                count={totalPages}
                page={page + 1} // Pagination component is 1-indexed
                onChange={handleChangePage}
                color="primary"
                size="medium"
              />
            </Box>
          </>
        )}
      </Box>
    </Drawer>
  );
};

export default ImportMachineDrawer;