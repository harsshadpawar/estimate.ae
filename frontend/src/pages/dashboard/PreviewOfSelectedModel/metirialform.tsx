import React, { useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    Checkbox,
    Button,
    Paper,
    styled,
    Slider,
    Backdrop,
    CircularProgress,
} from '@mui/material';
import { InfoOutlined, KeyboardArrowDown } from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import apiClient from '../../../services/interceptor';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { updateMaterial } from '../../../redux/features/materials/materialsSlice';

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    borderRadius: theme.spacing(1),
    backgroundColor: '#fff',
}));

const FormSection = styled(Box)(({ theme }) => ({
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    backgroundColor: '#F9FAFB',
    borderRadius: theme.spacing(1),
}));

const FormRow = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
}));

const Label = styled(Typography)(({ theme }) => ({
    width: '250px',
    color: '#374151',
    fontWeight: 500,
    fontSize: '14px',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        height: '32px',
        width: 'auto',
        '& input': {
            padding: '4px 8px',
        },
    },
}));

const Unit = styled(Typography)(({ theme }) => ({
    marginLeft: theme.spacing(1),
    color: '#374151',
    fontSize: '14px',
}));

const InfoIcon = styled(InfoOutlined)(({ theme }) => ({
    fontSize: '16px',
    color: '#9CA3AF',
    marginLeft: theme.spacing(0.5),
    cursor: 'help',
}));

const CustomSlider = styled(Slider)(({ theme }) => ({
    width: '300px',
    '& .MuiSlider-rail': {
        background: 'linear-gradient(to right, #4ADE80, #FCD34D, #EF4444)',
        opacity: 1,
    },
    '& .MuiSlider-track': {
        display: 'none',
    },
    '& .MuiSlider-thumb': {
        width: '20px',
        height: '20px',
        backgroundColor: '#fff',
        border: '2px solid #0591FC',
    },
}));

const SliderLabels = styled(Box)({
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '4px',
    width: '300px',
    '& span': {
        fontSize: '12px',
        color: '#6B7280',
        textTransform: 'uppercase',
    },
});

