"use client"

import React from 'react';
import {
    Container,
    Box,
    Typography,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Card,
    CardContent,
    useMediaQuery,
    createTheme,
} from "@mui/material";
import logo from '../../../assets/images/Group 7.png'
import { Height, Image } from '@mui/icons-material';
const theme = createTheme();
interface CostData {
    costs: {
        raw_material_cost: number;
        setup_cost: number;
        machining_cost: number;
        quality_control_cost: number;
        surface_finish_cost: number;
        total_cost: number;
    };
    calculations: {
        raw_material: {
            model_dimensions_mm: {
                length: number;
                width: number;
                height: number;
            };
            raw_material_dimensions_mm: {
                length: number;
                width: number;
                height: number;
            };
            volume_mm3: number;
            mass_kg: number;
            price_per_kg: number;
            total_cost: number;
        };
        setup: {
            machine_setup: {
                number_of_setups: number;
                total_machine_setup_time: number;
            };
            tool_setup: {
                number_of_tools: number;
                total_tool_setup_time: number;
            };
            work_setup: {
                work_setup_time: number;
            };
            total_time_minutes: number;
            total_time_hours: number;
            hourly_rate: number;
        };
        machining: {
            operations: {
                number_of_operations: number;
                total_machining_time_minutes: number;
            };
            hourly_rate: number;
        };
        surface_treatment: {
            price_per_kg: number;
        };
        intricate:any
    };
}

interface CostingReportProps {
    costData: CostData;
    uploadedFileName: string;
    selectedMaterialGroupName: string;
    selectedMaterialName: string;
    selectedSurfaceTreatmentName: string;
    quantity: any;
}

