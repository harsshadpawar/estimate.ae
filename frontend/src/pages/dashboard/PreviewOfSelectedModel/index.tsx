
// import React, { useState, useEffect } from 'react';
// import '../dashboard.css';
// import { Box, Container, Stack, CircularProgress, Backdrop, Grid, Button, Typography, MenuItem, TextField, Paper, Select, Card, CardMedia, styled, ListSubheader, FormControl } from '@mui/material';
// import { Pie } from 'react-chartjs-2';
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
// import apiClient from '../../../interceptor';
// import DashboardHeader from '../DashboardHeader';
// import CustomStepper from '../CustomStepper';
// import ModelSelection from '../ModelSelection';
// import DataSelection from '../DataSelection';
// import CalculateButton from '../CalculateButton';
// import ForgeViewerComponent from '../ForgeViewerComponent';
// import { colorPalette } from '../../../utils';
// import ChartDataLabels from 'chartjs-plugin-datalabels';
// import modalimage from '../../../Assets/images/modelimg.png'
// import InfoIcon from '@mui/icons-material/Info';
// import CalculationPreview from './CalculationPreview';
// ChartJS.register(ArcElement, Tooltip, Legend);
// ChartJS.register(ChartDataLabels);
// const StyledPaper = styled(Paper)(({ theme }) => ({
//     // maxWidth: '900px',
//     margin: '0 auto',
//     borderRadius: '8px',
//     overflow: 'hidden',
// }));
// const StyledHeader = styled(Box)(({ theme }) => ({
//     backgroundColor: '#CAE8FF',
//     padding: theme.spacing(2),
// }));
// const StyledContent = styled(Box)(({ theme }) => ({
//     paddingRight: theme.spacing(3),
//     paddingLeft: theme.spacing(3),
//     paddingTop: theme.spacing(1),
//     paddingBottom: theme.spacing(1),
// }));
// const LabelWithInfo = styled(Box)(({ theme }) => ({
//     display: 'flex',
//     alignItems: 'center',
//     gap: theme.spacing(0.5),
//     marginBottom: theme.spacing(1),
// }));
// const Preview = () => {
//     const [isFileUploaded, setIsFileUploaded] = useState(false);
//     const [materials, setMaterials] = useState([]);
//     const [surfaceTreatments, setSurfaceTreatments] = useState([]);
//     const [machines, setMachines] = useState([]);
//     const [groupedMaterials, setGroupedMaterials] = useState({});
//     const [groupedMachines, setGroupedMachines] = useState({});
//     const [materialGroups, setMaterialGroups] = useState([]);
//     const [volume, setVolume] = useState(0);
//     const [surfaceArea, setSurfaceArea] = useState(0);
//     const [isLoading, setIsLoading] = useState(true); // Add loading state
//     const [cadFileId, setCadFileId] = useState('');
//     const [uploadedFileName, setUploadedFileName] = useState('');
//     const [accessToken, setAccessToken] = useState('');
//     const [selectedMaterialId, setSelectedMaterialId] = useState('');
//     const [selectedMachines, setSelectedMachines] = useState([]);
//     const [selectedSurfaceTreatmentId, setSelectedSurfaceTreatmentId] = useState('');
//     const [isCalculationDone, setIsCalculationDone] = useState(false);
//     const [setupCostsData, setSetupCostsData] = useState(null);
//     const [unitCostsData, setUnitCostsData] = useState(null);
//     const [setupCostsTotal, setSetupCostsTotal] = useState(0);
//     const [unitCostsTotal, setUnitCostsTotal] = useState(0);

//     const formatLegendLabel = (label) => {
//         return label.split('_').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
//     };

//     const setupChartOptions = {
//         plugins: {
//             legend: {
//                 position: 'bottom', // Position of legends
//                 align: 'start', // Align legends
//                 labels: {
//                     generateLabels: (chart) => {
//                         const datasets = chart.data.datasets[0];
//                         return chart.data.labels.map((label, i) => ({
//                             text: `${formatLegendLabel(label)} - ${datasets.data[i]} AED`,
//                             fillStyle: datasets.backgroundColor[i],
//                         }));
//                     },
//                 },
//                 onClick: (e, legendItem, legend) => {
//                     // Get chart instance and dataset index
//                     const chart = legend.chart;
//                     const dataset = chart.data.datasets[0];
//                     const index = legendItem.index;

