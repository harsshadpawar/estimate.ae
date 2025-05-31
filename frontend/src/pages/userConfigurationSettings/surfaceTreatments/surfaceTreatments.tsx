import React, { useEffect, useState } from "react";
import {
  Box,
  Checkbox,
  IconButton,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import { FaEye } from "react-icons/fa";
import { TbEdit } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import ConfirmDialog from "../../dashboard/ConfirmDialog/confirmDialog";
import AddSurfaceTreatmentDialog from "./addSurfaceTreatmentDialog";
import ImportSurfaceTreatmentDialog from "./importSurfaceTreatmentDialog";
import AddNewSurfaceTreatmentDialog from "./addNewSurfaceTreatmentDialog";

import {
  addSurfaceTreatment,
  deleteSurfaceTreatment,
  fetchSurfaceTreatments,
  importSurfaceTreatment,
  updateSurfaceTreatment
} from "@/redux/features/surfaceTreatments/surfaceTreatmentsSlice";
import { fetchMaterialGroups } from "@/redux/features/materials/materialsSlice";
import { RootState } from "@/redux/store/store";
import EnhancedTable from "@/components/table";
import Loader from "@/components/loader";

// Type Definitions
interface SurfaceTreatment {
  id: string;
  active: boolean;
  surface_treat_name: string;
  price_per_kg: number;
  price: number;
}

interface MaterialGroup {
  id: string;
  name: string;
}

const SurfaceTreatments: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const role = useSelector((state: RootState) => state?.auth?.role);
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

  // Table columns configuration
  const columns = [
    {
      id: 'active',
      label: '#',
      sortable: false,
      searchable: false,
      format: (value: boolean, row: SurfaceTreatment) => (
        <Checkbox
          checked={value}
          onChange={() => toggleCheckbox(row.id)}
        />
      )
    },
    {
      id: 'surface_treat_name',
      label: 'Name',
      sortable: true,
      searchable: true,
    },
    {
      id: 'price_per_kg',
      label: 'Price per KG',
      sortable: true,
      searchable: true,
      format: (value: number) => value?.toFixed(2) || '0.00'
    },
    {
      id: 'price',
      label: 'Surface Price',
      sortable: true,
      searchable: true,
      format: (value: number) => value?.toFixed(2) || '0.00'
    },
    {
      id: 'actions',
      label: 'Action',
      sortable: false,
      searchable: false,
      format: (value: any, row: SurfaceTreatment) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
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

  const handleAddSurfaceTreatment = () => {
    openDialog("");
  };

  return (
    <Box>
      {status === 'loading' && (
        <Loader loading={status === 'loading'} />
      )}

      <EnhancedTable
        title="Surface Treatments"
        data={surfaceTreatments || []}
        columns={columns}
        {...((role === 'super-admin' || role === 'admin') && { add: () => handleAddSurfaceTreatment() })}
        // add={handleAddSurfaceTreatment}
        initialSortColumn="name"
        initialSortDirection="asc"
      />

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