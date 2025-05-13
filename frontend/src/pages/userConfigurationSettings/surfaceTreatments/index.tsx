// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Button,
//   Typography,
//   Checkbox,
//   Table,
//   TableBody,
//   TableCell,
//   TableRow,
//   TableHead,
//   IconButton,
//   styled,
//   tableCellClasses,
//   Backdrop,
//   CircularProgress,
// } from "@mui/material";
// import { Edit, Delete } from "@mui/icons-material";
// import ConfirmDialog from "../../dashboard/ConfirmDialog";
// import AddSurfaceTreatmentDialog from "./addSurfaceTreatmentDialog";
// import ImportSurfaceTreatmentDialog from "./importSurfaceTreatmentDialog";
// import AddNewSurfaceTreatmentDialog from "./addNewSurfaceTreatmentDialog";
// import apiClient from "../../../services/interceptor";
// import "./surfaceTreatments.css";
// import { useNavigate } from "react-router-dom";
// import { FaEye } from "react-icons/fa";
// import { TbEdit } from "react-icons/tb";
// import { toast } from "react-toastify";

// // Type Definitions
// interface SurfaceTreatment {
//   id: string;
//   active: boolean;
//   name: string;
//   price_per_kg: number;
//   surface_price:number;
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
// const SurfaceTreatments: React.FC = () => {
//   const [surfaceTreatments, setSurfaceTreatments] = useState<SurfaceTreatment[]>([]);
//   const [materialGroups, setMaterialGroups] = useState<MaterialGroup[]>([]);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [dialogType, setDialogType] = useState<string>("");
//   const [isLoading, setIsLoading] = useState(false); // Add loading state
//   const [selectedSurfaceTreatmentId, setSelectedSurfaceTreatmentId] = useState<string | null>(null);
//   const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
//   const [selected, setSelected] = useState([]);
//   const navigate = useNavigate()
//   // Fetch surface treatments and material groups from the server
//   useEffect(() => {
//     setIsLoading(true)
//     Promise.all([
//       apiClient.get("/api/surface-treatment"),
//       apiClient.get("/api/material-group"),
//     ])
//       .then(([surfaceTreatmentResponse, materialGroupResponse]) => {
//         setSurfaceTreatments(surfaceTreatmentResponse?.data?.data?.surface_treatments);
//         setMaterialGroups(materialGroupResponse?.data?.data?.material_groups);
//         // finally {
//         setIsLoading(false)
//         // }
//       })
//       .catch((error) => {
//         // finally {
//         setIsLoading(false)
//         // }
//         console.error("Error fetching surface treatments or material groups:", error);
//       });
//   }, []);

//   // Dialog control handlers
//   const openDialog = (type: string, surfaceTreatmentId: string | null = null) => {
//     setDialogType(type);
//     setSelectedSurfaceTreatmentId(surfaceTreatmentId);
//     setIsDialogOpen(true);
//   };
//   const handleView = (type, machineData = null) => {
//     navigate('/surface', {
//       state: {
//         machineData: machineData,
//         materialGroups: materialGroups,
//         viewMode: type,
//       },
//     });
//   }
//   const closeDialog = () => {
//     setIsDialogOpen(false);
//   };

//   // Add or edit surface treatment
//   const saveNewSurfaceTreatment = async (newSurfaceTreatment: SurfaceTreatment) => {
//     setIsLoading(true)
//     closeDialog();
//     try {
//       if (surfaceTreatments.some((surfaceTreatments) => surfaceTreatments?.name === newSurfaceTreatment?.name)) {
//         toast.warn("Machine already exists");
//         return;
//       }
//       if (newSurfaceTreatment.price_per_kg == 0) {
//         toast.warn("Please add Price Per kg");
//         return;
//       }
//       if (selectedSurfaceTreatmentId) {
//         const response = await apiClient.put(
//           `/api/surface-treatment/${selectedSurfaceTreatmentId}`,
//           newSurfaceTreatment
//         );
//         const updatedSurfaceTreatment = response.data.surface_treatment;
//         setSurfaceTreatments((prev) =>
//           prev.map((st) => (st.id === selectedSurfaceTreatmentId ? updatedSurfaceTreatment : st))
//         );
//       } else {
//         const response = await apiClient.post("/api/surface-treatment", newSurfaceTreatment);
//         setSurfaceTreatments((prev) => [...prev, response.data.surface_treatment]);
//       }
//       toast.success('Saving a SurfaceTreatment Succesfully')
//       closeDialog();
//     } catch (error) {
//       toast.error('Failed to save the SurfaceTreatment. ');
//       console.error("Error saving surface treatment:", error);
//     }
//     finally {
//       setIsLoading(false)
//     }
//   };

