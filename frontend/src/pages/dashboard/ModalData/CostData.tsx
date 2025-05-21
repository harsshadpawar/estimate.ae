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
import logo from '@/assets/images/Group 7.png'
import { Image } from '@mui/icons-material';
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
            surface_price: number;
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
            surface_price: number;
        };
        intricate: any
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

export default function CostingReport({
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
        padding: isMobile ? 0 : 1,
        fontSize: isMobile ? '0.75rem' : '0.875rem',
    };

    const headerCellStyles = {
        ...tableCellStyles,
        fontWeight: 600,
    };
    const formatMinutesToMinutesAndSeconds = (input) => {

        if (!input) return "0h 0m 0s";

        // Split the input into whole and decimal parts
        const [wholePart, decimalPart] = input.toString().split('.');

        // Convert whole part to number
        let minutes = parseInt(wholePart, 10);

        // Convert decimal part to seconds (if exists)
        const seconds = decimalPart ? parseInt(decimalPart, 10) : 0;

        // Calculate hours if minutes exceed 60
        const hours = Math.floor(minutes / 60);
        minutes = minutes % 60;

        // Build the output string
        let result = "";
        if (hours > 0) {
            result += `${hours} hour${hours !== 1 ? 's' : ''} `;
        }
        if (minutes > 0 || hours > 0) {
            result += `${minutes} minute${minutes !== 1 ? 's' : ''} `;
        }
        if (seconds > 0 || (hours === 0 && minutes === 0)) {
            result += `${seconds} second${seconds !== 1 ? 's' : ''}`;
        }

        return result.trim();
    };



    return (
        <Container maxWidth="lg" sx={{ mt: 1, px: isMobile ? 1 : 2 }}>
            <Box sx={{ bgcolor: "#2196f3", color: "white", p: 1, mb: 1 }}>
                <Box sx={{ display: "flex", justifyContent: 'start', alignItems: "center", gap: 1, flexWrap: 'wrap' }}>
                    <img src={logo} alt="estimate.ae logo" style={{ backgroundColor: '#fff' }} />
                    <Typography variant={isMobile ? "h6" : "h5"} sx={{ fontWeight: 500, textAlign: 'start', mt: 1 }}>
                        ESTIMATE REPORT
                    </Typography>
                </Box>
            </Box>

            <Box >
                {/* <Card sx={{mb:0,p:0}}>
                    <CardContent sx={{ p: { xs: 0, sm: 1 } }}> */}
                <Table size={isMobile ? "small" : "medium"}>
                    <TableBody>
                        {[
                            { label: "Item Name", value: uploadedFileName },
                            {
                                label: "Machine",
                                value: `${costData?.calculations?.machining?.machine_name}`
                            },
                            { label: "Material", value: `${selectedMaterialGroupName} (${selectedMaterialName})` },
                            { label: "Surface Finish", value: selectedSurfaceTreatmentName },
                            { label: "Tolerance", value: "ISO 2768" },
                            { label: "Mass of Model", value: `${costData?.calculations?.raw_material?.mass_kg.toFixed(2)} kg` },
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
                {/* </CardContent>
                </Card> */}

                {/* <Card sx={{mt:0,p:0}}>
                    <CardContent sx={{ p: { xs: 0, sm: 1 } }}> */}
                <Table size={isMobile ? "small" : "medium"} sx={{ marginTop: 0 }}>
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
                            <TableCell sx={{ ...headerCellStyles }} rowSpan={6}>
                                Raw material cost
                            </TableCell>
                            {/* <TableCell sx={tableCellStyles}>Model Bounding Box Size (mm)</TableCell>
                                    <TableCell sx={{ ...tableCellStyles, textAlign: "right" }}>
                                        {`${costData?.calculations?.raw_material?.model_dimensions_mm?.length.toFixed(1)}mm x ${costData.calculations?.raw_material?.model_dimensions_mm?.width.toFixed(1)}mm x ${costData.calculations?.raw_material?.model_dimensions_mm?.height.toFixed(1)}mm`}
                                    </TableCell> */}
                        </TableRow>
                        {costData?.calculations?.raw_material?.price_per_kg > 0 ? (
                            <TableRow>
                                <TableCell sx={tableCellStyles}>Raw material cost/kg</TableCell>
                                <TableCell sx={{ ...tableCellStyles, textAlign: "right" }}>
                                    {costData?.calculations?.raw_material?.price_per_kg.toFixed(2)} AED / KG
                                </TableCell>
                            </TableRow>) : (
                            <TableRow>
                                <TableCell sx={tableCellStyles}>Surface Price</TableCell>
                                <TableCell sx={{ ...tableCellStyles, textAlign: "right" }}>
                                    {costData?.calculations?.raw_material?.surface_price.toFixed(2)} AED / dm2
                                </TableCell>
                            </TableRow>)}
                        <TableRow>
                            <TableCell sx={tableCellStyles}>Raw material size</TableCell>
                            <TableCell sx={{ ...tableCellStyles, textAlign: "right" }}>
                                {`${(parseFloat(costData?.calculations?.raw_material?.raw_material_dimensions_mm?.length.toFixed(1)) + 1).toFixed(1)}mm x ${(parseFloat(costData?.calculations?.raw_material?.raw_material_dimensions_mm?.width.toFixed(1)) + 1).toFixed(1)}mm x ${(parseFloat(costData?.calculations?.raw_material?.raw_material_dimensions_mm?.height.toFixed(1)) + 1).toFixed(1)}mm`}

                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell sx={tableCellStyles}>Raw material weight</TableCell>
                            <TableCell sx={{ ...tableCellStyles, textAlign: "right" }}>
                                {costData?.calculations?.raw_material?.weight_kg?.toFixed(2)} kg
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell sx={tableCellStyles}>Raw material cost</TableCell>
                            <TableCell sx={{ ...tableCellStyles, textAlign: "right" }}>
                                {quantity * costData?.costs?.raw_material_cost} AED
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell sx={tableCellStyles}>Scrap material</TableCell>
                            <TableCell sx={{ ...tableCellStyles, textAlign: "right" }}>
                                {`${Math.abs((costData?.calculations?.raw_material?.weight_kg - costData?.calculations?.raw_material?.mass_kg).toFixed(2))} kg`}
                            </TableCell>
                        </TableRow>

                        {/* Setup Cost Section */}
                        <TableRow>
                            <TableCell sx={headerCellStyles} rowSpan={8}>
                                Setup cost
                            </TableCell>
                            <TableCell sx={tableCellStyles}>Number of setups</TableCell>
                            <TableCell sx={{ ...tableCellStyles, textAlign: "right" }}>
                                {costData?.calculations?.setup?.number_of_setups}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell sx={tableCellStyles}>Number of tools</TableCell>
                            <TableCell sx={{ ...tableCellStyles, textAlign: "right" }}>
                                {costData?.calculations?.setup?.number_of_tools}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell sx={tableCellStyles}>Machine Setup time</TableCell>
                            <TableCell sx={{ ...tableCellStyles, textAlign: "right" }}>
                                {costData?.calculations?.setup?.machine_setup_time} Minutes
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell sx={tableCellStyles}>Tool setup time</TableCell>
                            <TableCell sx={{ ...tableCellStyles, textAlign: "right" }}>
                                {costData?.calculations?.setup?.tool_setup_time} Minutes
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell sx={tableCellStyles}>Work setup time</TableCell>
                            <TableCell sx={{ ...tableCellStyles, textAlign: "right" }}>
                                {costData?.calculations?.setup?.work_setup} Minutes
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
                                {costData?.calculations?.setup?.setup_cost_per_hour} AED
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell sx={tableCellStyles}>Total setup Cost</TableCell>
                            <TableCell sx={{ ...tableCellStyles, textAlign: "right" }}>
                                {costData?.costs?.setup_cost} AED
                            </TableCell>
                        </TableRow>

                        {/* Machining Cost Section */}
                        <TableRow>
                            <TableCell sx={headerCellStyles} rowSpan={5}>
                                Machining cost
                            </TableCell>
                            <TableCell sx={tableCellStyles}>Number of Machining Process</TableCell>
                            <TableCell sx={{ ...tableCellStyles, textAlign: "right" }}>
                                {costData?.calculations?.machining?.number_of_operations}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell sx={tableCellStyles}>Number of Tools</TableCell>
                            <TableCell sx={{ ...tableCellStyles, textAlign: "right" }}>
                                {costData?.calculations?.setup?.number_of_tools}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell sx={tableCellStyles}>Machining Hours (time)</TableCell>
                            <TableCell sx={{ ...tableCellStyles, textAlign: "right" }}>
                                {formatMinutesToMinutesAndSeconds(costData?.calculations?.machining?.total_time_hours)}
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
                        </TableRow>

                        {/* Surface Finish Cost Section */}
                        <TableRow>
                            <TableCell sx={headerCellStyles} rowSpan={3}>
                                Surface finish cost
                            </TableCell>
                            <TableCell sx={tableCellStyles}>Surface Finish Type</TableCell>
                            <TableCell sx={{ ...tableCellStyles, textAlign: "right" }}>
                                {selectedSurfaceTreatmentName}
                            </TableCell>
                        </TableRow>
                        {costData?.calculations?.surface_treatment?.price_per_kg > 0 ? (
                            <TableRow>
                                <TableCell sx={tableCellStyles}>Surface Finish cost</TableCell>
                                <TableCell sx={{ ...tableCellStyles, textAlign: "right" }}>
                                    {costData?.calculations?.surface_treatment?.price_per_kg.toFixed(2)} AED/kg (Minimum Price 20 AED)
                                </TableCell>
                            </TableRow>
                        ) : (
                            <TableRow>
                                <TableCell sx={tableCellStyles}>Surface Finish cost</TableCell>
                                <TableCell sx={{ ...tableCellStyles, textAlign: "right" }}>
                                    {costData?.calculations?.surface_treatment?.surface_price.toFixed(2)} AED/dm2 (Minimum Price 20 AED)
                                </TableCell>
                            </TableRow>
                        )}
                        <TableRow>
                            <TableCell sx={tableCellStyles}>Total surface finish cost</TableCell>
                            <TableCell sx={{ ...tableCellStyles, textAlign: "right" }}>
                                {costData?.costs?.surface_finish_cost} AED
                            </TableCell>
                        </TableRow>

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
                            <TableCell sx={{ ...tableCellStyles, textAlign: "right", color: 'red', fontWeight: 600 }}>
                                {costData?.costs?.total_cost} AED / piece
                            </TableCell>
                        </TableRow>
                        {/* Quantity section ============================ */}
                        <TableRow>
                            <TableCell sx={headerCellStyles} rowSpan={3}>
                                Cost per Quantity
                            </TableCell>
                            <TableCell sx={tableCellStyles}>Quantity</TableCell>
                            <TableCell sx={{ ...tableCellStyles, textAlign: "right" }}>
                                {costData?.calculations?.quantities?.results[0]?.quantity}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell sx={tableCellStyles}>Cost/Piece</TableCell>
                            <TableCell sx={{ ...tableCellStyles, textAlign: "right" }}>
                                {costData?.calculations?.quantities?.results[0]?.total_cost_per_piece.toFixed(2)} AED/piece
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell sx={tableCellStyles}>Total Quantity cost</TableCell>
                            <TableCell sx={{ ...tableCellStyles, textAlign: "right" }}>
                                {(costData?.calculations?.quantities?.results[0]?.quantity * costData?.calculations?.quantities?.results[0]?.total_cost_per_piece.toFixed(2)).toFixed(2)} AED
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
                {/* </CardContent>
                </Card> */}

                <Typography sx={{ color: "text.secondary", fontStyle: "italic", fontSize: isMobile ? '0.7rem' : '0.875rem', marginTop: 0 }}>
                    Disclaimer: - This is AI-generated estimation please cross-verify before considering
                </Typography>
            </Box>

            <Box sx={{ bgcolor: "#2196f3", color: "white", p: 1, textAlign: "right" }}>
                <Typography sx={{ fontSize: isMobile ? '0.8rem' : '1rem' }}>www.estimate.ae</Typography>
            </Box>
        </Container>
    );
}

