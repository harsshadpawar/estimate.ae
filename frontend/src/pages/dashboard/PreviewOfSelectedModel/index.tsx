import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Checkbox,
  Button,
  Slider,
  styled,
  Paper,
  Backdrop,
  CircularProgress,
} from '@mui/material';
import { InfoOutlined, KeyboardArrowDown } from '@mui/icons-material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useLocation, useNavigate } from 'react-router-dom';
import apiClient from '@/services/interceptor';
import { toast } from 'react-toastify';
// Custom styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(3),
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
const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    height: '32px',
    width: '150px',
    '& input': {
      padding: '4px 8px',
    },
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

const InfoIcon = styled(InfoOutlined)(({ theme }) => ({
  fontSize: '1rem',
  color: theme.palette.text.secondary,
  marginLeft: theme.spacing(0.5),
  cursor: 'help',
}));
const SliderContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  width: '100%',
}));
const InputWrapper = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '80px',
}));

const CustomInput = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#fff',
    height: '32px',
    width: '80px',
    '& input': {
      padding: '4px 24px 4px 8px',
      textAlign: 'left',
    },
  },
}));
const ArrowIcon = styled(KeyboardArrowDownIcon)(({ theme }) => ({
  position: 'absolute',
  right: 8,
  top: '50%',
  transform: 'translateY(-50%)',
  color: '#6B7280',
  pointerEvents: 'none',
  width: 16,
  height: 16,
}));

