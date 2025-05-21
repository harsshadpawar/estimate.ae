import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

interface CardBoxProps {
    title: string;
    children?: React.ReactNode;
}

const CardBox: React.FC<CardBoxProps> = ({ title, children }) => {
    return (
        <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            {/* Header */}
            <Box
                sx={{
                    backgroundColor: '#d8ecfd',
                    padding: 2,
                    borderBottom: '1px solid #ccc',
                }}
            >
                <Typography variant="subtitle1" fontWeight="bold">
                    {title}
                </Typography>
            </Box>

            {/* Content */}
            <Box sx={{ padding: 2 }}>
                {children}
            </Box>
        </Paper>
    );
};

export default CardBox;
