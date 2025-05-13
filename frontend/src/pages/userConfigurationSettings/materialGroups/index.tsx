// components/MaterialGroups/MaterialGroups.tsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  TablePagination,
  styled,
  tableCellClasses,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { FaEye } from "react-icons/fa";
import { TbEdit } from "react-icons/tb";
import { Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store";
import { deleteMaterialGroup, fetchPaginatedMaterialGroups, setPage, setRowsPerPage } from "../../../redux/features/materials/materialsSlice";

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

const MaterialGroups = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Redux selectors
  const materialGroups = useSelector((state:RootState) => state.materials.groups);
  const pagination = useSelector((state:RootState) => state.materials.pagination);
  const status = useSelector((state:RootState) => state.materials.status);
  
  // Local state
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [selectedMaterialGroup, setSelectedMaterialGroup] = useState<string | null>(null);
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    dispatch(fetchPaginatedMaterialGroups({
      page: pagination.page,
      rowsPerPage: pagination.rowsPerPage
    }));
  }, [dispatch, pagination.page, pagination.rowsPerPage]);

  const handleChangePage = (event: unknown, newPage: number) => {
    dispatch(setPage(newPage));
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setRowsPerPage(parseInt(event.target.value, 10)));
    dispatch(setPage(0));
  };

  const toggleCheckbox = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleView = (type: string, groupData: any = null) => {
    navigate('/material-group', {
      state: {
        machineData: groupData,
        viewMode: type,
      },
    });
  };

  const openConfirmDialog = (id: string) => {
    setSelectedMaterialGroup(id);
    setIsConfirmDialogOpen(true);
  };

  const closeConfirmDialog = () => {
    setSelectedMaterialGroup(null);
    setIsConfirmDialogOpen(false);
  };

  const handleDelete = async () => {
    if (selectedMaterialGroup) {
      dispatch(deleteMaterialGroup(selectedMaterialGroup));
    }
    closeConfirmDialog();
  };

  return (
    <Box>
      <Typography sx={{ 
        fontWeight: 600, 
        fontSize: { xs: '20px', sm: '24px', md: '28px' }, 
        lineHeight: '33.89px' 
      }} gutterBottom>
        Material Groups
      </Typography>
      
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
            <TableCell sx={{ color: "white", fontWeight: "bold", display: { xs: 'none', sm: 'block' } }}>Abbreviation</TableCell>
            <TableCell sx={{ color: "white", fontWeight: "bold" }}>Price</TableCell>
            <TableCell sx={{ color: "white", fontWeight: "bold" }}>Density</TableCell>
            <TableCell sx={{ color: "white", fontWeight: "bold", display: { xs: 'none', sm: 'block' } }}>Co2 Emission</TableCell>
            <TableCell sx={{ color: "white", fontWeight: "bold" }}>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {materialGroups.map((group, index) => (
            <StyledTableRow key={group.id}>
              <StyledTableCell>
                {pagination.page * pagination.rowsPerPage + index + 1}
              </StyledTableCell>
              <TableCell>{group.name}</TableCell>
              <TableCell sx={{ display: { xs: 'none', sm: 'block' } }}>
                {group.abbreviation}
              </TableCell>
              <TableCell>{group.price}</TableCell>
              <TableCell>{group.density}</TableCell>
              <TableCell sx={{ display: { xs: 'none', sm: 'block' } }}>
                {group.co2_emission}
              </TableCell>
              <TableCell>
                <IconButton 
                  sx={{ color: 'Green', height: '12px' }}
                  onClick={() => handleView("view", group)}
                >
                  <FaEye />
                </IconButton>
                <IconButton 
                  sx={{ color: '#0591FC', height: '12px' }}
                  onClick={() => handleView("edit", group)}
                >
                  <TbEdit />
                </IconButton>
                <IconButton 
                  sx={{ color: 'red' }}
                  onClick={() => openConfirmDialog(group.id)}
                >
                  <Delete />
                </IconButton>
              </TableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
      
      <TablePagination
        component="div"
        count={pagination.total}
        page={pagination.page}
        onPageChange={handleChangePage}
        rowsPerPage={pagination.rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
      
      {/* Confirmation Dialog */}
      <Dialog open={isConfirmDialogOpen} onClose={closeConfirmDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this material group?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeConfirmDialog}>Cancel</Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      
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
    </Box>
  );
};

export default MaterialGroups;