//                     // Highlight the selected segment by reducing opacity of others
//                     dataset.backgroundColor = dataset.backgroundColor.map((color, i) => {
//                         return i === index ? color : 'rgba(200, 200, 200, 0.3)';
//                     });

//                     chart.update();
//                 },
//             },
//             centerText: {
//                 text: `Setup Costs\n${setupCostsTotal.toFixed(2)} AED`, // Custom text
//                 fontSize: 18, // Optional: Font size for center text
//                 color: '#333', // Optional: Text color
//             },
//         },
//     };

//     const unitCostChartOptions = {
//         plugins: {
//             legend: {
//                 position: 'bottom', // Position of legends
//                 align: 'start', // Align legends
//                 labels: {
//                     generateLabels: (chart) => {
//                         const datasets = chart.data.datasets[0];
//                         return chart.data.labels.map((label, i) => ({
//                             text: `${formatLegendLabel(label)} - ${datasets.data[i]} AED`,
//                             fillStyle: datasets.backgroundColor[i],
//                         }));
//                     },
//                 },
//                 onClick: (e, legendItem, legend) => {
//                     // Get chart instance and dataset index
//                     const chart = legend.chart;
//                     const dataset = chart.data.datasets[0];
//                     const index = legendItem.index;

//                     // Highlight the selected segment by reducing opacity of others
//                     dataset.backgroundColor = dataset.backgroundColor.map((color, i) => {
//                         return i === index ? color : 'rgba(200, 200, 200, 0.3)';
//                     });

//                     chart.update();
//                 },
//             },
//             centerText: {
//                 text: `Unit Costs\n${unitCostsTotal.toFixed(2)} AED`, // Custom text
//                 fontSize: 18, // Optional: Font size for center text
//                 color: '#333', // Optional: Text color
//             },
//         },
//     };

//     const centerTextPlugin = {
//         id: 'centerText',
//         beforeDraw: (chart) => {
//             const { width } = chart;
//             const ctx = chart.ctx;
//             ctx.save();

//             // Display custom text in the center
//             const centerText = chart.config.options.plugins.centerText;
//             if (centerText && centerText.text) {
//                 const { text, fontSize = 16, color = '#000' } = centerText;

//                 // Split the text into multiple lines if `\n` is used
//                 const lines = text.split('\n');
//                 const lineHeight = fontSize + 4; // Adjust line height as needed

//                 // Calculate the starting position for the first line
//                 const textX = width / 2;
//                 const totalHeight = lines.length * lineHeight;
//                 const startY = chart.chartArea.top + (chart.chartArea.bottom - chart.chartArea.top) / 2 - totalHeight / 2;

//                 // Set font properties
//                 ctx.font = `bold ${fontSize}px Arial`;
//                 ctx.textAlign = 'center';
//                 ctx.fillStyle = color;

//                 // Draw each line
//                 lines.forEach((line, index) => {
//                     const textY = startY + index * lineHeight;
//                     ctx.fillText(line, textX, textY);
//                 });
//             }


//             ctx.restore();
//         },
//     };

//     // Fetch API Data
//     const fetchApiData = async () => {
//         try {
//             const [materialsRes, machinesRes, surfaceTratmentRes, materialGroupsRes] = await Promise.all([
//                 apiClient.get('/api/material'),
//                 apiClient.get('/api/machine'),
//                 apiClient.get('/api/surface-treatment'),
//                 apiClient.get('/api/material-group')
//             ]);
//             setMaterials(materialsRes.data);
//             setMachines(machinesRes.data);
//             setSurfaceTreatments(surfaceTratmentRes.data);
//             setMaterialGroups(materialGroupsRes.data);
//         } catch (error) {
//             console.error('Error fetching data:', error);
//         }
//     };

//     // Group Materials by Groups
//     const groupMaterialsByGroups = () => {
//         const grouped = materialGroups.reduce((acc, group) => {
//             const groupMaterials = materials.filter(material => material.material_group_id === group.id);
//             acc[group.name] = groupMaterials;
//             return acc;
//         }, {});
//         setGroupedMaterials(grouped);
//     };

//     // Group Machines by Categories
//     const groupMachinesByCategories = () => {
//         const grouped = machines.reduce((acc, machine) => {
//             const category = machine.category;
//             if (!acc[category]) acc[category] = [];
//             acc[category].push(machine);
//             return acc;
//         }, {});
//         setGroupedMachines(grouped);
//     };

//     // Fetch Data and Prepare Groups
//     const initializeData = async () => {
//         setIsLoading(true);
//         await fetchApiData();
//         setIsLoading(false);
//     };

