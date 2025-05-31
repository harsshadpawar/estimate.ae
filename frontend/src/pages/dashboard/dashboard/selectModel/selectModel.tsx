import React, { useState } from 'react';
import { Box, Grid, Typography, Container, Stack } from '@mui/material';
import FileUpload from './fileUpload';
import FormCard from './formCard';
import Card from '@/components/card';
import { useDispatch, useSelector } from 'react-redux';
import { uploadCadFile } from '@/redux/features/cad/cadSlice';
import { getForgeToken } from '@/redux/features/forge/forgeSlice';
import ForgeViewerComponent from '../../ForgeViewerComponent/forgeViewer';
import { RootState } from '@/redux/store/store';
import { ModelViewerPage } from '@/pages/base-viewer';
import { useModelLoader } from '@/pages/common/hooks';
import { BaseModelViewer } from '@/pages/base-viewer/viewer/BaseModelViewer';

// Define types for form data
interface FormDataType {
    model: string;
    materialGroup: string[];
    materialGroupIds: string[];
    material: string[];
    materialIds: string[];
    surfaceTreatment: string[];
    surfaceTreatmentIds: string[];
    quantity: string[];
    processSelection: string;
}

interface SelectModelProps {
    formData: FormDataType;
    setFormData: React.Dispatch<React.SetStateAction<FormDataType>>;
    step?:any
}

function SelectModel({step, formData, setFormData }: SelectModelProps) {
    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <ModelViewerPage step={step}/>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card title={'Please Select data below'}>
                        <FormCard 
                            formData={formData}
                            setFormData={setFormData}
                        />
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
}

export default SelectModel;