import React, { useState } from 'react';
import { Button, IconButton } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import SelectedFileList from '../SelectedFileList';
import Loader from '../Loader';

const FileUploader = ({ onUpload }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  // Handle file selection
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files); // Convert FileList to Array
    setSelectedFiles(files);
  };

  // Handle file removal
  const handleRemoveFile = (index) => {
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);
    setSelectedFiles(updatedFiles);
  };

  // Handle upload process
  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;
    setLoading(true);

    for (const file of selectedFiles) {
      try {
        await onUpload(file);
      } catch (error) {
        console.error('Upload failed:', error);
      }
    }

    setLoading(false);
    setSelectedFiles([]); // Clear after successful upload
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <input
        accept=".stp,.dwg,.dxf"
        style={{ display: 'none' }}
        id="upload-file"
        type="file"
        multiple
        onChange={handleFileChange}
      />
      <label htmlFor="upload-file">
        <IconButton color="primary" aria-label="upload file" component="span">
          <UploadFileIcon fontSize="large" />
        </IconButton>
      </label>

      <Button
        variant="contained"
        color="primary"
        onClick={handleUpload}
        disabled={selectedFiles.length === 0 || loading}
        style={{ marginLeft: '10px' }}
      >
        Upload
      </Button>

      <Loader loading={loading} />

      {/* Selected Files List */}
      {selectedFiles.length > 0 &&
        <SelectedFileList
          files={selectedFiles}
          onRemoveFile={handleRemoveFile}
        />
      }
    </div>
  );
};

export default FileUploader;
