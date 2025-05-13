import React from 'react';
import {
    TextField,
    Slider,
    Grid,
    Typography,
    Paper,
    Box,
    Select,
    MenuItem,
    FormControl,
    InputLabel
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
    maxWidth: '900px',
    margin: '0 auto',
    borderRadius: '8px',
    overflow: 'hidden',
}));

const StyledHeader = styled(Box)(({ theme }) => ({
    backgroundColor: '#CAE8FF',
    padding: theme.spacing(2),
}));

const StyledContent = styled(Box)(({ theme }) => ({
    padding: theme.spacing(3),
}));

const LabelWithInfo = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
    marginBottom: theme.spacing(1),
}));

const CustomSlider = styled(Slider)(({ theme }) => ({
    '& .MuiSlider-track': {
        background: 'linear-gradient(to right, #4caf50, #ffeb3b, #f44336)',
        border: 'none',
    },
    '& .MuiSlider-thumb': {
        height: 24,
        width: 24,
        backgroundColor: '#fff',
        border: '2px solid currentColor',
        '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
            boxShadow: 'inherit',
        },
    },
}));

const SliderLabels = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: theme.spacing(1),
    color: theme.palette.text.secondary,
}));

const CustomForm = () => {
    const [sliderValues, setSliderValues] = React.useState({
        hourlyRate: 1,
        setupTime: 1,
        cuttingParameter: 1,
    });

    const handleSliderChange = (name: string) => (event: Event, newValue: number | number[]) => {
        setSliderValues(prev => ({ ...prev, [name]: newValue as number }));
    };

    return (
        <StyledPaper elevation={1}>
            <StyledHeader>
                <Typography sx={{ fontSize: '18px', fontWeight: '600', lineHeight: '24px' }}>Please select data below</Typography>
            </StyledHeader>
            <StyledContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {/* Model */}
                    <Box sx={{ display: 'flex' }}>
                        <LabelWithInfo sx={{ flex: 4 }}>
                            <Typography sx={{ fontSize: '15px', fontWeight: 500, lineHeight: '18.15px' }}>Model</Typography>
                            <InfoIcon fontSize="small" color="action" />
                        </LabelWithInfo>
                        <TextField
                            sx={{
                                flex: 8,
                                height: '36px', // Adjust height here
                                width: '414px',
                                padding: 0,
                                '& .MuiInputBase-root': {
                                    height: '36px', // Adjust height of input text area
                                },
                            }}
                            fullWidth
                            defaultValue="IDO_130SGIRJD_1RG_M2VM1DA5"
                            variant="outlined"
                        />

                    </Box>

                    {/* Material Group */}
                    <Box item xs={12} md={12} sx={{ display: 'flex', }}>
                        <LabelWithInfo sx={{ flex: 4 }}>
                            <Typography variant="body2">Material Group</Typography>
                            <InfoIcon fontSize="small" color="action" />
                        </LabelWithInfo>
                        <TextField sx={{
                            flex: 8, height: '36px', padding: 0,
                            '& .MuiInputBase-root': {
                                height: '36px', // Adjust height of input text area
                            },
                        }} fullWidth variant="outlined" />
                    </Box>

                    {/* Semi Finished Product */}
                    <Box sx={{ display: 'flex' }}>
                        <LabelWithInfo sx={{ flex: 4 }}>
                            <Typography variant="body2">Semi Finished Product</Typography>
                            <InfoIcon fontSize="small" color="action" />
                        </LabelWithInfo>
                        <TextField fullWidth variant="outlined" sx={{
                            flex: 8, height: '36px', padding: 0,
                            '& .MuiInputBase-root': {
                                height: '36px', // Adjust height of input text area
                            },
                        }} />
                    </Box>

                    {/* Surface Treatment */}
                    <Box sx={{ display: 'flex' }}>
                        <LabelWithInfo sx={{ flex: 4 }}>
                            <Typography variant="body2">Surface Treatment</Typography>
                            <InfoIcon fontSize="small" color="action" />
                        </LabelWithInfo>
                        <FormControl fullWidth variant="outlined" sx={{
                            flex: 8, height: '36px', padding: 0,
                            '& .MuiInputBase-root': {
                                height: '36px', // Adjust height of input text area
                            },
                        }}>
                            <Select defaultValue="" displayEmpty>
                                <MenuItem value="" disabled>Select surface treatment</MenuItem>
                                <MenuItem value="option1">Option 1</MenuItem>
                                <MenuItem value="option2">Option 2</MenuItem>
                                <MenuItem value="option3">Option 3</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </Box>

                <Box mt={4}>
                    {/* Hourly Rate Slider */}
                    <Box mb={3}>
                        <Box sx={{ display: 'flex' }}>
                            <LabelWithInfo sx={{ flex: 6 }}>
                                <Typography variant="body2">Hourly rate</Typography>
                                <InfoIcon fontSize="small" color="action" />
                            </LabelWithInfo>
                            <Box sx={{ flex: 6 }}>
                                <CustomSlider
                                    value={sliderValues.hourlyRate}
                                    onChange={handleSliderChange('hourlyRate')}
                                    step={1}
                                    marks
                                    min={0}
                                    max={2}
                                />
                                <SliderLabels>
                                    <Typography variant="caption">LOW</Typography>
                                    <Typography variant="caption">MEDIUM</Typography>
                                    <Typography variant="caption">HIGH</Typography>
                                </SliderLabels>
                            </Box>

                        </Box>

                    </Box>

                    {/* Setup Time Slider */}
                    <Box mb={3}>
                        <Box sx={{ display: 'flex' }}>
                            <LabelWithInfo sx={{ flex: 6 }}>
                                <Typography variant="body2">Setup Time</Typography>
                                <InfoIcon fontSize="small" color="action" />
                            </LabelWithInfo>
                            <Box sx={{ flex: 6 }}>
                                <CustomSlider sx={{ flex: 8 }}
                                    value={sliderValues.setupTime}
                                    onChange={handleSliderChange('setupTime')}
                                    step={1}
                                    marks
                                    min={0}
                                    max={2}
                                />
                                <SliderLabels>
                                    <Typography variant="caption">LOW</Typography>
                                    <Typography variant="caption">MEDIUM</Typography>
                                    <Typography variant="caption">HIGH</Typography>
                                </SliderLabels>
                            </Box>

                        </Box>


                    </Box>

                    {/* Cutting Parameter Slider */}
                    <Box>
                        <Box sx={{ display: 'flex' }}>
                            <LabelWithInfo sx={{ flex: 4 }}>
                                <Typography variant="body2">Cutting Parameter</Typography>
                                <InfoIcon fontSize="small" color="action" />
                            </LabelWithInfo>
                            <Box>

                            </Box>
                            <CustomSlider sx={{ flex: 8 }}
                                value={sliderValues.cuttingParameter}
                                onChange={handleSliderChange('cuttingParameter')}
                                step={1}
                                marks
                                min={0}
                                max={2}
                            />
                            <SliderLabels>
                                <Typography variant="caption">LOW</Typography>
                                <Typography variant="caption">MEDIUM</Typography>
                                <Typography variant="caption">HIGH</Typography>
                            </SliderLabels>
                        </Box>


                    </Box>
                </Box>
            </StyledContent>
        </StyledPaper>
    );
};

export default CustomForm;

