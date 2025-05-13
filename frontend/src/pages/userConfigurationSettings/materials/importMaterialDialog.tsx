import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import apiClient from "../../../services/interceptor";
import CustomTablePagination from "../customTablePagination";
import BoldTableCell from "../boldTableCell";
import "./material.css";

// Define Material type
interface Material {
  id: number;
  name: string;
  price_per_kg: number;
  material_group_id: number;
}

// Define props for ImportMaterialDrawer
interface ImportMaterialDrawerProps {
  open: boolean;
  onDrawerClose: () => void;
  onImportMaterial: (material: Material) => void;
  materialGroups: any;
}

const ImportMaterialDrawer: React.FC<ImportMaterialDrawerProps> = ({
  open,
  onDrawerClose,
  onImportMaterial,
  materialGroups,
}) => {
  const [defaultMaterials, setDefaultMaterials] = useState<Material[]>([]);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [totalMaterials, setTotalMaterials] = useState<number>(0);

  const fetchMaterials = (page: number, rowsPerPage: number) => {
    apiClient
      .get("/api/default-material", {
        params: { page: page + 1, size: rowsPerPage },
      })
      .then((response) => {
        setDefaultMaterials(response?.data?.data?.materials); // Assuming API response includes `materials`
        setTotalMaterials(response?.data?.data?.total); // Assuming API response includes `total`
      })
      .catch((error) => {
        console.error("Error fetching default materials:", error);
      });
  };

  useEffect(() => {
    if (open) {
      fetchMaterials(page, rowsPerPage);
    }
  }, [open, page, rowsPerPage]);

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to the first page when rows per page changes
  };

  return (
    <Drawer anchor="right" open={open} onClose={onDrawerClose}>
      <Box
        sx={{
          width: 400,
          padding: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          height: "100%",
        }}
      >
        {/* Header with Close Button */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Select a Default Material</Typography>
          <IconButton onClick={onDrawerClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Content */}
        {defaultMaterials.length === 0 ? (
          <Box textAlign="center" mt={2}>
            <Typography variant="body1" color="textSecondary">
              No materials available.
            </Typography>
          </Box>
        ) : (
          <>
            <Box className="import-material-table" sx={{ flexGrow: 1, overflow: "auto" }}>
              <Table stickyHeader>
                <TableHead className="import-machine-table-header">
                  <TableRow>
                    <BoldTableCell>
                      <Typography variant="h6">Material</Typography>
                    </BoldTableCell>
                    <BoldTableCell>
                      <Typography variant="h6">Material Group Name</Typography>
                    </BoldTableCell>
                    <BoldTableCell align="right">
                      <Typography variant="h6">Rate per kg</Typography>
                    </BoldTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {defaultMaterials.map((material) => {
                    // Find the material group name using the material_group_id
                    const materialGroup = materialGroups.find(
                      (group) => group.id === material.material_group_id
                    );
                    const materialGroupName = materialGroup
                      ? materialGroup.name
                      : "Unknown"; // Default to "Unknown" if not found
                    return (
                      <TableRow
                        key={material.id}
                        onClick={() => onImportMaterial(material)}
                        sx={{ cursor: "pointer" }}
                      >
                        <TableCell>{material.name}</TableCell>
                        <TableCell>{materialGroupName}</TableCell> {/* Display material group name */}
                        <TableCell align="right">{material.price_per_kg}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Box>
            <CustomTablePagination
              totalMachines={totalMaterials} // Rename if required in CustomTablePagination
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
      </Box>
    </Drawer>
  );
};

export default ImportMaterialDrawer;