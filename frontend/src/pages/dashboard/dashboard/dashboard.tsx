import Loader from '@/components/loader'
import { Box, Button, Container } from '@mui/material'
import React, { useEffect, useState } from 'react'
import DashboardHeader from '../DashboardHeader/dashboardHeader'
import CustomStepper from '../CustomStepper/customStepper'
import { stepperText } from '../../menus/stepperItems'
import SelectModel from './selectModel/selectModel'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSurfaceTreatments } from '@/redux/features/surfaceTreatments/surfaceTreatmentsSlice'
import { fetchMaterialGroups, fetchMaterials } from '@/redux/features/materials/materialsSlice'
import { fetchMachines } from '@/redux/features/machines/machinesSlice'
import { RootState } from '@/redux/store/store'
import { ModelViewerPage } from '../../base-viewer'
import { MTKExplorerViewerPage } from '@/pages/mtk-explorer-viewer'
import CustomButton from '@/components/button'

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

function Dashboard() {
    const dispatch = useDispatch()
    const [headerStep, SetHeaderStep] = useState(1)
    const [stepperStep, SetStepperStep] = useState(1)

    // Form state management in Dashboard
    const [formData, setFormData] = useState<FormDataType>({
        model: '',
        materialGroup: [],
        materialGroupIds: [],
        material: [],
        materialIds: [],
        surfaceTreatment: [],
        surfaceTreatmentIds: [],
        quantity: [],
        processSelection: 'Milling'
    });

    const {
        status: cadStatus
    } = useSelector((state: RootState) => state.cad);

    const {
        status: materialsStatus
    } = useSelector((state: RootState) => state.materials);

    const {
        status: machinesStatus
    } = useSelector((state: RootState) => state.machines);

    const {
        status: surfaceTreatmentsStatus
    } = useSelector((state: RootState) => state.surfaceTreatments);

    // Get uploaded files from Redux
    const uploadedFiles = useSelector((state: RootState) => state.file.uploadedFiles);

    const isLoading =
        cadStatus === 'loading' ||
        // materialsStatus === 'loading' ||
        machinesStatus === 'loading' ||
        surfaceTreatmentsStatus === 'loading'

    useEffect(() => {
        console.log("calll/.......")
        dispatch(fetchSurfaceTreatments());
        // dispatch(fetchMaterialGroups());
        dispatch(fetchMaterials());
        dispatch(fetchMachines());
    }, []);

    // Check if all required form fields are filled
    const isFormComplete = () => {
        return (
            formData.model !== '' &&
            formData.materialGroupIds.length > 0 &&
            formData.materialIds.length > 0 &&
            formData.surfaceTreatmentIds.length > 0 &&
            formData.quantity.length > 0 &&
            formData.processSelection !== ''
        );
    };

    // Handle quote generation button click
    const handleGenerateQuote = () => {
        if (isFormComplete()) {
            // Update steps to move to next phase
            SetHeaderStep(2);
            SetStepperStep(2);
            console.log('Generating quote with data:', formData);
            // Add your quote generation logic here
        }
    };

    // Check if files are uploaded to show MTK Explorer
    const showMTKExplorer = uploadedFiles && uploadedFiles.length > 0;

    return (
        <Box>
            <Container>
                {isLoading && (
                    <Loader loading={isLoading} />
                )}
                <DashboardHeader step={headerStep} SetStepperStep={SetStepperStep} SetHeaderStep={SetHeaderStep}/>
                <CustomStepper steps={stepperText} activeStep={stepperStep-1} />

                {/* Always show SelectModel with form data props */}
                {(stepperStep != 2) && (
                    <SelectModel
                    step={headerStep}
                        formData={formData}
                        setFormData={setFormData}
                    />
                )}

                {/* Only show MTKExplorerViewer when files are uploaded */}
                {(stepperStep === 2 && showMTKExplorer) && (
                    <Box
                        sx={{
                            height: '100%',
                            borderRadius: 4,
                            border: '1.5px dashed #0591fc',
                            p: 2,
                            display: 'flex',
                            // flexDirection: 'column',
                            justifyContent: 'center'
                        }}
                    >
                        <MTKExplorerViewerPage />
                    </Box>
                )}

                {(stepperStep === 1) && (
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        mt: 3
                    }}>
                        <CustomButton
                            text="Generate Quote"
                            color={isFormComplete() ? "#0591FC" : "#CCCCCC"}
                            width="100%"
                            height="60px"
                            padding="12px"
                            borderRadius="14px"
                            textColor="#FFFFFF"
                            onClick={handleGenerateQuote}
                            disabled={!isFormComplete()}
                            type="submit"
                        >
                            Generate Quote
                        </CustomButton>
                    </Box>)}
            </Container>
        </Box>
    )
}

export default Dashboard