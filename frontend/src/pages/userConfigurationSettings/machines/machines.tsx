import React, { useState, useEffect } from "react";
import {
  Typography,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Backdrop,
  CircularProgress,
  Box,
  Checkbox,
} from "@mui/material";
import { Delete, ExpandMore } from "@mui/icons-material";
import { TbEdit } from "react-icons/tb";
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
} from "@/redux/features/machines/machinesSlice";

import AddMachineDialog from "./addMachineDialog";
import ImportMachineDialog from "./importMachineDialog";
import AddNewMachineDialog from "./addNewMachineDialog";
import ConfirmDialog from "../../dashboard/ConfirmDialog/confirmDialog";
import CustomButton from "@/components/button"; // Add this import
import "@/assets/css/machines.css";
import EnhancedTable from "@/components/table";
import Loader from "@/components/loader";
import { RootState } from "@/redux/store/store";

const Machine = () => {
  // Redux hooks
  const dispatch = useDispatch();
  const { machines, status: machinesStatus, error } = useSelector((state) => state.machines);
  const role = useSelector((state: RootState) => state?.auth?.role);

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
      const category = machine.machine_category || "Uncategorized";
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
        machine?.machine_abbreviation === newMachine?.machine_abbreviation
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
        existingMachine?.machine_abbreviation === machine?.machine_abbreviation
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

  // Define columns for the EnhancedTable
  const columns = [
    {
      id: 'checkbox',
      label: '#',
      sortable: false,
      searchable: false,
      format: (value, row) => (
        <Checkbox
          checked={selected.includes(row.id)}
          onChange={() => toggleCheckbox(row.id)}
        />
      )
    },
    {
      id: 'machine_abbreviation',
      label: 'Abbreviation',
      sortable: true,
      searchable: true,
      format: (value) => (
        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
          {value || '--'}
        </Box>
      )
    },
    {
      id: 'name',
      label: 'Name',
      sortable: true,
      searchable: true,
    },
    {
      id: 'hourly_rate',
      label: 'Hourly Rate',
      sortable: true,
      searchable: false,
      format: (value, row) =>
        value > 0 ? `${value}/h` : '--'
    },
    {
      id: 'working_span',
      label: 'Working Span',
      sortable: true,
      searchable: false,
      format: (value) => (
        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
          {value || '--'}
        </Box>
      )
    },
    {
      id: 'actions',
      label: 'Action',
      sortable: false,
      searchable: false,
      format: (value, row) => (
        <Box>
          <IconButton
            sx={{ color: 'Green', height: '12px' }}
            onClick={() => handleView("view", row)}
          >
            <FaEye />
          </IconButton>
          {role == 'super-admin' || role == 'admin' ?
            (
              <>
                <IconButton
                  sx={{ color: '#0591FC', height: '12px' }}
                  onClick={() => handleView("edit", row)}
                >
                  <TbEdit />
                </IconButton>
                <IconButton
                  sx={{ color: 'red' }}
                  onClick={() => openConfirmDialog(row.id)}
                >
                  <Delete />
                </IconButton>
              </>
            ) : null}
        </Box>
      )
    }
  ];

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
      {isLoading && (
        <Loader loading={isLoading} />
      )}

      {machines.length === 0 && !isLoading ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
          <Typography sx={{ fontWeight: 600, fontSize: { xs: '20px', sm: '24px', md: '28px' }, lineHeight: '33.89px' }}>
            Machines
          </Typography>
          <Typography
            variant="body1"
            align="center"
            style={{ marginTop: "20px" }}
          >
            Please add machines to view the list.
          </Typography>
          <Box sx={{ width: '200px', mt: 2 }}>
            <CustomButton
              text="Add Machine"
              onClick={() => openDialog("")}
              width="200px"
              height="50px"
              borderRadius="14px"
            />
          </Box>
        </Box>
      ) : (
        Object.keys(groupedMachines).map((category) => (
          <Accordion key={category} sx={{ boxShadow: 0, marginTop: 2 }}>
            <AccordionSummary sx={{ backgroundColor: '#F9F9F9' }} expandIcon={<ExpandMore />}>
              <Typography sx={{ fontWeight: 600, fontSize: '18px', lineHeight: '24px' }}>
                {category}
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ padding: 0 }}>
              <EnhancedTable
                title=""
                data={groupedMachines[category]}
                columns={columns}
                {...((role === 'super-admin' || role === 'admin') && { add: () => openDialog("") })}
                initialSortColumn="name"
                initialSortDirection="asc"
              />

            </AccordionDetails>
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