const SliderTrack = styled(Box)(({ theme }) => ({
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
}));
export default function MachineDataForm() {
  const location = useLocation()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const data = location?.state?.machineData
  const viewMode = location?.state?.viewMode === "view" ? true : false;

  const [formData, setFormData] = useState({
    id: data?.id,
    abbreviation: data?.machine_abbreviation,
    name: data?.name,
    working_span: data?.working_span,
    activeVariant1: data?.active,
    activeVariant2: data?.active,
    hourlyRate: data?.hourly_rate,
    baseSetupTime: 50,
    cuttingParameters: 50,
    transverse: 50,
    toolChange: 50,
    programmingTimes: data?.avg_programming_time,
    maximumPower: 2000,
    maximumLength: 2000,
    maximumWidth: 1500,
    maximumHeight: 800,
    standardProcessing: 24.00,
    secondaryOperations: 8.00,
    setup: 2.20,
  });
  const handleSave = async () => {
    setIsLoading(true)
    try {
      const payload = {
        name: formData?.name,
        abbreviation: formData?.abbreviation,
        hourly_rate: formData?.hourlyRate,
        working_span: formData?.working_span

      }
      const response = await apiClient.put("/machine/" + formData?.id, payload);
      toast.success('Saving a machine Succesfully')
      navigate('/user-configuration')
    } catch (error) {
      toast.error('Failed to save the machine. Please check the input and try again.');
      console.error("Error saving new machine:", error);
    }
    finally {
      setIsLoading(false)
    }
  }
  const handleChange = (field: string) => (event: any) => {
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
    <StyledPaper>
      <Typography sx={{ fontWeight: 600, fontSize: '28px', lineHeight: '33.89px', }} gutterBottom>
        Machine Data:
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
            sx={{ input: { color: '#374151' } }}
          />
        </FormRow>

        <FormRow>
          <Label>Name:</Label>
          <StyledTextField
            size="small"
            disabled={viewMode}
            value={formData.name}
            onChange={handleChange('name')}
            sx={{ input: { color: '#374151' } }}
          />
        </FormRow>

        <FormRow>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Label>Active Variant 1: <InfoIcon /></Label>
          </Box>
          <Checkbox
            checked={formData.activeVariant1}
            disabled={viewMode}
            onChange={handleChange('activeVariant1')}
            sx={{ '&.Mui-checked': { color: '#0591FC' } }}
          />
        </FormRow>

        <FormRow>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Label>Active Variant 2: <InfoIcon /></Label>
          </Box>
          <Checkbox
            checked={formData.activeVariant2}
            disabled={viewMode}
            onChange={handleChange('activeVariant2')}
            sx={{ '&.Mui-checked': { color: '#0591FC' } }}
          />
        </FormRow>

        <FormRow>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Label>Hourly Rate: <InfoIcon /></Label>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <StyledTextField
              size="small"
              disabled={viewMode}
              type="number"
              value={formData.hourlyRate}
              onChange={handleChange('hourlyRate')}
            />
            <Typography sx={{ color: '#374151' }}>AED/h</Typography>
          </Box>
        </FormRow>
      </FormSection>

      <FormSection>
        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
          Setup time
        </Typography>
        <FormRow>
          <Label>Base setup time:<InfoIcon /></Label>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <StyledTextField
              size="small"
              value={formData.baseSetupTime}
              onChange={handleChange('baseSetupTime')}
              InputProps={{
                endAdornment: <KeyboardArrowDown sx={{ color: '#6B7280', fontSize: 16 }} />,
              }}
            />
            <Box sx={{ ml: 8, width: '100%' }}>
              <CustomSlider
                value={formData.baseSetupTime}
                onChange={handleSliderChange('baseSetupTime')}
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
          <Label>Cutting parameters: <InfoIcon /></Label>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <StyledTextField
              size="small"
              value={formData.cuttingParameters}
              onChange={handleChange('cuttingParameters')}
              InputProps={{
                endAdornment: <KeyboardArrowDown sx={{ color: '#6B7280', fontSize: 16 }} />,
              }}
            />
            <Box sx={{ ml: 8, width: '100%' }}>
              <CustomSlider
                value={formData.cuttingParameters}
                onChange={handleSliderChange('cuttingParameters')}
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
        <Typography variant="h6" gutterBottom>
          Additional time
        </Typography>

        <FormRow>
          <Label>Transverse:<InfoIcon /></Label>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <StyledTextField
              size="small"
              value={formData.transverse}
              onChange={handleChange('transverse')}
              InputProps={{
                endAdornment: <KeyboardArrowDown sx={{ color: '#6B7280', fontSize: 16 }} />,
              }}
            />
            <Box sx={{ ml: 8, width: '100%' }}>
              <CustomSlider
                value={formData.transverse}
                onChange={handleSliderChange('transverse')}
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
          <Label>Tool change:<InfoIcon /></Label>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <StyledTextField
              size="small"
              value={formData.toolChange}
              onChange={handleChange('toolChange')}
              InputProps={{
                endAdornment: <KeyboardArrowDown sx={{ color: '#6B7280', fontSize: 16 }} />,
              }}
            />
            <Box sx={{ ml: 8, width: '100%' }}>
              <CustomSlider
                value={formData.toolChange}
                onChange={handleSliderChange('toolChange')}
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
          <Label>Programming time:<InfoIcon /></Label>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <StyledTextField
              size="small"
              value={formData.programmingTimes}
              onChange={handleChange('programmingTimes')}
              InputProps={{
                endAdornment: <KeyboardArrowDown sx={{ color: '#6B7280', fontSize: 16 }} />,
              }}
            />
            <Box sx={{ ml: 8, width: '100%' }}>
              <CustomSlider
                value={formData.programmingTimes}
                onChange={handleSliderChange('programmingTimes')}
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
      </FormSection>

      <FormSection>
        <FormRow>
          <Label>Maximum power:</Label>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <StyledTextField
              size="small"
              type="number"
              disabled={viewMode}
              value={formData.maximumPower}
              onChange={handleChange('maximumPower')}
            />
            <Typography>kW</Typography>
          </Box>
        </FormRow>

        <FormRow>
          <Label>Maximum length:</Label>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <StyledTextField
              size="small"
              type="number"
              disabled={viewMode}
              value={formData.maximumLength}
              onChange={handleChange('maximumLength')}
            />
            <Typography>mm</Typography>
          </Box>
        </FormRow>

        <FormRow>
          <Label>Maximum width:</Label>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <StyledTextField
              size="small"
              type="number"
              disabled={viewMode}
              value={formData.maximumWidth}
              onChange={handleChange('maximumWidth')}
            />
            <Typography>mm</Typography>
          </Box>
        </FormRow>

        <FormRow>
          <Label>Maximum height:</Label>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <StyledTextField
              size="small"
              type="number"
              disabled={viewMode}
              value={formData.maximumHeight}
              onChange={handleChange('maximumHeight')}
            />
            <Typography>mm</Typography>
          </Box>
        </FormRow>
      </FormSection>

      <FormSection>
        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
          Power stages
        </Typography>

        <FormRow>
          <Label>Standard processing:</Label>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <StyledTextField
              disabled={viewMode}
              size="small"
              type="number"
              value={formData.standardProcessing}
              onChange={handleChange('standardProcessing')}
            />
            <Typography>kW</Typography>
          </Box>
        </FormRow>

        <FormRow>
          <Label>Secondary operations:</Label>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <StyledTextField
              size="small"
              disabled={viewMode}
              type="number"
              value={formData.secondaryOperations}
              onChange={handleChange('secondaryOperations')}
            />
            <Typography>kW</Typography>
          </Box>
        </FormRow>

        <FormRow>
          <Label>Setup:</Label>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <StyledTextField
              size="small"
              type="number"
              disabled={viewMode}
              value={formData.setup}
              onChange={handleChange('setup')}
            />
            <Typography>kW</Typography>
          </Box>
        </FormRow>
      </FormSection>
      <Box sx={{display:'flex'}}>
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

