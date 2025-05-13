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
import { updateMaterial, updateMaterialGroup } from '../../../redux/features/materials/materialsSlice';

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
    '& .MuiTypography-root': {
        width: '200px',
        color: '#374151',
        fontWeight: 500,
        fontSize: '14px',
    },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        height: '32px',
        width: '120px',
        backgroundColor: '#fff',
        '& input': {
            padding: '4px 24px 4px 8px',
            fontSize: '14px',
            color: '#374151',
        },
    },
}));

const Unit = styled(Typography)({
    marginLeft: '8px',
    color: '#374151',
    fontSize: '14px',
});

const InfoIcon = styled(InfoOutlined)({
    width: 16,
    height: 16,
    color: '#9CA3AF',
    marginLeft: '4px',
    cursor: 'help',
});

const SliderContainer = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flex: 1,
});

const SliderTrack = styled(Box)({
    flex: 1,
    height: '8px',
    borderRadius: '4px',
    background: 'linear-gradient(90deg, #4ADE80 0%, #FCD34D 50%, #EF4444 100%)',
    position: 'relative',
    '&::after': {
        content: '""',
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        backgroundColor: '#fff',
        border: '2px solid #0591FC',
        cursor: 'pointer',
    }
});

const SliderLabels = styled(Box)({
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '4px',
    '& span': {
        fontSize: '12px',
        color: '#6B7280',
        textTransform: 'uppercase',
    },
});
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
const Label = styled(Typography)(({ theme }) => ({
    width: '250px',
    color: '#374151',
    fontWeight: 500,
    fontSize: '14px',
}));
export default function MaterialGroupForm() {
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
        abbreviation: data?.abbreviation,
        active: data?.active,
        name: data?.name,
        density: data?.density,
        price: data?.price,
        co2_emission: data?.co2_emission,
        cuttingSpeed: 1.0,
        feed: 1.0,
        plungingDepth: 75.0,
    });
    const handleSave = async () => {
        setIsLoading(true)
        try {
            dispatch(updateMaterialGroup({ id: formData.id, material: formData }))
            // const response = await apiClient.put(`/api/material-group/${formData.id}`, formData);

            // if (response.status === 200) {
            //     toast.success('Saving a Material Group Succesfully')
                navigate('/user-configuration'); // Redirect to the desired route
            // } else {
            //     toast.error('Failed to save the Material Group. Please check the input and try again.');
            //     console.error('Unexpected response status:', response.status);
            // }
        } catch (error) {
            toast.error('Failed to save the Material Group. Please check the input and try again.');
            console.error('Error saving material group:', error);

            // Optional: Show error feedback to the user
            // alert('Failed to save material group. Please try again later.');
        }
        finally {
            setIsLoading(false)
        }
    };

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
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Material Group Data:
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
                    <Typography>Abbreviation:</Typography>
                    <StyledTextField
                        disabled={viewMode}
                        size="small"
                        value={formData.abbreviation}
                        onChange={handleChange('abbreviation')}
                    />
                </FormRow>

                <FormRow>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography>Active:</Typography>
                        <InfoIcon />
                    </Box>
                    <Checkbox
                        disabled={viewMode}
                        checked={formData.active}
                        onChange={handleChange('active')}
                        sx={{ '&.Mui-checked': { color: '#0591FC' } }}
                    />
                </FormRow>

                <FormRow>
                    <Typography>Name:</Typography>
                    <StyledTextField
                        disabled={viewMode}
                        size="small"
                        value={formData.name}
                        onChange={handleChange('name')}
                    />
                </FormRow>

                <FormRow>
                    <Typography>Density:</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <StyledTextField
                            disabled={viewMode}
                            size="small"
                            value={formData.density}
                            onChange={handleChange('density')}
                        />
                        <Unit>g/cm³</Unit>
                    </Box>
                </FormRow>

                <FormRow>
                    <Typography>Price per kg:</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <StyledTextField
                            disabled={viewMode}
                            size="small"
                            value={formData.price}
                            onChange={handleChange('price')}
                            InputProps={{
                                endAdornment: <KeyboardArrowDown sx={{ color: '#6B7280', fontSize: 16 }} />,
                            }}
                        />
                        <Unit>AED/kg</Unit>
                    </Box>
                </FormRow>

                <FormRow>
                    <Typography>emission:</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <StyledTextField
                            disabled={viewMode}
                            size="small"
                            value={formData.co2_emission}
                            onChange={handleChange('co2_emission')}
                            InputProps={{
                                endAdornment: <KeyboardArrowDown sx={{ color: '#6B7280', fontSize: 16 }} />,
                            }}
                        />
                        <Unit>t/t</Unit>
                    </Box>
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
                            disabled={viewMode}
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
                            disabled={viewMode}
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