export default function CostingReportshow({
    costData,
    uploadedFileName,
    selectedMaterialGroupName,
    selectedMaterialName,
    selectedSurfaceTreatmentName,
    quantity
}: CostingReportProps) {
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const tableCellStyles = {
        border: 2,
        borderColor: "divider",
        padding: isMobile ? 0 : 2,
        fontSize: isMobile ? '0.75rem' : '0.875rem',
    };

    const headerCellStyles = {
        ...tableCellStyles,
        fontWeight: 600,
    
    };
    const formatMinutesToMinutesAndSeconds = (totalMinutes) => {
        if (!totalMinutes) return "0m 0s";

        // Convert totalMinutes to string, split at the decimal point
        const [minutes, fractionalPart] = totalMinutes.toString().split('.');

        // If there's no fractional part, set seconds to 0
        const seconds = fractionalPart ? Math.floor(fractionalPart) : 0;

        return `${minutes} Minutes ${seconds} Seconds`;
    };



    return (
        <Container maxWidth="lg" sx={{ mb: 4, px: isMobile ? 1 : 2 }}>
            <Box sx={{ bgcolor: "#2196f3", color: "white", p: 2, mb: 3 }}>
                <Box sx={{ display: "flex", justifyContent: 'start', alignItems: "center", gap: 1, flexWrap: 'wrap' }}>
                    <img src={logo} alt="estimate.ae logo" height={'auto'} width={'auto'} style={{ backgroundColor: '#fff' }} />
                    <Typography variant={isMobile ? "h6" : "h5"} sx={{ fontWeight: 600, textAlign: 'start', mt: 1 }}>
                        ESTIMATE REPORT
                    </Typography>
                </Box>
            </Box>

            <Box sx={{ "& > *": { mb: 3 } }}>
                <Card sx={{ border: 2, borderColor: "divider" }}>
                    <CardContent sx={{ p: { xs: 0, sm: 5 } }}>
                        <Table size={isMobile ? "small" : "medium"}>
                            <TableBody>
                                {[
                                    { label: "Item Name", value: uploadedFileName },
                                    // {
                                    //     label: "Machine",
                                    //     value: uploadedFileName.toLowerCase().includes('shaft') || uploadedFileName.toLowerCase().includes('sample8')
                                    //         ? 'CNC Turning Machine [small]'
                                    //         : uploadedFileName.toLowerCase().includes('block') || uploadedFileName.toLowerCase().includes('lh') || uploadedFileName.toLowerCase().includes('sample9')
                                    //             ? '3-axis Milling Machine [small]'
                                    //             : 'Mill-Turning Machine'
                                    // },
                                    {
                                        label: "Machine",
                                        value: costData?.calculations?.machining?.machine_name
                                    },
                                    { label: "Material", value: `${selectedMaterialGroupName} (${selectedMaterialName})` },
                                    { label: "Surface Finish", value: selectedSurfaceTreatmentName },
                                    { label: "Tolerance", value: "ISO 2768" },
                                    { label: "Mass of Material", value: `${costData?.calculations?.raw_material?.mass_kg.toFixed(2)} kg` },
                                    {
                                        label: "Model Bounding Box Size",
                                        value: `${costData?.calculations?.raw_material?.model_dimensions_mm?.length.toFixed(1)}mm x ${costData.calculations?.raw_material?.model_dimensions_mm?.width.toFixed(1)}mm x ${costData.calculations?.raw_material?.model_dimensions_mm?.height.toFixed(1)}mm`,
                                    },
                                ].map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell sx={{ ...headerCellStyles, width: isMobile ? "40%" : "33%" }}>
                                            {row.label}
                                        </TableCell>
                                        <TableCell sx={tableCellStyles}>{row.value}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Card sx={{ border: 2, borderColor: "divider" }}>
                    <CardContent sx={{ p: { xs: 0, sm: 5 } }}>
                        <Table size={isMobile ? "small" : "medium"}>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={headerCellStyles}>Content</TableCell>
                                    <TableCell sx={headerCellStyles}>Parameters</TableCell>
                                    <TableCell sx={{ ...headerCellStyles, textAlign: "right" }}>Values</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {/* Raw Material Cost Section */}
                                <TableRow>
                                    <TableCell sx={{ ...headerCellStyles }}>
                                        Raw material cost
                                    </TableCell>
                                    <TableCell sx={tableCellStyles}>Raw material cost</TableCell>
                                    <TableCell sx={{ ...tableCellStyles, textAlign: "right" }}>
                                        {quantity * costData?.costs?.raw_material_cost} AED
                                    </TableCell>
                                    {/* <TableCell sx={tableCellStyles}>Model Bounding Box Size (mm)</TableCell>
                                    <TableCell sx={{ ...tableCellStyles, textAlign: "right" }}>
                                        {`${costData?.calculations?.raw_material?.model_dimensions_mm?.length.toFixed(1)}mm x ${costData.calculations?.raw_material?.model_dimensions_mm?.width.toFixed(1)}mm x ${costData.calculations?.raw_material?.model_dimensions_mm?.height.toFixed(1)}mm`}
                                    </TableCell> */}
                                </TableRow>
                                {/* <TableRow>
                                    <TableCell sx={tableCellStyles}>Raw material cost/kg</TableCell>
                                    <TableCell sx={{ ...tableCellStyles, textAlign: "right" }}>
                                        {costData?.calculations?.raw_material?.price_per_kg.toFixed(2)} AED / KG
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={tableCellStyles}>Raw material size</TableCell>
                                    <TableCell sx={{ ...tableCellStyles, textAlign: "right" }}>
                                        {`${costData?.calculations?.raw_material?.raw_material_dimensions_mm?.length.toFixed(1)}mm x ${costData?.calculations?.raw_material?.raw_material_dimensions_mm?.width.toFixed(1)}mm x ${costData?.calculations?.raw_material?.raw_material_dimensions_mm?.height.toFixed(1)}mm`}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={tableCellStyles}>Raw material weight</TableCell>
                                    <TableCell sx={{ ...tableCellStyles, textAlign: "right" }}>
                                        {costData?.calculations?.raw_material?.mass_kg.toFixed(2)} kg
                                    </TableCell>
                                </TableRow> 
                                <TableRow>
                                    <TableCell sx={tableCellStyles}>Raw material cost</TableCell>
                                    <TableCell sx={{ ...tableCellStyles, textAlign: "right" }}>
                                        {quantity * costData?.costs?.raw_material_cost} AED
                                    </TableCell>
                                </TableRow>*/}

                                {/* Setup Cost Section */}
                                <TableRow>
                                    <TableCell sx={headerCellStyles} >
                                        Setup cost
                                    </TableCell>
                                    <TableCell sx={tableCellStyles}>Total setup Cost</TableCell>
                                    <TableCell sx={{ ...tableCellStyles, textAlign: "right" }}>
                                        {costData?.costs?.setup_cost} AED
                                    </TableCell>
                                    {/* <TableCell sx={tableCellStyles}>Number of setups</TableCell>
                                    <TableCell sx={{ ...tableCellStyles, textAlign: "right" }}>
                                        {costData?.calculations?.setup?.machine_setup?.number_of_setups}
                                    </TableCell> */}
                                </TableRow>
                                {/* <TableRow>
                                    <TableCell sx={tableCellStyles}>Number of tools</TableCell>
                                    <TableCell sx={{ ...tableCellStyles, textAlign: "right" }}>
                                        {costData?.calculations?.setup?.tool_setup?.number_of_tools}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={tableCellStyles}>Machine Setup time</TableCell>
                                    <TableCell sx={{ ...tableCellStyles, textAlign: "right" }}>
                                        {costData?.calculations?.setup?.machine_setup?.total_machine_setup_time} Minutes
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={tableCellStyles}>Tool setup time</TableCell>
                                    <TableCell sx={{ ...tableCellStyles, textAlign: "right" }}>
                                        {costData?.calculations?.setup?.tool_setup?.total_tool_setup_time} Minutes
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={tableCellStyles}>Work setup time</TableCell>
                                    <TableCell sx={{ ...tableCellStyles, textAlign: "right" }}>
                                        {costData?.calculations?.setup?.work_setup?.work_setup_time} Minutes
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={tableCellStyles}>Total setup time</TableCell>
                                    <TableCell sx={{ ...tableCellStyles, textAlign: "right" }}>
                                        {costData?.calculations?.setup?.total_time_minutes} Minutes
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={tableCellStyles}>Setup cost per hour</TableCell>
                                    <TableCell sx={{ ...tableCellStyles, textAlign: "right" }}>
                                        {costData?.calculations?.setup?.tool_setup?.setup_cost_per_hour} AED
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={tableCellStyles}>Total setup Cost</TableCell>
                                    <TableCell sx={{ ...tableCellStyles, textAlign: "right" }}>
                                        {costData?.costs?.setup_cost} AED
                                    </TableCell>
                                </TableRow> */}

                                {/* Machining Cost Section */}
                                <TableRow>
                                    <TableCell sx={headerCellStyles} >
                                        Machining cost
                                    </TableCell>
                                    <TableCell sx={tableCellStyles}>Total machining cost</TableCell>
                                    <TableCell sx={{ ...tableCellStyles, textAlign: "right" }}>
                                        {costData?.costs?.machining_cost} AED
                                    </TableCell>
                                    {/* <TableCell sx={tableCellStyles}>Number of Machining Process</TableCell>
                                    <TableCell sx={{ ...tableCellStyles, textAlign: "right" }}>
                                        {costData?.calculations?.machining?.operations?.number_of_operations}
                                    </TableCell> */}
                                </TableRow>
                                {/* <TableRow>
                                    <TableCell sx={tableCellStyles}>Number of Tools</TableCell>
                                    <TableCell sx={{ ...tableCellStyles, textAlign: "right" }}>
                                        {costData?.calculations?.setup?.tool_setup?.number_of_tools}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={tableCellStyles}>Machining Hours (time)</TableCell>
                                    <TableCell sx={{ ...tableCellStyles, textAlign: "right" }}>
                                        {formatMinutesToMinutesAndSeconds(costData?.calculations?.machining?.operations?.total_machining_time_minutes)}
                                    </TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell sx={tableCellStyles}>Machining hours rate</TableCell>
                                    <TableCell sx={{ ...tableCellStyles, textAlign: "right" }}>
                                        {costData?.calculations?.machining?.hourly_rate} AED/hr
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={tableCellStyles}>Total machining cost</TableCell>
                                    <TableCell sx={{ ...tableCellStyles, textAlign: "right" }}>
                                        {costData?.costs?.machining_cost} AED
                                    </TableCell>
                                </TableRow> */}

                                {/* Surface Finish Cost Section */}
                                <TableRow>
                                    <TableCell sx={headerCellStyles} >
                                        Surface finish cost
                                    </TableCell>
                                    <TableCell sx={tableCellStyles}>Total surface finish cost</TableCell>
                                    <TableCell sx={{ ...tableCellStyles, textAlign: "right" }}>
                                        {costData?.costs?.surface_finish_cost} AED
                                    </TableCell>
                                    {/* <TableCell sx={tableCellStyles}>Surface Finish Type</TableCell>
                                    <TableCell sx={{ ...tableCellStyles, textAlign: "right" }}>
                                        {selectedSurfaceTreatmentName}
                                    </TableCell> */}
                                </TableRow>
                                {/* <TableRow>
                                    <TableCell sx={tableCellStyles}>Surface Finish cost</TableCell>
                                    <TableCell sx={{ ...tableCellStyles, textAlign: "right" }}>
                                        {costData?.calculations?.surface_treatment?.surface_finish_cost.toFixed(2)} AED/kg (Minimum Price 20 AED)
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={tableCellStyles}>Total surface finish cost</TableCell>
                                    <TableCell sx={{ ...tableCellStyles, textAlign: "right" }}>
                                        {costData?.costs?.surface_finish_cost} AED
                                    </TableCell>
                                </TableRow> */}

                                {/* Quality Control Cost Section */}
                                <TableRow>
                                    <TableCell sx={headerCellStyles}>Quality control cost</TableCell>
                                    <TableCell sx={tableCellStyles}>Quality Control Cost</TableCell>
                                    <TableCell sx={{ ...tableCellStyles, textAlign: "right" }}>
                                        {costData?.costs?.quality_control_cost} AED
                                    </TableCell>
                                </TableRow>

                                {/* Total Amount Section */}
                                <TableRow>
                                    <TableCell sx={headerCellStyles}>Total Amount</TableCell>
                                    <TableCell sx={tableCellStyles}>Total Cost Per Piece</TableCell>
                                    <TableCell sx={{ ...tableCellStyles, textAlign: "right"}}>
                                        {costData?.costs?.total_cost} AED / piece
                                    </TableCell>
                                </TableRow>
                                <TableRow >
                                    <TableCell colSpan={3} sx={{ color: costData?.calculations?.intricate > 0 ? 'red' : 'green' }}
                                    >
                                        {/* {uploadedFileName.toLowerCase().includes('block') || uploadedFileName.toLowerCase().includes('lh') ? (
                                            'Note - (Intricate Shape Error) Non-machinable square hole is there in uploaded model. Consider manual cost estimation for this shape.'
                                        ) : (
                                            '' // Removed green lines or notes for non-error cases
                                        )} */}
                                        {costData?.calculations?.intricate > 0 ? (
                                            'Note - (Intricate Shape Error) Non-machinable square hole is there in uploaded model. Consider manual cost estimation for this shape.'
                                        ) : (
                                            '' // Removed green lines or notes for non-error cases
                                        )}
                                    </TableCell>

                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Typography variant="body2" sx={{ color: "text.secondary", fontStyle: "italic", fontSize: isMobile ? '0.7rem' : '0.875rem' }}>
                    Disclaimer: - This is AI-generated estimation please cross-verify before considering
                </Typography>
            </Box>

            <Box sx={{ bgcolor: "#2196f3", color: "white", p: 2, mt: 3, textAlign: "right" }}>
                <Typography sx={{ fontSize: isMobile ? '0.8rem' : '1rem' }}>www.estimate.ae</Typography>
            </Box>
        </Container>
    );
}