//   // Import surface treatment
//   const importSurfaceTreatment = async (surfaceTreatment: SurfaceTreatment) => {
//     setIsLoading(true)
//     closeDialog();
//     console.log("surfaceTreatment", surfaceTreatment)
//     console.log("allsurfaceTreatment", surfaceTreatments)
//     try {
//       if (surfaceTreatments.some((surfaceTreatments) => surfaceTreatments?.name === surfaceTreatment?.name)) {
//         toast.warn("Machine already exists");
//         return;
//       }
//       const response = await apiClient.post(
//         `/api/surface-treatment/import/${surfaceTreatment.id}`
//       );
//       setSurfaceTreatments((prev) => [...prev, response.data.surface_treatment]);
//       closeDialog();
//       toast.success(' import a new SurfaceTreatment Succesfully')
//       navigate('/user-configuration')
//     } catch (error) {
//       toast.error('Failed to import the SurfaceTreatment.');
//       console.error("Error importing surface treatment:", error);
//     }
//     finally {
//       setIsLoading(false)
//     }
//   };

//   // Delete surface treatment
//   const deleteSurfaceTreatment = async () => {
//     setIsLoading(true)
//     try {
//       if (selectedSurfaceTreatmentId) {
//         await apiClient.delete(`/api/surface-treatment/${selectedSurfaceTreatmentId}`);
//         setSurfaceTreatments((prev) =>
//           prev.filter((st) => st.id !== selectedSurfaceTreatmentId)
//         );
//         setIsConfirmDialogOpen(false);
//         toast.success('Deleting  a SurfaceTreatment Succesfully')
//       }
//     } catch (error) {
//       toast.error('Failed to delete the SurfaceTreatment');
//       console.error("Error deleting surface treatment:", error);
//     }
//     finally {
//       setIsLoading(false)
//     }
//   };

//   // Confirm dialog handlers
//   const openConfirmDialog = (surfaceTreatmentId: string) => {
//     setSelectedSurfaceTreatmentId(surfaceTreatmentId);
//     setIsConfirmDialogOpen(true);
//   };

