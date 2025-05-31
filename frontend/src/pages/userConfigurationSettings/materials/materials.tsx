import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Checkbox,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { ExpandMore, Delete } from "@mui/icons-material";
import MaterialFormDialog from "./materialFormDialog";
import ImportMaterialDialog from "./importMaterialDialog";
import ConfirmDialog from "../../dashboard/ConfirmDialog/confirmDialog";
import AddMaterialDialog from "./addMaterialDialog";
import { FaEye } from "react-icons/fa";
import { TbEdit } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { addMaterial, deleteMaterial, fetchMaterialGroups, fetchMaterials, importMaterial, updateMaterial } from "@/redux/features/materials/materialsSlice";
import EnhancedTable from "@/components/table";

// Define the Material type if not already defined
interface Material {
  id: string;
  material_name: string;
  material_price_per_kg: number;
  active: boolean;
  material_group_id: string;
}

const Materials: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const role = useSelector((state: RootState) => state?.auth?.role);

  // Redux selectors
  const groupedMaterials = useSelector((state: RootState) => state.materials.groupedMaterials);
  const materialGroups = useSelector((state: RootState) => state.materials.groups);
  const status = useSelector((state: RootState) => state.materials.status);

  // Local state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState("");
  const [selectedMaterialId, setSelectedMaterialId] = useState<string | null>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    dispatch(fetchMaterialGroups());
    dispatch(fetchMaterials());
  }, [dispatch]);

  const openDialog = (type: string, materialId: string | null = null) => {
    setDialogType(type);
    setSelectedMaterialId(materialId);
    setIsDialogOpen(true);
  };

  const closeDialog = () => setIsDialogOpen(false);

  const handleSaveMaterial = async (material: Material) => {
    if (selectedMaterialId) {
      dispatch(updateMaterial({ id: selectedMaterialId, material }));
      dispatch(fetchMaterials()); // Fetch updated materials after update
    } else {
      dispatch(addMaterial(material));
    }
    closeDialog();
  };

  const handleImportMaterial = async (material: Material) => {
    dispatch(importMaterial(material.id));
    closeDialog();
  };

  const handleDelete = async () => {
    if (selectedMaterialId) {
      dispatch(deleteMaterial(selectedMaterialId));
    }
    setIsConfirmDialogOpen(false);
  };

  const openConfirmDialog = (materialId: string) => {
    setSelectedMaterialId(materialId);
    setIsConfirmDialogOpen(true);
  };

  const closeConfirmDialog = () => setIsConfirmDialogOpen(false);

  const handleView = (type: string, materialData: Material | null = null) => {
    navigate('/material', {
      state: {
        machineData: materialData,
        materialGroups: materialGroups,
        viewMode: type,
      },
    });
  };

  const toggleCheckbox = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const getSelectedMaterial = (): Material | undefined => {
    if (!selectedMaterialId) return undefined;
    return Object.values(groupedMaterials)
      .flat()
      .find(material => material.id === selectedMaterialId);
  };

  // Define columns for the EnhancedTable
  const getTableColumns = () => [
    {
      id: 'active',
      label: 'Active',
      sortable: false,
      searchable: false,
      format: (value: boolean, row: Material) => (
        <Checkbox
          checked={value}
          onChange={() => toggleCheckbox(row.id)}
        />
      )
    },
    {
      id: 'material_name',
      label: 'Name',
      sortable: true,
      searchable: true,
    },
    {
      id: 'material_price_per_kg',
      label: 'Price per KG',
      sortable: true,
      searchable: true,
      format: (value: number) => `$${value.toFixed(2)}`
    },
    {
      id: 'actions',
      label: 'Actions',
      sortable: false,
      searchable: false,
      format: (value: any, row: Material) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton
            sx={{ color: 'Green', height: '32px', width: '32px' }}
            onClick={() => handleView("view", row)}
            title="View"
          >
            <FaEye />
          </IconButton>
          {role == 'super-admin' || role == 'admin' ?
            (
              <>
                <IconButton
                  sx={{ color: '#0591FC', height: '32px', width: '32px' }}
                  onClick={() => handleView("edit", row)}
                  title="Edit"
                >
                  <TbEdit />
                </IconButton>
                <IconButton
                  sx={{ color: 'red', height: '32px', width: '32px' }}
                  onClick={() => openConfirmDialog(row.id)}
                  title="Delete"
                >
                  <Delete />
                </IconButton>
              </>) : null}
        </Box>
      )
    }
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography sx={{
          fontWeight: 600,
          fontSize: { xs: '20px', sm: '24px', md: '28px' },
          lineHeight: '33.89px'
        }} gutterBottom>
          Materials
        </Typography>
        {role === 'super-admin' || role === 'admin' ?
          <Button
            variant="contained"
            color="primary"
            onClick={() => openDialog("")}
          >
            Add Material
          </Button>
          : null}
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

      <Box sx={{ marginTop: "20px" }}>
        {Object.keys(groupedMaterials).map((category) => (
          <Accordion key={category} sx={{ boxShadow: 2, marginBottom: 2 }}>
            <AccordionSummary
              sx={{ backgroundColor: '#F9F9F9' }}
              expandIcon={<ExpandMore />}
            >
              <Typography sx={{
                fontWeight: 600,
                fontSize: '18px',
                lineHeight: '24px'
              }}>
                {category} ({groupedMaterials[category].length} items)
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ padding: 0 }}>
              <EnhancedTable
                title=""
                data={groupedMaterials[category]}
                columns={getTableColumns()}
                initialSortColumn="material_name"
                initialSortDirection="asc"
              />
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>

      {/* Dialogs remain the same */}
      {dialogType === "" && (
        <AddMaterialDialog
          open={isDialogOpen}
          onDrawerClose={closeDialog}
          onImportMaterial={() => openDialog("import")}
          onAddNewMaterial={() => openDialog("add")}
        />
      )}

      {dialogType === "import" && (
        <ImportMaterialDialog
          open={isDialogOpen}
          onDrawerClose={closeDialog}
          onImportMaterial={handleImportMaterial}
          materialGroups={materialGroups}
        />
      )}

      {(dialogType === "add" || dialogType === "edit") && (
        <MaterialFormDialog
          open={isDialogOpen}
          material={dialogType === "edit" ? getSelectedMaterial() : undefined}
          materialGroups={materialGroups}
          onDrawerClose={closeDialog}
          onSaveMaterial={handleSaveMaterial}
        />
      )}

      <ConfirmDialog
        open={isConfirmDialogOpen}
        onClose={closeConfirmDialog}
        onConfirm={handleDelete}
        title="Delete Material"
        message="Are you sure you want to delete this material?"
      />
    </Box>
  );
};

export default Materials;