//     useEffect(() => {
//         initializeData();
//     }, []);

//     useEffect(() => {
//         if (materials.length && materialGroups.length) groupMaterialsByGroups();
//     }, [materials, materialGroups]);

//     useEffect(() => {
//         if (machines.length) groupMachinesByCategories();
//     }, [machines]);

//     // Handle file upload
//     const handleUpload = async (file) => {
//         const formData = new FormData();
//         formData.append('file', file);

//         try {
//             setIsLoading(true);
//             const response = await apiClient.post('/api/cad/upload', formData);
//             setIsFileUploaded(true);
//             setCadFileId(response.data.file_id);
//             setUploadedFileName(response.data.data.objectKey);
//             const token = await getForgeToken();
//             setAccessToken(token);
//         } catch (error) {
//             console.error('Upload failed:', error);
//         }
//         setIsLoading(false);
//     };

//     const handleMaterialSelection = (materialId) => {
//         setSelectedMaterialId(materialId);
//     };

//     const handleSurfaceTreatmentSelection = (surfaceTreatmentId) => {
//         setSelectedSurfaceTreatmentId(surfaceTreatmentId);
//     };

//     const handleMachineSelection = (finalAddedMachines) => {
//         setSelectedMachines(finalAddedMachines);
//     };

//     const getForgeToken = async () => {
//         try {
//             const response = await apiClient.get('/api/forge-token/', {
//                 method: 'GET',
//                 credentials: 'include',
//             });
//             return response.data.forge_token;
//         } catch (error) {
//             console.error('Error fetching Forge token:', error);
//             return '';
//         }
//     };

//     const getMachiningCost = (programmingTime) => {
//         const programmingTimeParam = programmingTime.split(" ");
//         if (programmingTimeParam[1] === 'hour' || programmingTimeParam[1] === 'hours') {
//             return parseFloat(programmingTime[0]);
//         } else {
//             return parseFloat(programmingTime[0]) / 60;
//         }
//     };

//     const getSelectedMachine = (selectedMachines) => {
//         return selectedMachines.map((machine) => {
//             return {
//                 ...machines.find((m) => m.id === machine.id),
//                 machining_time: getMachiningCost(machine.programmingTime)
//             };
//         });
//     };

//     const getDimensions = (dimensionValues) => {
//         setVolume(dimensionValues.rawMaterialDimensions.volume);
//         setSurfaceArea(dimensionValues.rawMaterialDimensions.surfaceArea);
//     }

//     const calcSetupCostsTotal = (setupCosts) => {
//         const total = Object.values(setupCosts).reduce((a, b) => a + b, 0);
//         setSetupCostsTotal(total);
//     };

//     const calcUnitCostsTotal = (unitCosts) => {
//         const total = Object.values(unitCosts).reduce((a, b) => a + b, 0);
//         setUnitCostsTotal(total);
//     };

//     const handleCalculateCosts = async () => {
//         try {
//             const response = await apiClient.post('/api/calculate/total-cost', {
//                 selectedMaterial: materials.find((m) => m.id === selectedMaterialId),
//                 selectedSurfaceTreatment: surfaceTreatments.find((sT) => sT.id === selectedSurfaceTreatmentId),
//                 selectedMachines: getSelectedMachine(selectedMachines),
//                 volume: volume,
//                 surfaceArea: surfaceArea
//             });
//             setIsCalculationDone(true);
//             const { setupCosts, unitCosts } = response.data;

//             calcSetupCostsTotal(setupCosts);
//             calcUnitCostsTotal(unitCosts);

//             // Prepare chart data for Setup Costs
//             const setupChartData = {
//                 labels: Object.keys(setupCosts),
//                 datasets: [
//                     {
//                         data: Object.values(setupCosts),
//                         backgroundColor: colorPalette,
//                         hoverOffset: 4,
//                         cutout: '50%',
//                         datalabels: {
//                             color: '#fff',
//                             formatter: (value, context) => {
//                                 const total = context.dataset.data.reduce((a, b) => a + b, 0);
//                                 const percentage = ((value / total) * 100).toFixed(1);
//                                 return percentage > 0 ? `${percentage}%` : '';
//                             },
//                         },
//                     },
//                 ],
//             };

