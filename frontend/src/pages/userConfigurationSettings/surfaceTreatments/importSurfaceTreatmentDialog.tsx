// import React, { useState, useEffect } from "react";
// import {
//   Drawer,
//   Box,
//   Table,
//   TableBody,
//   TableRow,
//   TableCell,
//   TableHead,
//   Typography,
//   IconButton,
// } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
// import apiClient from "../../../services/interceptor";
// import CustomTablePagination from "../customTablePagination";
// import BoldTableCell from "../boldTableCell";
// import "./surfaceTreatments.css";

// // Define the types for props
// interface SurfaceTreatment {
//   id: number;
//   name: string;
//   price_per_kg: number;
//   surface_price: number;
// }

// interface ImportSurfaceTreatmentDrawerProps {
//   open: boolean;
//   onDrawerClose: () => void;
//   onImportSurfaceTreatment: (surfaceTreatment: SurfaceTreatment) => void | Promise<void>;
// }

// const ImportSurfaceTreatmentDrawer: React.FC<ImportSurfaceTreatmentDrawerProps> = ({
//   open,
//   onDrawerClose,
//   onImportSurfaceTreatment,
// }) => {
//   const [defaultSurfaceTreatments, setDefaultSurfaceTreatments] = useState<SurfaceTreatment[]>([]);
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [totalSurfaceTreatments, setTotalSurfaceTreatments] = useState(0);

//   const fetchSurfaceTreatments = (page: number, rowsPerPage: number) => {
//     apiClient
//       .get("/api/default-surface-treatment", {
//         params: { page: page + 1, size: rowsPerPage },
//       })
//       .then((response) => {
//         console.log("setTotalSurfaceTreatments", response.data.total);
//         setDefaultSurfaceTreatments(response?.data?.data?.treatments);
//         setTotalSurfaceTreatments(response?.data?.data?.total);
//       })
//       .catch((error) => {
//         console.error("Error fetching default surface treatments:", error);
//       });
//   };

//   useEffect(() => {
//     if (open) {
//       fetchSurfaceTreatments(page, rowsPerPage);
//     }
//   }, [open, page, rowsPerPage]);

//   const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0); // Reset to first page when rows per page changes
//   };

//   return (
//     <Drawer anchor="right" open={open} onClose={onDrawerClose}>
//       <Box
//         sx={{
//           width: 400,
//           padding: 2,
//           display: "flex",
//           flexDirection: "column",
//           gap: 2,
//           height: "100%",
//         }}
//       >
//         {/* Header with Close Button */}
//         <Box display="flex" justifyContent="space-between" alignItems="center">
//           <Typography variant="h6">Select a Default Surface Treatment</Typography>
//           <IconButton onClick={onDrawerClose}>
//             <CloseIcon />
//           </IconButton>
//         </Box>

//         {/* Content */}
//         {defaultSurfaceTreatments.length === 0 ? (
//           <Box textAlign="center" mt={2}>
//             <Typography variant="body1" color="textSecondary">
//               No surface treatments available.
//             </Typography>
//           </Box>
//         ) : (
//           <>
//             <Box className="import-surface-treatment-table" sx={{ flexGrow: 1, overflow: "auto" }}>
//               <Table>
//                 <TableHead className="import-machine-table-header">
//                   <TableRow>
//                     <BoldTableCell>
//                       <Typography variant="h6">Surface Treatment</Typography>
//                     </BoldTableCell>
//                     <BoldTableCell align="right">
//                       <Typography variant="h6">Price per kg</Typography>
//                     </BoldTableCell>
//                     <BoldTableCell align="right">
//                       <Typography variant="h6">Surface Price</Typography>
//                     </BoldTableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {defaultSurfaceTreatments.map((st) => (
//                     <TableRow
//                       key={st.id}
//                       onClick={() => onImportSurfaceTreatment(st)}
//                       sx={{ cursor: "pointer" }}
//                     >
//                       <TableCell>{st.name}</TableCell>
//                       <TableCell align="right">{st.price_per_kg}</TableCell>
//                       <TableCell align="right">{st.surface_price}</TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </Box>
//             <CustomTablePagination
//               totalItems={totalSurfaceTreatments}
//               page={page}
//               onPageChange={handleChangePage}
//               rowsPerPage={rowsPerPage}
//               onRowsPerPageChange={handleChangeRowsPerPage}
//             />
//           </>
//         )}
//       </Box>
//     </Drawer>
//   );
// };

