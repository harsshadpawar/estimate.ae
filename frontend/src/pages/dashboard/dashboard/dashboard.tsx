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
// import { ModelViewerPage } from 'pages/base-viewer'
function dashboard() {
    const dispatch = useDispatch()
    const [headerStep, SetHeaderStep] = useState(1)
    const [stepperStep, SetStepperStep] = useState(0)
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
    const isLoading =
        cadStatus === 'loading' ||
        materialsStatus === 'loading' ||
        machinesStatus === 'loading' ||
        surfaceTreatmentsStatus === 'loading'
    useEffect(() => {
        dispatch(fetchSurfaceTreatments());
        dispatch(fetchMaterialGroups());
        dispatch(fetchMaterials());
        dispatch(fetchMachines());

    }, [dispatch]);
    return (
        <Box >
            <Container>
                {isLoading && (
                    <Loader loading={isLoading} />
                )}
                <DashboardHeader step={headerStep} />
                <CustomStepper steps={stepperText} activeStep={stepperStep} />
                <SelectModel />
                {/* <MTKExplorerViewerPage /> */}
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                }}>
                    <CustomButton
                        text="Generate Quote"
                        color="#0591FC"
                        width="100%"
                        height="60px"
                        padding="12px"
                        borderRadius="14px"
                        textColor="#FFFFFF"
                        // onClick={handleButtonClick}
                        type="submit"
                    >
                        Generate Quote
                    </CustomButton>
                </Box>
                {/* <ModelViewerPage /> */}
            </Container>
        </Box>
    )
}

export default dashboard