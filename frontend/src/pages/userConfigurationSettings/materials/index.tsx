// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Button,
//   Typography,
//   Checkbox,
//   Accordion,
//   AccordionSummary,
//   AccordionDetails,
//   Paper,
//   TableContainer,
//   IconButton,
//   Table,
//   TableBody,
//   TableCell,
//   TableRow,
//   TableHead,
//   styled,
//   tableCellClasses,
//   Backdrop,
//   CircularProgress,
// } from "@mui/material";
// import { Edit, Delete, ExpandMore } from "@mui/icons-material";
// import MaterialFormDialog from "./MaterialFormDialog";
// import ImportMaterialDialog from "./importMaterialDialog";
// import ConfirmDialog from "../../dashboard/ConfirmDialog";
// import AddMaterialDialog from "./addMaterialDialog";
// import apiClient from "../../../services/interceptor";
// import "./material.css";
// import { FaEye } from "react-icons/fa";
// import { TbEdit } from "react-icons/tb";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";

// // Define type interfaces
// interface Material {
//   id: string;
//   name: string;
//   price_per_kg: number;
//   active: boolean;
//   material_group_id: string;
// }

// interface MaterialGroup {
//   id: string;
//   name: string;
// }
// const StyledTableCell = styled(TableCell)(({ theme }) => ({

//   [`&.${tableCellClasses.body}`]: {
//     fontWeight: 500,
//     fontSize: '15px',
//     lineHeight: '18.15px'
//   },
// }));
// const StyledTableRow = styled(TableRow)(({ theme }) => ({
//   height: '54px',
//   '&:nth-of-type(odd)': {
//     backgroundColor: '#EFF7FD',
//   },
//   '&:nth-of-type(even)': {
//     backgroundColor: '#FFFF',
//   },
//   // hide last border
//   '&:last-child td, &:last-child th': {
//     border: 0,
//   },
// }));
// const Materials: React.FC = () => {
//   const [materials, setMaterials] = useState<Material[]>([]);
//   const [materialGroups, setMaterialGroups] = useState<MaterialGroup[]>([]);
//   const [groupedMaterials, setGroupedMaterials] = useState<Record<string, Material[]>>({});
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [dialogType, setDialogType] = useState<string>("");
//   const [selectedMaterialId, setSelectedMaterialId] = useState<string | null>(null);
//   const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
//   const [selected, setSelected] = useState([]);
//   const navigate = useNavigate()
//   const [isLoading, setIsLoading] = useState(false); // Add loading state
//   // Fetch materials and material groups from the server
//   useEffect(() => {
//     setIsLoading(true)
//     init()
//     setIsLoading(false)

//   }, []);
//   function init() {
//     Promise.all([apiClient.get("/api/material"), apiClient.get("/api/material-group")])
//       .then(([materialResponse, groupResponse]) => {
//         const materials = materialResponse?.data?.data?.materials;
//         const materialGroups = groupResponse?.data?.data?.material_groups;
//         setMaterials(materials);
//         setMaterialGroups(materialGroups);
//         groupMaterialsByCategory(materials, materialGroups);
//         setIsLoading(false)

//       })
//       .catch((error) => {
//         setIsLoading(false)
//         console.error("Error fetching materials and material groups:", error);
//       });
//   }

//   // Group materials by category
//   const groupMaterialsByCategory = (materials: Material[], groups: MaterialGroup[]) => {
//     const grouped = materials.reduce<Record<string, Material[]>>((acc, material) => {
//       const category = groups.find((g) => g.id === material.material_group_id)?.name || "Uncategorized";
//       if (!acc[category]) acc[category] = [];
//       acc[category].push(material);
//       return acc;
//     }, {});
//     setGroupedMaterials(grouped);
//   };

//   // Dialog control handlers
//   const openDialog = (type: string, materialId: string | null = null) => {
//     setDialogType(type);
//     setSelectedMaterialId(materialId);
//     setIsDialogOpen(true);
//   };

//   const closeDialog = () => setIsDialogOpen(false);

