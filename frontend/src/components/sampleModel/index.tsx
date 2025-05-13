import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import './sampleModel.css';

const SampleModel = ({ name }) => {
    const handleClick = () => {
        // Add model selection logic here
    };

    return (
        <Paper 
            className="sample-model"
            onClick={handleClick}
            sx={{
                padding: 2,
                textAlign: 'center',
                cursor: 'pointer',
                '&:hover': { backgroundColor: '#f0f0f0' },
                width: 100, // Adjust width as needed
            }}
        >
            <Box>
                <Typography variant="body1">{name}</Typography>
            </Box>
        </Paper>
    );
};

export default SampleModel;
