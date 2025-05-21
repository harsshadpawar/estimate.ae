import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  IconButton,
  styled,
  tableCellClasses,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import ConfirmDialog from "../../dashboard/ConfirmDialog/confirmDialog";
import AddSurfaceTreatmentDialog from "./addSurfaceTreatmentDialog";
import ImportSurfaceTreatmentDialog from "./importSurfaceTreatmentDialog";
import AddNewSurfaceTreatmentDialog from "./addNewSurfaceTreatmentDialog";
import "@/assets/css/surfaceTreatments.css";
import { useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { TbEdit } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";

import { addSurfaceTreatment, deleteSurfaceTreatment, fetchSurfaceTreatments, importSurfaceTreatment, updateSurfaceTreatment } from "@/redux/features/surfaceTreatments/surfaceTreatmentsSlice";
import { fetchMaterialGroups } from "@/redux/features/materials/materialsSlice";
import { RootState } from "@/redux/store/store";
import { toast } from "react-toastify";

// Type Definitions
interface SurfaceTreatment {
  id: string;
  active: boolean;
  name: string;
  price_per_kg: number;
  surface_price: number;
}

interface MaterialGroup {
  id: string;
  name: string;
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.body}`]: {
    fontWeight: 500,
    fontSize: '15px',
    lineHeight: '18.15px'
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  height: '54px',
  '&:nth-of-type(odd)': {
    backgroundColor: '#EFF7FD',
  },
  '&:nth-of-type(even)': {
    backgroundColor: '#FFFF',
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const SurfaceTreatments: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Redux selectors
  const surfaceTreatments = useSelector((state: RootState) => state?.surfaceTreatments.treatments);
  const materialGroups = useSelector((state: RootState) => state?.materials.groups);
  const status = useSelector((state: RootState) => state?.surfaceTreatments.status);
  
  // Local state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<string>("");
  const [selectedSurfaceTreatmentId, setSelectedSurfaceTreatmentId] = useState<string | null>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);

  // Fetch data on mount
  useEffect(() => {
    dispatch(fetchSurfaceTreatments());
    dispatch(fetchMaterialGroups());
  }, [dispatch]);

  // Dialog control handlers
  const openDialog = (type: string, id: string | null = null) => {
    setDialogType(type);
    setSelectedSurfaceTreatmentId(id);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const handleView = (type: string, treatmentData: SurfaceTreatment | null = null) => {
    navigate('/surface', {
      state: {
        machineData: treatmentData,
        materialGroups: materialGroups,
        viewMode: type,
      },
    });
  };

  // Save new or update existing treatment
  const handleSaveSurfaceTreatment = async (treatment: SurfaceTreatment) => {
    if (surfaceTreatments.some(st => st.name === treatment.name && st.id !== treatment.id)) {
      toast.warn("Surface treatment with this name already exists");
      return;
    }

    if (treatment.price_per_kg === 0) {
      toast.warn("Please add Price Per kg");
      return;
    }

    if (selectedSurfaceTreatmentId) {
      dispatch(updateSurfaceTreatment({ id: selectedSurfaceTreatmentId, treatment }));
    } else {
      dispatch(addSurfaceTreatment(treatment));
    }
    closeDialog();
  };

  // Import treatment
  const handleImportSurfaceTreatment = async (treatment: SurfaceTreatment) => {
    if (surfaceTreatments.some(st => st.name === treatment.name)) {
      toast.warn("Surface treatment with this name already exists");
      return;
    }
    dispatch(importSurfaceTreatment(treatment.id));
    closeDialog();
  };

  // Delete treatment
  const handleDeleteSurfaceTreatment = async () => {
    if (selectedSurfaceTreatmentId) {
      dispatch(deleteSurfaceTreatment(selectedSurfaceTreatmentId));
    }
    setIsConfirmDialogOpen(false);
  };

  // Confirm dialog handlers
  const openConfirmDialog = (id: string) => {
    setSelectedSurfaceTreatmentId(id);
    setIsConfirmDialogOpen(true);
  };

  const closeConfirmDialog = () => {
    setIsConfirmDialogOpen(false);
  };

  const toggleCheckbox = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', my: { xs: 3, sm: 1 } }}>
        <Typography sx={{ 
          fontWeight: 600,
          fontSize: { xs: '20px', sm: '24px', md: '28px' },
          lineHeight: '33.89px',
        }} gutterBottom>
          Surface Treatments
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => openDialog("")}
        >
          Add Surface Treatment
        </Button>
      </Box>

      {status === 'loading' && (
        <Backdrop
          sx={{
            color: '#fff',
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
          open={status === 'loading'}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}

      <Table sx={{ 
        borderTopLeftRadius: '20px', 
        borderTopRightRadius: '20px', 
        backgroundColor: '#0591FC', 
        color: '#FFFF' 
      }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ color: "white", fontWeight: "bold" }}>#</TableCell>
            <TableCell sx={{ color: "white", fontWeight: "bold" }}>Name</TableCell>
            <TableCell sx={{ color: "white", fontWeight: "bold" }}>Price per KG</TableCell>
            <TableCell sx={{ color: "white", fontWeight: "bold" }}>Surface Price</TableCell>
            <TableCell sx={{ color: "white", fontWeight: "bold" }}>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {surfaceTreatments?.map((treatment, index) => (
            <StyledTableRow key={treatment?.id}>
              <StyledTableCell>
                <Checkbox 
                  checked={treatment?.active} 
                  onChange={() => toggleCheckbox(treatment?.id)} 
                />
              </StyledTableCell>
              <TableCell>{treatment?.name}</TableCell>
              <TableCell>{treatment?.price_per_kg}</TableCell>
              <TableCell>{treatment?.surface_price}</TableCell>
              <TableCell>
                <IconButton 
                  sx={{ color: 'Green', height: '12px' }}
                  onClick={() => handleView("view", treatment)}
                >
                  <FaEye />
                </IconButton>
                <IconButton 
                  sx={{ color: '#0591FC', height: '12px' }} 
                  onClick={() => handleView("edit", treatment)}
                >
                  <TbEdit />
                </IconButton>
                <IconButton 
                  sx={{ color: 'red' }} 
                  onClick={() => openConfirmDialog(treatment?.id)}
                >
                  <Delete />
                </IconButton>
              </TableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>

      {/* Dialog Components */}
      {dialogType === "" && (
        <AddSurfaceTreatmentDialog
          open={isDialogOpen}
          onDrawerClose={closeDialog}
          onImportSurfaceTreatment={() => openDialog("import")}
          onAddNewSurfaceTreatment={() => openDialog("add")}
        />
      )}
      {dialogType === "import" && (
        <ImportSurfaceTreatmentDialog
          open={isDialogOpen}
          onDrawerClose={closeDialog}
          onImportSurfaceTreatment={handleImportSurfaceTreatment}
        />
      )}
      {(dialogType === "add" || dialogType === "edit") && (
        <AddNewSurfaceTreatmentDialog
          open={isDialogOpen}
          surfaceTreatment={
            dialogType === "edit" && selectedSurfaceTreatmentId
              ? surfaceTreatments.find(st => st.id === selectedSurfaceTreatmentId) || null
              : null
          }
          materialGroups={materialGroups}
          onDialogClose={closeDialog}
          onSaveSurfaceTreatment={handleSaveSurfaceTreatment}
        />
      )}

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={isConfirmDialogOpen}
        onClose={closeConfirmDialog}
        onConfirm={handleDeleteSurfaceTreatment}
        title="Delete Surface Treatment"
        message="Are you sure you want to delete this surface treatment?"
      />
    </Box>
  );
};

export default SurfaceTreatments;