// export default ImportSurfaceTreatmentDrawer;


// components/SurfaceTreatments/ImportSurfaceTreatmentDrawer.tsx
import React, { useEffect } from "react";
import {
  Drawer,
  Box,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  Typography,
  IconButton,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../../../redux/store/store";
import { fetchDefaultSurfaceTreatments, setPage, setRowsPerPage } from "../../../redux/features/surfaceTreatments/surfaceTreatmentsSlice";
import "./surfaceTreatments.css";

// Assuming these components exist in your project
import CustomTablePagination from "../customTablePagination";
import BoldTableCell from "../boldTableCell";

interface SurfaceTreatment {
  id: string;
  name: string;
  price_per_kg: number;
  surface_price: number;
  active: boolean;
}

interface ImportSurfaceTreatmentDialogProps {
  open: boolean;
  onDrawerClose: () => void;
  onImportSurfaceTreatment: (surfaceTreatment: SurfaceTreatment) => void | Promise<void>;
}

const ImportSurfaceTreatmentDialog: React.FC<ImportSurfaceTreatmentDialogProps> = ({
  open,
  onDrawerClose,
  onImportSurfaceTreatment,
}) => {
  const dispatch = useDispatch();
  
  // Redux selectors
  const treatments = useSelector((state: RootState) => state.surfaceTreatments.treatments);
  const status = useSelector((state: RootState) => state.surfaceTreatments.status);
  const pagination = useSelector((state: RootState) => state.surfaceTreatments.pagination);

  useEffect(() => {
    if (open) {
      dispatch(fetchDefaultSurfaceTreatments());
    }
  }, [open, dispatch]);

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    dispatch(setPage(newPage));
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setRowsPerPage(parseInt(event.target.value, 10)));
    dispatch(setPage(0));
  };

  return (
    <Drawer anchor="right" open={open} onClose={onDrawerClose}>
      <Box
        sx={{
          width: 600,
          padding: 3,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          height: "100%",
        }}
      >
        {/* Header with Close Button */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Select a Surface Treatment to Import</Typography>
          <IconButton onClick={onDrawerClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Content */}
        {status === 'loading' ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="200px">
            <CircularProgress />
          </Box>
        ) : treatments.length === 0 ? (
          <Box textAlign="center" mt={4}>
            <Typography variant="body1" color="textSecondary">
              No surface treatments available to import.
            </Typography>
          </Box>
        ) : (
          <>
            <Box className="import-surface-treatment-table" sx={{ flexGrow: 1, overflow: "auto" }}>
              <Table>
                <TableHead className="import-machine-table-header">
                  <TableRow>
                    <BoldTableCell>Surface Treatment</BoldTableCell>
                    <BoldTableCell align="right">Price per kg</BoldTableCell>
                    <BoldTableCell align="right">Surface Price</BoldTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {treatments.map((treatment) => (
                    <TableRow
                      key={treatment.id}
                      onClick={() => onImportSurfaceTreatment(treatment)}
                      sx={{ 
                        cursor: "pointer",
                        '&:hover': {
                          backgroundColor: 'rgba(5, 145, 252, 0.08)',
                        }
                      }}
                    >
                      <TableCell>{treatment.name}</TableCell>
                      <TableCell align="right">{treatment.price_per_kg}</TableCell>
                      <TableCell align="right">{treatment.surface_price}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
            <CustomTablePagination
              totalItems={pagination.total}
              page={pagination.page}
              onPageChange={handleChangePage}
              rowsPerPage={pagination.rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
      </Box>
    </Drawer>
  );
};

export default ImportSurfaceTreatmentDialog;