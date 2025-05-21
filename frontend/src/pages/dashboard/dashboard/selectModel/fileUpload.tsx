import React, { useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    styled,
    IconButton
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const UploadBox = styled(Paper)(({ theme }) => ({
    border: `1px dashed ${theme.palette.divider}`,
    display: 'flex',
    justifyContent: 'center',    // Center vertically
    alignItems: 'center',        // Center horizontally
    flexDirection: 'row',        // Stack icon and text vertically
    borderRadius: '20px',
    padding: theme.spacing(4),
    cursor: 'pointer',
    backgroundColor: theme.palette.background.default,
    transition: 'all 0.3s ease',
    textAlign: 'center',         // Center text inside
    // height: '250px',           // Optional: give it some height
    '&:hover': {
        borderColor: theme.palette.primary.main,
    }
}));

const HiddenInput = styled('input')({
    display: 'none',
});

const FileUpload = ({ onFileSelect }: any) => {
    const [fileName, setFileName] = useState('');
    const [dragOver, setDragOver] = useState(false);

    const handleFileChange = (event: any) => {
        const file = event.target.files[0];
        if (file && file.name.toLowerCase().endsWith('.zip')) {
            if (file.size <= 10 * 1024 * 1024) { // 10MB max
                setFileName(file.name);
                if (onFileSelect) onFileSelect(file);
            } else {
                alert('File size exceeds 10MB limit');
            }
        } else {
            alert('Please select a valid .zip file');
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = () => {
        setDragOver(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragOver(false);
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            if (file.name.toLowerCase().endsWith('.zip')) {
                if (file.size <= 10 * 1024 * 1024) { // 10MB max
                    setFileName(file.name);
                    if (onFileSelect) onFileSelect(file);
                } else {
                    alert('File size exceeds 10MB limit');
                }
            } else {
                alert('Please drop a valid .zip file');
            }
        }
    };

    return (
        <Box sx={{
            width: '100%',
            height: '100%',
            borderRadius: '8px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: "center"
        }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}>
            <HiddenInput
                accept=".zip"
                id="file-upload"
                type="file"
                onChange={handleFileChange}
            />
            <Box>
                <label htmlFor="file-upload" style={{ width: '100%', height: '100%' }}>
                    <UploadBox>
                        <IconButton component="span" sx={{ mb: 1 }}>
                            <CloudUploadIcon fontSize="large" />
                        </IconButton>
                        <Typography variant="body1" sx={{ textAlign: 'center' }} gutterBottom>
                            Drag & drop or choose your zip file to upload here.
                        </Typography>
                        {fileName && (
                            <Typography variant="body2" color="primary">
                                Selected: {fileName}
                            </Typography>
                        )}
                    </UploadBox>
                </label>
            </Box>
            <Box sx={{ mt: 1, textAlign: "center" }}>
                <Typography variant="caption" color="textSecondary">
                    *Accepted files: .zip
                </Typography>
                <br />
                <Typography variant="caption" color="textSecondary">
                    *Maximum file size: 10MB
                </Typography>
            </Box>
        </Box>
    );
};

export default FileUpload;
