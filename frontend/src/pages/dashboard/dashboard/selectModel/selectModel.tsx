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
function SelectModel() {
    const dispatch = useDispatch()
    const [volume, setVolume] = useState<number>(0);
    const [surfaceArea, setSurfaceArea] = useState<number>(0);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const { fileId: cadFileId } = useSelector((state: RootState) => state.cad);
    const { token: accessToken } = useSelector((state: RootState) => state.forge);
    const handleFileSelect = (selectedFile: File) => {
        if (selectedFile) {
            setSelectedFile(selectedFile);
            // dispatch(uploadCadFile(selectedFile))
            //     .then(() => dispatch(getForgeToken()));
        }
    };

     const [viewer] = useState(new BaseModelViewer());
    
      const {
        onMTKWEBFileSelected,
        onMTKWEBFolderSelected,
      } = useModelLoader(viewer);
    
    const getDimensions = (dimensionValues: any) => {
        setVolume(dimensionValues.rawMaterialDimensions.volume);
        setSurfaceArea(dimensionValues.rawMaterialDimensions.surfaceArea);
    };


    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    
                        {/* <FileUpload onFileSelect={onMTKWEBFolderSelected} /> */}
                        <ModelViewerPage />

                        {/* {cadFileId && render3DPreview(cadFileId, accessToken, getDimensions)} */}
                    
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card title={'Please Select data below'}>
                        <FormCard />
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
}

export default SelectModel;
