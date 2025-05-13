import React, { useState, useEffect } from 'react';
import './dashboard.css';
import { Box, Container, Stack, CircularProgress, Backdrop, Grid } from '@mui/material';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import apiClient from '../../services/interceptor';
import DashboardHeader from './DashboardHeader';
import CustomStepper from './CustomStepper';
import ModelSelection from './ModelSelection';
import DataSelection from './DataSelection';
import CalculateButton from './CalculateButton';
import ForgeViewerComponent from './ForgeViewerComponent';
import { colorPalette } from '../../utils/utils';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import EmptyCard from './ModelSelection/EmptyCard';
import CalculationPreview from './PreviewOfSelectedModel/CalculationPreview';
import { Modal } from '../../components/common/CustomModal';
import ModalComponent from './ModalData'
ChartJS.register(ArcElement, Tooltip, Legend);
ChartJS.register(ChartDataLabels);

const Dashboard = () => {
    const [isFileUploaded, setIsFileUploaded] = useState(false);
    const [materials, setMaterials] = useState([]);
    const [surfaceTreatments, setSurfaceTreatments] = useState([]);
    const [machines, setMachines] = useState([]);
    const [groupedMaterials, setGroupedMaterials] = useState({});
    const [groupedMachines, setGroupedMachines] = useState({});
    const [materialGroups, setMaterialGroups] = useState([]);
    const [volume, setVolume] = useState(0);
    const [surfaceArea, setSurfaceArea] = useState(0);
    const [isLoading, setIsLoading] = useState(true); // Add loading state
    const [cadFileId, setCadFileId] = useState('');
    const [uploadedFileName, setUploadedFileName] = useState('');
    const [accessToken, setAccessToken] = useState('');
    const [selectedMaterialId, setSelectedMaterialId] = useState('');
    const [selectedMachines, setSelectedMachines] = useState([]);
    const [selectedSurfaceTreatmentId, setSelectedSurfaceTreatmentId] = useState('');
    const [isCalculationDone, setIsCalculationDone] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const [setupCostsData, setSetupCostsData] = useState(null);
    const [unitCostsData, setUnitCostsData] = useState(null);
    const [setupCostsTotal, setSetupCostsTotal] = useState(0);
    const [unitCostsTotal, setUnitCostsTotal] = useState(0);
    const [openModal, setOpenModal] = useState(false)
    const steps = [
        { label: "Select Model & Adjust Technology Data" },
        { label: "Calculation Result" },
    ];
    const formatLegendLabel = (label) => {
        return label.split('_').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    const setupChartOptions = {
        plugins: {
            legend: {
                position: 'bottom', // Position of legends
                align: 'start', // Align legends
                labels: {
                    generateLabels: (chart) => {
                        const datasets = chart.data.datasets[0];
                        return chart.data.labels.map((label, i) => ({
                            text: `${formatLegendLabel(label)} - ${datasets.data[i]} AED`,
                            fillStyle: datasets.backgroundColor[i],
                        }));
                    },
                },
                onClick: (e, legendItem, legend) => {
                    // Get chart instance and dataset index
                    const chart = legend.chart;
                    const dataset = chart.data.datasets[0];
                    const index = legendItem.index;

                    // Highlight the selected segment by reducing opacity of others
                    dataset.backgroundColor = dataset.backgroundColor.map((color, i) => {
                        return i === index ? color : 'rgba(200, 200, 200, 0.3)';
                    });

                    chart.update();
                },
            },
            centerText: {
                text: `Setup Costs\n${setupCostsTotal.toFixed(2)} AED`, // Custom text
                fontSize: 18, // Optional: Font size for center text
                color: '#333', // Optional: Text color
            },
        },
    };

    const unitCostChartOptions = {
        plugins: {
            legend: {
                position: 'bottom', // Position of legends
                align: 'start', // Align legends
                labels: {
                    generateLabels: (chart) => {
                        const datasets = chart.data.datasets[0];
                        return chart.data.labels.map((label, i) => ({
                            text: `${formatLegendLabel(label)} - ${datasets.data[i]} AED`,
                            fillStyle: datasets.backgroundColor[i],
                        }));
                    },
                },
                onClick: (e, legendItem, legend) => {
                    // Get chart instance and dataset index
                    const chart = legend.chart;
                    const dataset = chart.data.datasets[0];
                    const index = legendItem.index;

                    // Highlight the selected segment by reducing opacity of others
                    dataset.backgroundColor = dataset.backgroundColor.map((color, i) => {
                        return i === index ? color : 'rgba(200, 200, 200, 0.3)';
                    });

                    chart.update();
                },
            },
            centerText: {
                text: `Unit Costs\n${unitCostsTotal.toFixed(2)} AED`, // Custom text
                fontSize: 18, // Optional: Font size for center text
                color: '#333', // Optional: Text color
            },
        },
    };

    const centerTextPlugin = {
        id: 'centerText',
        beforeDraw: (chart) => {
            const { width } = chart;
            const ctx = chart.ctx;
            ctx.save();

            // Display custom text in the center
            const centerText = chart.config.options.plugins.centerText;
            if (centerText && centerText.text) {
                const { text, fontSize = 16, color = '#000' } = centerText;

                // Split the text into multiple lines if `\n` is used
                const lines = text.split('\n');
                const lineHeight = fontSize + 4; // Adjust line height as needed

                // Calculate the starting position for the first line
                const textX = width / 2;
                const totalHeight = lines.length * lineHeight;
                const startY = chart.chartArea.top + (chart.chartArea.bottom - chart.chartArea.top) / 2 - totalHeight / 2;

                // Set font properties
                ctx.font = `bold ${fontSize}px Arial`;
                ctx.textAlign = 'center';
                ctx.fillStyle = color;

                // Draw each line
                lines.forEach((line, index) => {
                    const textY = startY + index * lineHeight;
                    ctx.fillText(line, textX, textY);
                });
            }


            ctx.restore();
        },
    };

    // Fetch API Data
    const fetchApiData = async () => {
        try {
            const [materialsRes, machinesRes, surfaceTratmentRes, materialGroupsRes] = await Promise.all([
                apiClient.get('/api/material'),
                apiClient.get('/api/machine'),
                apiClient.get('/api/surface-treatment'),
                apiClient.get('/api/material-group')
            ]);
            setMaterials(materialsRes.data.materials);
            setMachines(machinesRes.data.machines);
            setSurfaceTreatments(surfaceTratmentRes.data.surface_treatments);
            setMaterialGroups(materialGroupsRes.data.material_groups);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // Group Materials by Groups
    const groupMaterialsByGroups = () => {
        const grouped = materialGroups.reduce((acc, group) => {
            const groupMaterials = materials.filter(material => material.material_group_id === group.id);
            acc[group.name] = groupMaterials;
            return acc;
        }, {});
        setGroupedMaterials(grouped);
    };

    // Group Machines by Categories
    const groupMachinesByCategories = () => {
        const grouped = machines?.reduce((acc, machine) => {
            const category = machine.category;
            if (!acc[category]) acc[category] = [];
            acc[category].push(machine);
            return acc;
        }, {});
        setGroupedMachines(grouped);
    };

    // Fetch Data and Prepare Groups
    const initializeData = async () => {
        setIsLoading(true);
        await fetchApiData();
        setIsLoading(false);
    };

    useEffect(() => {
        initializeData();
    }, []);

    useEffect(() => {
        if (materials.length && materialGroups.length) groupMaterialsByGroups();
    }, [materials, materialGroups]);

    useEffect(() => {
        if (machines.length) groupMachinesByCategories();
    }, [machines]);

    // Handle file upload
    const handleUpload = async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            setIsLoading(true);
            const response = await apiClient.post('/api/cad/upload', formData);
            setIsFileUploaded(true);
            setCadFileId(response.data.file_id);
            setUploadedFileName(response.data.data.objectKey);
            const token = await getForgeToken();
            setAccessToken(token);
        } catch (error) {
            console.error('Upload failed:', error);
        }
        setIsLoading(false);
    };

    const handleMaterialSelection = (materialId) => {
        setSelectedMaterialId(materialId);
    };

    const handleSurfaceTreatmentSelection = (surfaceTreatmentId) => {
        setSelectedSurfaceTreatmentId(surfaceTreatmentId);
    };

    const handleMachineSelection = (finalAddedMachines) => {
        setSelectedMachines(finalAddedMachines);
    };

    const getForgeToken = async () => {
        try {
            const response = await apiClient.get('/api/forge-token/', {
                method: 'GET',
                credentials: 'include',
            });
            return response.data.forge_token;
        } catch (error) {
            console.error('Error fetching Forge token:', error);
            return '';
        }
    };

    const getMachiningCost = (programmingTime) => {
        const programmingTimeParam = programmingTime.split(" ");
        if (programmingTimeParam[1] === 'hour' || programmingTimeParam[1] === 'hours') {
            return parseFloat(programmingTime[0]);
        } else {
            return parseFloat(programmingTime[0]) / 60;
        }
    };

    const getSelectedMachine = (selectedMachines) => {
        return selectedMachines.map((machine) => {
            return {
                ...machines.find((m) => m.id === machine.id),
                machining_time: getMachiningCost(machine.programmingTime)
            };
        });
    };

    const getDimensions = (dimensionValues) => {
        setVolume(dimensionValues.rawMaterialDimensions.volume);
        setSurfaceArea(dimensionValues.rawMaterialDimensions.surfaceArea);
    }

    const calcSetupCostsTotal = (setupCosts) => {
        const total = Object.values(setupCosts).reduce((a, b) => a + b, 0);
        setSetupCostsTotal(total);
    };

    const calcUnitCostsTotal = (unitCosts) => {
        const total = Object.values(unitCosts).reduce((a, b) => a + b, 0);
        setUnitCostsTotal(total);
    };

    const handleCalculateCosts = async () => {
        try {
            const response = await apiClient.post('/api/calculate/total-cost', {
                selectedMaterial: materials.find((m) => m.id === selectedMaterialId),
                selectedSurfaceTreatment: surfaceTreatments.find((sT) => sT.id === selectedSurfaceTreatmentId),
                selectedMachines: getSelectedMachine(selectedMachines),
                volume: volume,
                surfaceArea: surfaceArea
            });
            setIsCalculationDone(true);
            setActiveStep((prevStep) => {
                if (prevStep < steps.length - 1) {
                    return prevStep + 1;
                } else {
                    setIsCalculationDone(true);
                    return prevStep;
                }
            });
            const { setupCosts, unitCosts } = response.data;

            calcSetupCostsTotal(setupCosts);
            calcUnitCostsTotal(unitCosts);

            // Prepare chart data for Setup Costs
            const setupChartData = {
                labels: Object.keys(setupCosts),
                datasets: [
                    {
                        data: Object.values(setupCosts),
                        backgroundColor: colorPalette,
                        hoverOffset: 4,
                        cutout: '50%',
                        datalabels: {
                            color: '#fff',
                            formatter: (value, context) => {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return percentage > 0 ? `${percentage}%` : '';
                            },
                        },
                    },
                ],
            };

            // Prepare chart data for Unit Costs
            const unitChartData = {
                labels: Object.keys(unitCosts),
                datasets: [
                    {
                        data: Object.values(unitCosts),
                        // add more colors
                        backgroundColor: colorPalette,
                        hoverOffset: 4,
                        cutout: '50%',
                        datalabels: {
                            color: '#fff',
                            formatter: (value, context) => {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return percentage > 0 ? `${percentage}%` : '';
                            },
                        },
                    },
                ],
            };

            setSetupCostsData(setupChartData);
            setUnitCostsData(unitChartData);
            setOpenModal(true)

        } catch (error) {
            console.error('Error calculating costs:', error);
            setIsLoading(false);
        }
    };

    const resetCosts = () => {
        setSetupCostsData(null);
        setUnitCostsData(null);
        setSetupCostsTotal(0);
        setUnitCostsTotal(0);
    };

    const handleChangeModel = () => {
        setIsCalculationDone(false);
        setIsFileUploaded(false);
        resetCosts();
    };

    const handleChangeParams = () => {
        setIsCalculationDone(false);
        resetCosts();
    };

    return (
        <Container maxWidth="lg" sx={{ padding: '20px' }}>
            {/* Loading Overlay */}
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
            <DashboardHeader />
            <CustomStepper isCalculationDone={isCalculationDone} steps={steps} activeStep={activeStep} />

            <div>
                <Box
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 2,
                    }}
                > {/* Defines a responsive grid container */}
                    {/* First Column */}
                    <Box
                        sx={{
                            flex: { xs: '1 1 100%', md: '1 1 40%' },
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                        className="model-container"
                    >
                        {isFileUploaded ? (
                            <Stack className="forge-container">
                                <ForgeViewerComponent
                                    fileId={cadFileId}
                                    accessToken={accessToken}
                                    setDimensions={getDimensions}
                                />
                            </Stack>
                        ) : (
                            <ModelSelection onUpload={handleUpload} />
                        )}
                    </Box>

                    {/* Second Column */}
                    {/* <Grid item xs={12} md={7} >
                        {Object.keys(groupedMaterials).length > 0 &&
                            Object.keys(groupedMachines).length > 0 && (
                                <DataSelection
                                    machines={groupedMachines}
                                    materials={groupedMaterials}
                                    surfaceTreatments={surfaceTreatments}
                                    uploadedFileName={uploadedFileName}
                                    handleSurfaceTreatmentSelection={handleSurfaceTreatmentSelection}
                                    handleMachineSelection={handleMachineSelection}
                                    handleMaterialSelection={handleMaterialSelection}
                                />
                            )}
                    </Grid> */}

                    <Box
                        sx={{
                            flex: { xs: '1 1 100%', md: '1 1 60%' },
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        {setupCostsData && unitCostsData ? (
                            <CalculationPreview uploadedFileName={uploadedFileName}
                                selectedMaterial={materials.find((m) => m.id === selectedMaterialId)}
                                selectedSurfaceTreatment={surfaceTreatments.find((sT) => sT.id === selectedSurfaceTreatmentId)}
                                selectedMachines={getSelectedMachine(selectedMachines)}
                                volume={volume}
                                surfaceArea={surfaceArea}
                                setupCostsData={setupCostsData}
                                unitCostsData={unitCostsData}

                            />
                        ) : (
                            Object.keys(groupedMaterials).length > 0 &&
                            Object.keys(groupedMachines).length > 0 && (
                                <DataSelection
                                    machines={groupedMachines}
                                    materials={groupedMaterials}
                                    surfaceTreatments={surfaceTreatments}
                                    uploadedFileName={uploadedFileName}
                                    handleSurfaceTreatmentSelection={handleSurfaceTreatmentSelection}
                                    handleMachineSelection={handleMachineSelection}
                                    handleMaterialSelection={handleMaterialSelection}
                                />
                            )
                        )}
                    </Box>
                </Box>
            </div>

            <CalculateButton
                handleCalculateCosts={handleCalculateCosts}
                disabled={!(isFileUploaded && selectedMaterialId && selectedMachines.length > 0)}
                isCalculationDone={isCalculationDone}
                handleChangeModel={handleChangeModel}
                handleChangeParams={handleChangeParams}
            />
            {setupCostsData && unitCostsData &&
                (<div className='cost-charts-container'>
                    {/* Render charts if data is available */}
                    <div className="chart-container">
                        <h3>Setup Costs</h3>
                        <Pie
                            data={setupCostsData}
                            options={setupChartOptions}
                            plugins={[centerTextPlugin]}
                        />
                    </div>
                    <div className="chart-container">
                        <h3>Unit Costs</h3>
                        <Pie
                            data={unitCostsData}
                            options={unitCostChartOptions}
                            plugins={[centerTextPlugin]}
                        />
                    </div>
                </div>)
            }
            <Modal
                isOpen={openModal}
                onClose={() => setOpenModal(false)}
                title="Calculation result"
            >
                <Box sx={{ pb: 5 }}>
                    <ModalComponent
                        selectedMaterial={materials.find((m) => m.id === selectedMaterialId)}
                        selectedSurfaceTreatment={surfaceTreatments.find((sT) => sT.id === selectedSurfaceTreatmentId)}
                        selectedMachines={getSelectedMachine(selectedMachines)}
                        volume={volume}
                        surfaceArea={surfaceArea}
                        setupCostsData={setupCostsData}
                        unitCostsData={unitCostsData}
                    />
                </Box>
            </Modal>
        </Container>
    );
};

export default Dashboard;