//   // Add or edit material
//   const saveNewMaterial = async (newMaterial: Material) => {
//     setIsLoading(true)
//     closeDialog();
//     console.log("newMaterial", newMaterial)
//     console.log("materials", materials)
//     try {
//       if (materials.some((materials) => materials?.name === newMaterial?.name)) {
//         toast.warn("Machine already exists");
//         return;
//       }
//       if (selectedMaterialId) {
//         const response = await apiClient.put(`/api/material/${selectedMaterialId}`, newMaterial);
//         const updatedMaterial = response.data.material;
//         setMaterials((prev) =>
//           prev.map((material) => (material.id === selectedMaterialId ? updatedMaterial : material))
//         );

//       } else {
//         const response = await apiClient.post("/api/material", newMaterial);
//         setMaterials((prev) => [...prev, response.data.material]);
//       }
//       groupMaterialsByCategory(materials, materialGroups);
//       closeDialog();
//       toast.success('Saving a Material Succesfully')
//     } catch (error) {
//       toast.error('Failed to save the Material ');
//       console.error("Error saving material:", error);
//     }
//     finally {
//       setIsLoading(false)
//       init()
//     }
//   };

//   // Import material
//   const importMaterial = async (material: Material) => {
//     setIsLoading(true)
//     // closeDialog();

//     try {

//       const response = await apiClient.post(`/api/material/import/${material.id}`);
//       if (response.data.message == 'Material with this name already exists') {
//         toast.warn(response.data.message)
//         return
//       }
//       setMaterials((prev) => [...prev, response.data.material]);
//       groupMaterialsByCategory(materials, materialGroups);
//       // closeDialog();
//       toast.success('Import a Material Succesfully')

//     } catch (error) {
//       toast.error('Failed to Import new Material');
//       console.error("Error importing material:", error);
//     }
//     finally {
//       setIsLoading(false)
//       init()
//     }
//   };

//   // Delete material
//   const deleteMaterial = async () => {
//     setIsLoading(true)
//     setIsConfirmDialogOpen(false);
//     try {
//       if (selectedMaterialId) {
//         await apiClient.delete(`/api/material/${selectedMaterialId}`);
//         setMaterials((prev) => prev.filter((material) => material.id !== selectedMaterialId));
//         groupMaterialsByCategory(materials, materialGroups);
//         setIsConfirmDialogOpen(false);
//         toast.success('Deleting a Material Succesfully')


//       }
//     } catch (error) {
//       toast.error('Failed to Delete the Material');
//       console.error("Error deleting material:", error);
//     }
//     finally {
//       setIsLoading(false)
//       init()
//     }
//   };

//   // Confirm dialog handlers
//   const openConfirmDialog = (materialId: string) => {
//     setSelectedMaterialId(materialId);
//     setIsConfirmDialogOpen(true);
//   };
//   const handleView = (type, machineData = null) => {
//     navigate('/meterial', {
//       state: {
//         machineData: machineData,
//         materialGroups: materialGroups,
//         viewMode: type,
//       },
//     });
//   }
//   const closeConfirmDialog = () => setIsConfirmDialogOpen(false);

