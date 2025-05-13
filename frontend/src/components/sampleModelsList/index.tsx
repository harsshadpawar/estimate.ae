import React from 'react';
import './sampleModelsList.css';
import { Box } from '@mui/material';
import SampleModel from '../sampleModel';

const sampleModels = [
    { id: 1, name: 'BEND1' },
    { id: 2, name: 'BEND2' },
    { id: 3, name: 'FLAT1' },
];

const SampleModelsList = () => {
    return (
        <div className="sample-models-container">
            <h4>Sample Models</h4>
            <div className="sample-models-grid">
                {sampleModels.map((model) => (
                    <Box key={model.id} className="sample-model">
                        <SampleModel name={model.name} />
                    </Box>
                ))}
            </div>
        </div>
    );
};

export default SampleModelsList;