export default function MaterialDataForm() {
    const location = useLocation()
    const dispatch = useDispatch();
    const data = location?.state?.machineData
    const [isLoading, setIsLoading] = useState(false); // Add loading state
    const materialGroups = location?.state?.materialGroups
    const viewMode = location?.state?.viewMode === "view" ? true : false;
    const navigate = useNavigate()
    const materialGroupName = materialGroups
        ?.find((group) => group.id === data?.material_group_id)?.name || 'N/A';

    const [formData, setFormData] = useState({
        id: data?.id,
        abbreviation: '00001650',
        active: data?.active,
        name: data?.name,
        materialGroupName: materialGroupName,
        materialNumber: data?.material_number,
        price_per_kg: data?.price_per_kg,
        refund_per_kg: data?.refund_per_kg,
        density: data?.density,
        emission: '12.000',
        chipsRecovery: true,
        recycling: '75.0',
        emissionReduction: '75.0',
        machinePowerFactor: '',
        cuttingSpeed: 1.0,
        feed: 1.0,
        plungingDepth: 75.0,
    });
    const handleSave = async () => {
        setIsLoading(true)
        try {
            console.log("formData", formData)
            console.log("formData?.id", formData?.id)
            dispatch(updateMaterial({ id: formData.id, material: formData }))
            // const response = await apiClient.put(`/api/material/${formData?.id}`, formData);
            // toast.success('Saving a Material Succesfully')
            navigate('/user-configuration')
        } catch (error) {
            toast.error('Failed to save the Material. Please check the input and try again.');
            console.error("Error saving new machine:", error);
        }
        finally {
            setIsLoading(false)
        }
    }
    const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [field]: event.target.type === 'checkbox' ? event.target.checked : event.target.value,
        });
    };

    const handleSliderChange = (field: string) => (event: Event, newValue: number | number[]) => {
        setFormData({
            ...formData,
            [field]: newValue,
        });
    };

    return (
        <StyledPaper elevation={0}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                Material Data:
            </Typography>
            {isLoading && (
                <Backdrop
                    sx={{
                        color: '#fff',
                        zIndex: (theme) => theme.zIndex.drawer + 1,
                    }}
                    open={isLoading}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
            )}
            <FormSection>
                <FormRow>
                    <Label>Abbreviation:</Label>
                    <StyledTextField
                        size="small"
                        disabled={viewMode}
                        value={formData.abbreviation}
                        onChange={handleChange('abbreviation')}
                    />
                </FormRow>

                <FormRow>
                    <Label>
                        Active: <InfoIcon />
                    </Label>
                    <Checkbox
                        disabled={viewMode}
                        checked={formData.active}
                        onChange={handleChange('active')}
                        sx={{ '&.Mui-checked': { color: '#0591FC' } }}
                    />
                </FormRow>

                <FormRow>
                    <Label>Name:</Label>
                    <StyledTextField
                        disabled={viewMode}
                        size="small"
                        value={formData.name}
                        onChange={handleChange('name')}
                    />
                </FormRow>

                <FormRow>
                    <Label>Material group:</Label>
                    <StyledTextField
                        disabled={viewMode}
                        size="small"
                        value={formData.materialGroupName}
                        onChange={handleChange('materialGroup')}
                    />
                </FormRow>

                <FormRow>
                    <Label>Material number:</Label>
                    <StyledTextField
                        disabled={viewMode}
                        size="small"
                        value={formData.materialNumber}
                        onChange={handleChange('materialNumber')}
                    />
                </FormRow>

                <FormRow>
                    <Label>Price per kg:</Label>
                    <StyledTextField
                        disabled={viewMode}
                        size="small"
                        value={formData.price_per_kg}
                        onChange={handleChange('price_per_kg')}
                    />
                    <Unit>AED/kg</Unit>
                </FormRow>

                <FormRow>
                    <Label>Refund chips:</Label>
                    <StyledTextField
                        disabled={viewMode}
                        size="small"
                        value={formData.refund_per_kg}
                        onChange={handleChange('refund_per_kg')}
                    />
                    <Unit>AED/kg</Unit>
                </FormRow>

                <FormRow>
                    <Label>Density:</Label>
                    <StyledTextField
                        disabled={viewMode}
                        size="small"
                        value={formData.density}
                        onChange={handleChange('density')}
                    />
                    <Unit>g/cm³</Unit>
                </FormRow>
            </FormSection>

            <FormSection>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                    CO₂ emission factors
                </Typography>

                <FormRow>
                    <Label>emission:</Label>
                    <StyledTextField
                        disabled={viewMode}
                        size="small"
                        value={formData.emission}
                        onChange={handleChange('emission')}
                    />
                    <Unit>t/t</Unit>
                </FormRow>

                <FormRow>
                    <Label>Chips recovery:</Label>
                    <Checkbox
                        disabled={viewMode}
                        checked={formData.chipsRecovery}
                        onChange={handleChange('chipsRecovery')}
                        sx={{ '&.Mui-checked': { color: '#0591FC' } }}
                    />
                </FormRow>

                <FormRow>
                    <Label>Recycling [%]:</Label>
                    <StyledTextField
                        disabled={viewMode}
                        size="small"
                        value={formData.recycling}
                        onChange={handleChange('recycling')}
                    />
                </FormRow>

                <FormRow>
                    <Label>Emission reduction secondary production [%]:</Label>
                    <StyledTextField
                        disabled={viewMode}
                        size="small"
                        value={formData.emissionReduction}
                        onChange={handleChange('emissionReduction')}
                    />
                </FormRow>

                <FormRow>
                    <Label>Machine power factor:</Label>
                    <StyledTextField
                        disabled={viewMode}
                        size="small"
                        value={formData.machinePowerFactor}
                        onChange={handleChange('machinePowerFactor')}
                    />
                </FormRow>
            </FormSection>

            <FormSection>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                    Cutting parameters: <InfoIcon />
                </Typography>

                <FormRow>
                    <Label>Cutting speed:</Label>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <StyledTextField
                            disabled={viewMode}
                            size="small"
                            value={formData.cuttingSpeed}
                            onChange={handleChange('cuttingSpeed')}
                            InputProps={{
                                endAdornment: <KeyboardArrowDown sx={{ color: '#6B7280', fontSize: 16 }} />,
                            }}
                        />
                        <Box sx={{ ml: 8, width: '100%' }}>
                            <CustomSlider
                                value={formData.cuttingSpeed}
                                onChange={handleSliderChange('cuttingSpeed')}
                                min={0}
                                max={2}
                                step={0.1}
                            />
                            <SliderLabels>
                                <span>Low</span>
                                <span>Medium</span>
                                <span>High</span>
                            </SliderLabels>
                        </Box>
                    </Box>
                </FormRow>

                <FormRow>
                    <Label>Feed:</Label>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <StyledTextField
                            size="small"
                            value={formData.feed}
                            onChange={handleChange('feed')}
                            InputProps={{
                                endAdornment: <KeyboardArrowDown sx={{ color: '#6B7280', fontSize: 16 }} />,
                            }}
                        />
                        <Box sx={{ ml: 8, width: '100%' }}>
                            <CustomSlider
                                value={formData.feed}
                                onChange={handleSliderChange('feed')}
                                min={0}
                                max={2}
                                step={0.1}
                            />
                            <SliderLabels>
                                <span>Low</span>
                                <span>Medium</span>
                                <span>High</span>
                            </SliderLabels>
                        </Box>
                    </Box>
                </FormRow>

                <FormRow>
                    <Label>Plunging depth:</Label>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <StyledTextField
                            size="small"
                            value={formData.plungingDepth}
                            onChange={handleChange('plungingDepth')}
                            InputProps={{
                                endAdornment: <KeyboardArrowDown sx={{ color: '#6B7280', fontSize: 16 }} />,
                            }}
                        />
                        <Box sx={{ ml: 8, width: '100%' }}>
                            <CustomSlider
                                value={formData.plungingDepth}
                                onChange={handleSliderChange('plungingDepth')}
                                min={0}
                                max={150}
                                step={0.1}
                            />
                            <SliderLabels>
                                <span>Low</span>
                                <span>Medium</span>
                                <span>High</span>
                            </SliderLabels>
                        </Box>
                    </Box>
                </FormRow>
            </FormSection>

            <Box sx={{ display: 'flex' }}>
                <Button
                    variant="contained"
                    onClick={handleSave}
                    disabled={viewMode}
                    sx={{
                        mx: 2,
                        display: viewMode ? 'none' : 'block',
                        bgcolor: '#0591FC',
                        '&:hover': {
                            bgcolor: '#0476cc',
                        },
                    }}
                >
                    {viewMode ? 'Done' : 'Update'}
                </Button>
                <Button
                    variant="contained"
                    onClick={() => navigate(-1)}
                    // disabled={viewMode}
                    sx={{
                        mx: 2,
                        bgcolor: '#0591FC',
                        '&:hover': {
                            bgcolor: '#0476cc',
                        },
                    }}
                >
                    {viewMode ? 'BACK' : 'Cancel'}
                </Button>
            </Box>
        </StyledPaper>
    );
}

