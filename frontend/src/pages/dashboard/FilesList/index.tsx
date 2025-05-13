import React, { useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ConfirmDialog from '../ConfirmDialog'; 
import Toaster from '../../../components/toaster/';
import apiClient from '../../../services/interceptor';


const FilesList = ({ files, onMetadataClick, onViewCadClick }) => {

  const [ displayFiles, setDisplayFiles ] = React.useState(files);
  const [ snackbarOpen, setSnackbarOpen ] = React.useState(false);
  const [ snackbarMessage, setSnackbarMessage ] = React.useState('');
  const [ isConfirmed, setIsConfirmed ] = React.useState(false);
  const [ deleteFileId, setDeleteFileId ] = React.useState(null);

  const showDeleteConfirmationDialog = (fileId) => {
    setDeleteFileId(fileId);
    setIsConfirmed(true);
    if (isConfirmed) {
      handleDeleteFile(fileId);
    }
  };

  const handleDeleteFile = async () => {
    try {
      const fileId = deleteFileId;
      const response = await apiClient.delete(`/api/cad/file/${fileId}`);

      if ((response.status === 200 || response.status === 204)) {
        setDisplayFiles(displayFiles.filter((file) => file.file_id !== fileId));
        setSnackbarOpen(true);
        setSnackbarMessage('File deleted successfully!');
      } else {
        const errorData = await response.json();
        console.error('Error deleting file:', errorData);
        setSnackbarOpen(true);
        setSnackbarMessage('An error occurred. Please try again.');
      }
      setIsConfirmed(false);
    } catch (error) {
      console.error('Error deleting file:', error);
      setSnackbarOpen(true);
      setSnackbarMessage('An error occurred. Please try again.');
    }
  };

  useEffect(() => {
    setDisplayFiles(files);
  }, [files]);

  return (
    <React.Fragment>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>File Name</TableCell>
              <TableCell>View Dimensions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayFiles.map((file) => (
              <TableRow key={file.id} hover>
                <TableCell>{file.file_name}</TableCell>
                <TableCell>
                  <Button variant="contained" color="secondary" onClick={() => onViewCadClick(file.file_id)}>
                    View Dimensions
                  </Button>
                </TableCell>
                <TableCell>
                  <IconButton edge="end" aria-label="delete" onClick={() => showDeleteConfirmationDialog(file.file_id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Toaster open={snackbarOpen} onClose={() => setSnackbarOpen(false)} message={snackbarMessage} />
      <ConfirmDialog
        open={isConfirmed}
        onClose={() => setIsConfirmed(false)}
        onConfirm={handleDeleteFile}
        title="Delete File"
        message="Are you sure you want to delete this file?"
      />
    </React.Fragment>
  );
};

export default FilesList;