//   const getSelectedMaterial = (material: Material | undefined): Material | null => {
//     if (!material) return null;
//     const group = materialGroups.find((g) => g.id === material.material_group_id)?.name || "Uncategorized";
//     return { ...material, group };
//   };
//   const toggleCheckbox = (id: any) => {
//     setSelected((prev: any) =>
//       prev.includes(id) ? prev.filter((item: any) => item !== id) : [...prev, id]
//     );
//   };
//   return (
//     <Box >
//       <Box sx={{display:'flex',justifyContent:'space-between'}}>
//         <Typography sx={{ fontWeight: 600,fontSize: {xs:'20px',sm:'24px',md:'28px'},lineHeight: '33.89px', }} gutterBottom>
//           Materials
//         </Typography>
//         <Button variant="contained" color="primary" onClick={() => openDialog("")}>
//           Add Material
//         </Button>
//       </Box>
//       {isLoading && (
//         <Backdrop
//           sx={{
//             color: '#fff',
//             zIndex: (theme) => theme.zIndex.drawer + 1,
//           }}
//           open={isLoading}
//         >
//           <CircularProgress color="inherit" />
//         </Backdrop>
//       )}
//       <div style={{ marginTop: "20px" }}>
//         {Object.keys(groupedMaterials).map((category) => (
//           <Accordion key={category} sx={{ boxShadow: 0, marginTop: 0 }}>
//             <AccordionSummary sx={{ backgroundColor: '#F9F9F9' }} expandIcon={<ExpandMore />}>
//               <Typography sx={{ fontWeight: 600, fontSize: '18px', lineHeight: '24px' }}>{category}</Typography>
//             </AccordionSummary>
//             {/* <AccordionDetails> */}
//             <TableContainer sx={{ boxShadow: 0 }} component={Paper}>
//               <Table sx={{ borderTopLeftRadius: '20px', borderTopRightRadius: '20px', backgroundColor: '#0591FC', color: '#FFFF' }}>
//                 <TableHead>
//                   <TableRow>
//                     <TableCell sx={{ color: "white", fontWeight: "bold" }}>#</TableCell>
//                     {/* <TableCell sx={{ color: "white", fontWeight: "bold" }}>Active</TableCell> */}
//                     <TableCell sx={{ color: "white", fontWeight: "bold" }}>Name</TableCell>
//                     <TableCell sx={{ color: "white", fontWeight: "bold" }}>Price per KG</TableCell>
//                     <TableCell sx={{ color: "white", fontWeight: "bold" }}>Actions</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {groupedMaterials[category].map((material, index) => (
//                     <StyledTableRow key={material.id}>
//                       {/* <TableCell>{index + 1}</TableCell> */}
//                       <StyledTableCell>
//                         <Checkbox checked={material.active} onChange={() => toggleCheckbox(machine.id)} />
//                       </StyledTableCell>
//                       <TableCell>{material.name}</TableCell>
//                       <TableCell>{material.price_per_kg}</TableCell>
//                       <TableCell>
//                         <IconButton sx={{ color: 'Green', height: '12px' }}
//                           onClick={() => handleView("view", material)}
//                         >
//                           <FaEye />
//                         </IconButton>
//                         <IconButton sx={{ color: '#0591FC', height: '12px' }} onClick={() => handleView("edit", material)}>
//                           <TbEdit />
//                         </IconButton>
//                         <IconButton sx={{ color: 'red' }} onClick={() => openConfirmDialog(material.id)}>
//                           <Delete />
//                         </IconButton>
//                       </TableCell>
//                     </StyledTableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//             {/* </AccordionDetails> */}
//           </Accordion>
//         ))}
//       </div>
//       {dialogType === "" && (
//         <AddMaterialDialog
//           open={isDialogOpen}
//           onDrawerClose={closeDialog}
//           onImportMaterial={() => openDialog("import")}
//           onAddNewMaterial={() => openDialog("add")}
//         />
//       )}
//       {dialogType === "import" && (
//         <ImportMaterialDialog open={isDialogOpen} onDrawerClose={closeDialog} onImportMaterial={importMaterial} materialGroups={materialGroups} />
//       )}
//       {(dialogType === "add" || dialogType === "edit") && (
//         <MaterialFormDialog
//           open={isDialogOpen}
//           material={dialogType === "edit" ? getSelectedMaterial(materials.find((m) => m.id === selectedMaterialId)) : undefined}
//           materialGroups={materialGroups}
//           onDrawerClose={closeDialog}
//           onSaveMaterial={saveNewMaterial}
//         />
//       )}
//       <ConfirmDialog
//         open={isConfirmDialogOpen}
//         onClose={closeConfirmDialog}
//         onConfirm={deleteMaterial}
//         title="Delete Material"
//         message="Are you sure you want to delete this material?"
//       />
//     </Box>
//   );
// };

// export default Materials;



// components/Materials/Materials.tsx
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
import MaterialFormDialog from "./MaterialFormDialog";
import ImportMaterialDialog from "./importMaterialDialog";
import ConfirmDialog from "../../dashboard/ConfirmDialog";
import AddMaterialDialog from "./addMaterialDialog";
import { FaEye } from "react-icons/fa";
import { TbEdit } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store";
import { addMaterial, deleteMaterial, fetchMaterialGroups, fetchMaterials, importMaterial, updateMaterial } from "../../../redux/features/materials/materialsSlice";

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