//             // Prepare chart data for Unit Costs
//             const unitChartData = {
//                 labels: Object.keys(unitCosts),
//                 datasets: [
//                     {
//                         data: Object.values(unitCosts),
//                         // add more colors
//                         backgroundColor: colorPalette,
//                         hoverOffset: 4,
//                         cutout: '50%',
//                         datalabels: {
//                             color: '#fff',
//                             formatter: (value, context) => {
//                                 const total = context.dataset.data.reduce((a, b) => a + b, 0);
//                                 const percentage = ((value / total) * 100).toFixed(1);
//                                 return percentage > 0 ? `${percentage}%` : '';
//                             },
//                         },
//                     },
//                 ],
//             };

//             setSetupCostsData(setupChartData);
//             setUnitCostsData(unitChartData);
//         } catch (error) {
//             console.error('Error calculating costs:', error);
//             setIsLoading(false);
//         }
//     };

//     const resetCosts = () => {
//         setSetupCostsData(null);
//         setUnitCostsData(null);
//         setSetupCostsTotal(0);
//         setUnitCostsTotal(0);
//     };

//     const handleChangeModel = () => {
//         setIsCalculationDone(false);
//         setIsFileUploaded(false);
//         resetCosts();
//     };

//     const handleChangeParams = () => {
//         setIsCalculationDone(false);
//         resetCosts();
//     };

//     return (
//         <Container maxWidth="lg" sx={{ padding: '20px' }}>
//             {/* Loading Overlay */}
//             {isLoading && (
//                 <Backdrop
//                     sx={{
//                         color: '#fff',
//                         zIndex: (theme) => theme.zIndex.drawer + 1,
//                     }}
//                     open={isLoading}
//                 >
//                     <CircularProgress color="inherit" />
//                 </Backdrop>
//             )}
//             <DashboardHeader />
//             <CustomStepper isCalculationDone={true} />

//             <Box>
//                 <Grid container spacing={3} sx={{ px: 3 }}>
//                     {/* Left Section - 3D Preview */}
//                     <Grid item xs={12} md={5}>
//                         <Typography variant="h6" fontWeight={600} gutterBottom>
//                             3D preview of the selected model
//                         </Typography>
//                         <Box sx={{ p: 2, }}>

//                             <Card sx={{ display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: '#CAE8FF99' }}>
//                                 <CardMedia
//                                     component="img"
//                                     image={modalimage} // Replace with 3D model preview
//                                     alt="3D Model Preview"
//                                     sx={{ maxWidth: "100%" }}
//                                 />
//                             </Card>
//                             <Button variant="contained" sx={{ mt: 2, backgroundColor: '#0591FC', fontSize: '18px', fontWeight: 600, lineHeight: '27.78px' }}>
//                                 Select New Model
//                             </Button>
//                         </Box>
//                     </Grid>

//                     {/* Right Section - Calculation */}
//                     <Grid item xs={12} md={7} sx={{mt:6}}>
//                         <CalculationPreview />
//                     </Grid>
//                 </Grid>
//             </Box>

//             <CalculateButton
//                 handleCalculateCosts={handleCalculateCosts}
//                 disabled={!(isFileUploaded && selectedMaterialId && selectedMachines.length > 0)}
//                 isCalculationDone={isCalculationDone}
//                 handleChangeModel={handleChangeModel}
//                 handleChangeParams={handleChangeParams}
//             />
//             {setupCostsData && unitCostsData &&
//                 (<div className='cost-charts-container'>
//                     {/* Render charts if data is available */}
//                     <div className="chart-container">
//                         <h3>Setup Costs</h3>
//                         <Pie
//                             data={setupCostsData}
//                             options={setupChartOptions}
//                             plugins={[centerTextPlugin]}
//                         />
//                     </div>
//                     <div className="chart-container">
//                         <h3>Unit Costs</h3>
//                         <Pie
//                             data={unitCostsData}
//                             options={unitCostChartOptions}
//                             plugins={[centerTextPlugin]}
//                         />
//                     </div>
//                 </div>)
//             }
//         </Container>
//     );
// };

// export default Preview;
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
import apiClient from '../../../services/interceptor';
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
    width: '120px',
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
    abbreviation: data?.abbreviation,
    name: data?.name,
    working_span: data?.working_span,
    activeVariant1: data?.active,
    activeVariant2: data?.active,
    hourlyRate: data?.hourly_rate,
    baseSetupTime: 50,
    cuttingParameters: 50,
    transverse: 50,
    toolChange: 50,
    programmingTimes: 50,
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
      const response = await apiClient.put("/api/machine/" + formData?.id, payload);
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