//   const closeConfirmDialog = () => {
//     setIsConfirmDialogOpen(false);
//   };
//   const toggleCheckbox = (id: any) => {
//     setSelected((prev: any) =>
//       prev.includes(id) ? prev.filter((item: any) => item !== id) : [...prev, id]
//     );
//   };
//   return (
//     <Box >
//       <Box sx={{ display: 'flex', justifyContent: 'space-between' ,my:{xs:3,sm:1}}}>
//         <Typography sx={{ fontWeight: 600,fontSize: { xs: '20px', sm: '24px', md: '28px' },lineHeight: '33.89px', }} gutterBottom>
//           Surface Treatments
//         </Typography>
//         <Button variant="contained" color="primary" onClick={() => openDialog("")}>
//           Add Surface Treatment
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
//       <Table sx={{ borderTopLeftRadius: '20px', borderTopRightRadius: '20px', backgroundColor: '#0591FC', color: '#FFFF' }}>
//         <TableHead>
//           <TableRow>
//             <TableCell sx={{ color: "white", fontWeight: "bold" }}>#</TableCell>
//             {/* <TableCell sx={{ color: "white", fontWeight: "bold" }}>Active Flag</TableCell> */}
//             <TableCell sx={{ color: "white", fontWeight: "bold" }}>Name</TableCell>
//             <TableCell sx={{ color: "white", fontWeight: "bold" }}>Price per KG</TableCell>
//             <TableCell sx={{ color: "white", fontWeight: "bold" }}>Surface Price</TableCell>
//             <TableCell sx={{ color: "white", fontWeight: "bold" }}>Action</TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {/*.filter(surfaceTreatment => surfaceTreatment.price_per_kg !== 0)*/}
//           {surfaceTreatments
//             .map((surfaceTreatment, index) => (
//               <StyledTableRow key={surfaceTreatment.id}>
//                 {/* <TableCell>{index + 1}</TableCell> */}
//                 <StyledTableCell>
//                   <Checkbox checked={surfaceTreatment.active} onChange={() => toggleCheckbox(surfaceTreatment.id)} />
//                 </StyledTableCell>
//                 <TableCell>{surfaceTreatment.name}</TableCell>
//                 <TableCell>{surfaceTreatment.price_per_kg}</TableCell>
//                 <TableCell>{surfaceTreatment.surface_price}</TableCell>
//                 <TableCell>
//                   <IconButton sx={{ color: 'Green', height: '12px' }}
//                     onClick={() => handleView("view", surfaceTreatment)}
//                   >
//                     <FaEye />
//                   </IconButton >
//                   <IconButton sx={{ color: '#0591FC', height: '12px' }} onClick={() => handleView("edit", surfaceTreatment)}>
//                     <TbEdit />
//                   </IconButton>
//                   <IconButton sx={{ color: 'red' }} onClick={() => openConfirmDialog(surfaceTreatment.id)}>
//                     <Delete />
//                   </IconButton>
//                 </TableCell>
//               </StyledTableRow>
//             ))}
//         </TableBody>
//       </Table>

//       {/* Dialog Components */}
//       {dialogType === "" && (
//         <AddSurfaceTreatmentDialog
//           open={isDialogOpen}
//           onDrawerClose={closeDialog}
//           onImportSurfaceTreatment={() => openDialog("import")}
//           onAddNewSurfaceTreatment={() => openDialog("add")}
//         />
//       )}
//       {dialogType === "import" && (
//         <ImportSurfaceTreatmentDialog
//           open={isDialogOpen}
//           onDrawerClose={closeDialog}
//           onImportSurfaceTreatment={importSurfaceTreatment}
//         />
//       )}
//       {(dialogType === "add" || dialogType === "edit") && (
//         <AddNewSurfaceTreatmentDialog
//           open={isDialogOpen}
//           surfaceTreatment={
//             dialogType === "edit"
//               ? surfaceTreatments.find((st) => st.id === selectedSurfaceTreatmentId) || null
//               : null
//           }
//           materialGroups={materialGroups}
//           onDialogClose={closeDialog}
//           onSaveSurfaceTreatment={saveNewSurfaceTreatment}
//         />
//       )}

//       {/* Confirm Dialog */}
//       <ConfirmDialog
//         open={isConfirmDialogOpen}
//         onClose={closeConfirmDialog}
//         onConfirm={deleteSurfaceTreatment}
//         title="Delete Surface Treatment"
//         message="Are you sure you want to delete this surface treatment?"
//       />
//     </Box>
//   );
// };

// export default SurfaceTreatments;



// components/SurfaceTreatments/SurfaceTreatments.tsx
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
import ConfirmDialog from "../../dashboard/ConfirmDialog";
import AddSurfaceTreatmentDialog from "./addSurfaceTreatmentDialog";
import ImportSurfaceTreatmentDialog from "./importSurfaceTreatmentDialog";
import AddNewSurfaceTreatmentDialog from "./addNewSurfaceTreatmentDialog";
import "./surfaceTreatments.css";
import { useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { TbEdit } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";

import { addSurfaceTreatment, deleteSurfaceTreatment, fetchSurfaceTreatments, importSurfaceTreatment, updateSurfaceTreatment } from "../../../redux/features/surfaceTreatments/surfaceTreatmentsSlice";
import { fetchMaterialGroups } from "../../../redux/features/materials/materialsSlice";
import { RootState } from "../../../redux/store/store";
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