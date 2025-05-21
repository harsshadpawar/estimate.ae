import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Checkbox,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  TableContainer,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  styled,
  tableCellClasses,
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

const Materials: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Redux selectors
  const groupedMaterials = useSelector((state:RootState) => state.materials.groupedMaterials);
  const materialGroups = useSelector((state:RootState) => state.materials.groups);
  const status = useSelector((state:RootState) => state.materials.status);



  
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

  // Define the Material type if not already defined
  interface Material {
    id: string;
    name: string;
    price_per_kg: number;
    active: boolean;
    material_group_id: string;
  }
  
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

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography sx={{ 
          fontWeight: 600,
          fontSize: { xs: '20px', sm: '24px', md: '28px' },
          lineHeight: '33.89px'
        }} gutterBottom>
          Materials
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => openDialog("")}
        >
          Add Material
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

      <div style={{ marginTop: "20px" }}>
        {Object.keys(groupedMaterials).map((category) => (
          <Accordion key={category} sx={{ boxShadow: 0, marginTop: 0 }}>
            <AccordionSummary sx={{ backgroundColor: '#F9F9F9' }} expandIcon={<ExpandMore />}>
              <Typography sx={{ fontWeight: 600, fontSize: '18px', lineHeight: '24px' }}>
                {category}
              </Typography>
            </AccordionSummary>
            <TableContainer sx={{ boxShadow: 0 }} component={Paper}>
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
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {groupedMaterials[category].map((material, index) => (
                    <StyledTableRow key={material.id}>
                      <StyledTableCell>
                        <Checkbox 
                          checked={material.active} 
                          onChange={() => toggleCheckbox(material.id)} 
                        />
                      </StyledTableCell>
                      <TableCell>{material.name}</TableCell>
                      <TableCell>{material.price_per_kg}</TableCell>
                      <TableCell>
                        <IconButton 
                          sx={{ color: 'Green', height: '12px' }}
                          onClick={() => handleView("view", material)}
                        >
                          <FaEye />
                        </IconButton>
                        <IconButton 
                          sx={{ color: '#0591FC', height: '12px' }}
                          onClick={() => handleView("edit", material)}
                        >
                          <TbEdit />
                        </IconButton>
                        <IconButton 
                          sx={{ color: 'red' }}
                          onClick={() => openConfirmDialog(material.id)}
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
        ))}
      </div>

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
