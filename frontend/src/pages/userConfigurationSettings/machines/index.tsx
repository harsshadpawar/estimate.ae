import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Checkbox,
  IconButton,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  styled,
  tableCellClasses,
  Backdrop,
  CircularProgress,
  Box,
} from "@mui/material";
import { Edit, Delete, ExpandMore } from "@mui/icons-material";
import { TbEdit } from "react-icons/tb";
import apiClient from "../../../services/interceptor";
import AddMachineDialog from "./addMachineDialog";
import ImportMachineDialog from "./importMachineDialog";
import AddNewMachineDialog from "./addNewMachineDialog";
import ConfirmDialog from "../../dashboard/ConfirmDialog";
import "./machines.css";
import { FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { 
  fetchMachines, 
  addMachine, 
  updateMachine, 
  deleteMachine as removeMachine, 
  importMachine as importMachineAction 
} from "../../../redux/features/machines/machinesSlice";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.body}`]: {
    fontWeight: 500,
    fontSize: '15px',
    lineHeight: '18.15px'
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  height: '54px',
  '&:nth-of-type(even)': {
    backgroundColor: '#EFF7FD',
  },
  '&:nth-of-type(odd)': {
    backgroundColor: '#FFFF',
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const Machine = () => {
  // Redux hooks
  const dispatch = useDispatch();
  const { machines, status: machinesStatus, error } = useSelector((state) => state.machines);
  
  // Local state
  const [groupedMachines, setGroupedMachines] = useState({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState("");
  const [selectedMachineId, setSelectedMachineId] = useState("");
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [selected, setSelected] = useState([]);
  
  const navigate = useNavigate();
  
  // Determine if we're loading
  const isLoading = machinesStatus === 'loading';

  // Fetch machines on component mount
  useEffect(() => {
    dispatch(fetchMachines());
  }, [dispatch]);

  // Group machines by category whenever machines changes
  useEffect(() => {
    if (machines && machines.length > 0) {
      groupMachinesByCategory(machines);
    }
  }, [machines]);

  // Group machines by category
  const groupMachinesByCategory = (data) => {
    const grouped = data.reduce((acc, machine) => {
      const category = machine.category || "Uncategorized";
      if (!acc[category]) acc[category] = [];
      acc[category].push(machine);
      return acc;
    }, {});
    setGroupedMachines(grouped);
  };

  // Dialog control handlers
  const openDialog = (type, machineId = null) => {
    setDialogType(type);
    setSelectedMachineId(machineId);
    setIsDialogOpen(true);
  };

  const handleView = (type, machineData = null) => {
    navigate('/machine', {
      state: {
        machineData: machineData,
        viewMode: type,
      },
    });
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  // Add or edit machine
  const saveNewMachine = async (newMachine) => {
    try {
      if (machines.some(machine =>
        machine?.name === newMachine?.name ||
        machine?.abbreviation === newMachine?.abbreviation
      )) {
        toast.warn("Machine with the same name and abbreviation already exists.");
        return;
      }

      if (selectedMachineId) {
        // Update existing machine
        await dispatch(updateMachine({ id: selectedMachineId, machine: newMachine })).unwrap();
        toast.success('Machine updated successfully');
      } else {
        // Add new machine
        await dispatch(addMachine(newMachine)).unwrap();
        toast.success('Machine added successfully');
      }
      closeDialog();
    } catch (error) {
      toast.error('Failed to save the machine');
      console.error("Error saving machine:", error);
    }
  };

  // Import machine
  const importMachine = async (machine) => {
    closeDialog();
    try {
      if (machines.some((existingMachine) => 
        existingMachine?.name === machine?.name && 
        existingMachine?.abbreviation === machine?.abbreviation
      )) {
        toast.warn("Machine already exists");
        return;
      }
      
      await dispatch(importMachineAction(machine.id)).unwrap();
      toast.success('Machine imported successfully');
    } catch (error) {
      toast.error('Failed to import the machine');
      console.error("Error importing machine:", error);
    }
  };

  // Delete machine
  const deleteMachine = async () => {
    try {
      await dispatch(removeMachine(selectedMachineId)).unwrap();
      toast.success('Machine deleted successfully');
    } catch (error) {
      toast.error('Failed to delete machine');
      console.error("Error deleting machine:", error);
    } finally {
      setIsConfirmDialogOpen(false);
    }
  };

  // Confirm dialog handlers
  const openConfirmDialog = (machineId) => {
    setSelectedMachineId(machineId);
    setIsConfirmDialogOpen(true);
  };

  const closeConfirmDialog = () => {
    setIsConfirmDialogOpen(false);
  };

  const toggleCheckbox = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Handle potential error state
  if (machinesStatus === 'failed') {
    return (
      <Typography color="error" variant="h6" align="center" style={{ marginTop: "20px" }}>
        Error loading machines: {error}
      </Typography>
    );
  }

  return (
    <div>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography sx={{ fontWeight: 600, fontSize: { xs: '20px', sm: '24px', md: '28px' }, lineHeight: '33.89px', }} gutterBottom>
          Machines
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => openDialog("")}
        >
          Add Machine
        </Button>
      </Box>
      
      {isLoading && (
        <Backdrop
          sx={{
            color: '#fff',
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
          open={isLoading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      
      {machines.length === 0 && !isLoading ? (
        <Typography
          variant="body1"
          align="center"
          style={{ marginTop: "20px" }}
        >
          Please add machines to view the list.
        </Typography>
      ) : (
        Object.keys(groupedMachines).map((category) => (
          <Accordion key={category} sx={{ boxShadow: 0, marginTop: 0 }}>
            <AccordionSummary sx={{ backgroundColor: '#F9F9F9' }} expandIcon={<ExpandMore />}>
              <Typography sx={{ fontWeight: 600, fontSize: '18px', lineHeight: '24px' }}>{category}</Typography>
            </AccordionSummary>
            <TableContainer sx={{ boxShadow: 0 }} component={Paper}>
              <Table sx={{ borderTopLeftRadius: '20px', borderTopRightRadius: '20px', backgroundColor: '#0591FC', color: '#FFFF' }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>#</TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold", display:{xs:'none',sm:'block'} }}>Abbreviation</TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Name</TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Hourly Rate</TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold", display:{xs:'none',sm:'block'} }}>Working Span</TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {groupedMachines[category].map((machine, index) => (
                    <StyledTableRow key={machine.id || machine.name}>
                      <StyledTableCell>
                        <Checkbox 
                          checked={selected.includes(machine.id)} 
                          onChange={() => toggleCheckbox(machine.id)} 
                        />
                      </StyledTableCell>
                      <TableCell sx={{display:{xs:'none',sm:'block'}}}>{machine.abbreviation}</TableCell>
                      <TableCell>{machine.name}</TableCell>
                      <TableCell>
                        {machine.hourly_rate > 0
                          ? `${machine.currency} ${machine.hourly_rate}/h`
                          : "--"}
                      </TableCell>
                      <TableCell sx={{display:{xs:'none',sm:'block'}}}>{machine.working_span || "--"}</TableCell>
                      <TableCell>
                        <IconButton 
                          sx={{ color: 'Green', height: '12px' }}
                          onClick={() => handleView("view", machine)}
                        >
                          <FaEye />
                        </IconButton>
                        <IconButton 
                          sx={{ color: '#0591FC', height: '12px' }}
                          onClick={() => handleView("edit", machine)}
                        >
                          <TbEdit />
                        </IconButton>
                        <IconButton 
                          sx={{ color: 'red' }}
                          onClick={() => openConfirmDialog(machine.id)}
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Accordion>
        ))
      )}

      {/* Dialog Components */}
      {dialogType === "" && (
        <AddMachineDialog
          open={isDialogOpen}
          onDrawerClose={closeDialog}
          onImportMachines={() => openDialog("import")}
          onAddNewMachine={() => openDialog("add")}
        />
      )}
      
      {dialogType === "import" && (
        <ImportMachineDialog
          open={isDialogOpen}
          onDrawerClose={closeDialog}
          onImportMachine={importMachine}
        />
      )}
      
      {(dialogType === "add" || dialogType === "edit") && (
        <AddNewMachineDialog
          open={isDialogOpen}
          machine={
            dialogType === "edit"
              ? machines.find((m) => m.id === selectedMachineId)
              : null
          }
          onDrawerClose={closeDialog}
          onSaveMachine={saveNewMachine}
        />
      )}

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={isConfirmDialogOpen}
        onClose={closeConfirmDialog}
        onConfirm={deleteMachine}
        title="Delete Machine"
        message="Are you sure you want to delete this machine?"
      />
    </div>
  );
};

export default Machine;