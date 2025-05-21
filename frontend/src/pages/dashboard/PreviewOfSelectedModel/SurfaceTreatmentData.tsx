import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Checkbox,
  Button,
  Chip,
  Paper,
  styled,
  Select,
  MenuItem,
  ListItemText,
  Backdrop,
  CircularProgress,
} from '@mui/material';
import { InfoOutlined, Add as AddIcon } from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { updateSurfaceTreatment } from '@/redux/features/surfaceTreatments/surfaceTreatmentsSlice';
import { useDispatch } from 'react-redux';

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  margin: theme.spacing(2),
  borderRadius: theme.spacing(1),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
    margin: theme.spacing(1),
  },
}));

const FormSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

const FormRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
}));
const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    height: '32px',
    width: '120px',
    '& input': {
      padding: '4px 8px',
    },
  },
}));
const ChipsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(1),
  padding: theme.spacing(1),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.spacing(1),
  minHeight: '56px',
  alignItems: 'center',
}));
const Label = styled(Typography)(({ theme }) => ({
  width: '250px',
  color: '#374151',
  fontWeight: 500,
  fontSize: '14px',
}));
const InfoIcon = styled(InfoOutlined)(({ theme }) => ({
  fontSize: '1rem',
  color: theme.palette.text.secondary,
  marginLeft: theme.spacing(0.5),
  cursor: 'help',
  width: 16,
  height: 16,
}));

interface MaterialGroup {
  id: string;
  label: string;
}

export default function SurfaceTreatmentForm() {
  const dispatch = useDispatch();
  const location = useLocation()
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const data = location?.state?.machineData
  console.log("data",data)
  const materialGroups = location?.state?.materialGroups
  const viewMode = location?.state?.viewMode === "view" ? true : false;
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    id: data?.id,
    name: data?.name,
    active: data?.active,
    material_group_ids: data?.material_group_ids || [],
    price_per_kg: data?.price_per_kg  ,
    co2Emission: '',
  });
  const handleSave = async () => {
    setIsLoading(true)
    try {
      console.log("form ",formData)
      const resultAction = await dispatch(
        updateSurfaceTreatment({
          id: formData?.id,
          treatment: formData,
        })
      );
      navigate('/user-configuration')
    } catch (error) {
      // toast.error('Failed to save the surfacetreatment. Please check the input and try again.');
      console
        .error("Error saving new machine:", error);
    }
    finally {
      setIsLoading(false)
      navigate('/user-configuration')
    }
  }
  const handleDelete = (chipToDelete: MaterialGroup) => {
    setFormData({
      ...formData,
      material_group_ids: formData.material_group_ids.filter((chip) => chip.id !== chipToDelete.id),
    });
  };

  const handleAddMaterialGroup = () => {
    // Implement material group addition logic
  };
  const handleMaterialGroupChange = (event) => {
    const value = event.target.value;
    setFormData({
      ...formData,
      material_group_ids: typeof value === 'string' ? value.split(',') : value,
    });
  };
  return (
    <StyledPaper>
      <Typography sx={{ fontWeight: 600, fontSize: '28px', lineHeight: '33.89px', }} gutterBottom>
        Surface Treatment Data:
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
          <Label sx={{ color: '#374151', fontWeight: 500 }}>Name:</Label>
          <StyledTextField
            size="small"
            disabled={viewMode}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            fullWidth
            sx={{
              maxWidth: { xs: '100%', sm: '300px' },
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#fff',
              },
            }}
          />
        </FormRow>

        <FormRow>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Label sx={{ color: '#374151', fontWeight: 500 }}>Active:<InfoIcon /></Label>
            <InfoIcon />
          </Box>
          <Checkbox
            checked={formData.active}
            disabled={viewMode}
            onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
            sx={{
              color: '#D1D5DB',
              '&.Mui-checked': {
                color: '#0591FC',
              },
            }}
          />
        </FormRow>

        <FormRow>
          <Label sx={{ color: '#374151', fontWeight: 500 }}>Material Group:</Label>
          <Box sx={{ width: '100%' }}>
            <Select
              name="material_group_ids"
              value={formData.material_group_ids}
              onChange={handleMaterialGroupChange}
              multiple
              disabled={viewMode} // Disable selection in view mode
              renderValue={(selected) =>
                (selected as number[])
                  .map(
                    (id) =>
                      materialGroups.find((group) => group.id === id)?.name || ""
                  )
                  .join(", ")
              }
              fullWidth
            >
              {materialGroups?.map((materialGroup) => (
                <MenuItem key={materialGroup.id} value={materialGroup.id}>
                  <Checkbox
                    checked={formData.material_group_ids.includes(materialGroup.id)}
                  />
                  <ListItemText primary={materialGroup.name} />
                </MenuItem>
              ))}
            </Select>
          </Box>
        </FormRow>


        <FormRow>
          <Label sx={{ color: '#374151', fontWeight: 500 }}>price_per_kg</Label>
          <StyledTextField
            size="small"
            value={formData.price_per_kg}
            disabled={viewMode}
            onChange={(e) => setFormData({ ...formData, price_per_kg: e.target.value })}
            fullWidth
            sx={{
              maxWidth: { xs: '100%', sm: '300px' },
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#fff',
              },
            }}
          />
        </FormRow>

        <FormRow>
          <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
            <Label sx={{ color: '#374151', fontWeight: 500 }}>CO2 Emission</Label>
          </Box>
          <StyledTextField
            size="small"
            value={formData.co2Emission}
            disabled={viewMode}
            onChange={(e) => setFormData({ ...formData, co2Emission: e.target.value })}
            fullWidth
            sx={{
              maxWidth: { xs: '100%', sm: '300px' },
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#fff',
              },
            }}
          />
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

