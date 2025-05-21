"use client"

import {
    Box,
    Typography,
    Select,
    MenuItem,
    Paper,
    Stack,
    SelectChangeEvent,
} from "@mui/material"
import { Info } from 'lucide-react'
import { useState } from "react"

export default function CalculationPreview({
    uploadedFileName,
    selectedMaterial,
}: any) {
    const [lotSize, setLotSize] = useState("1")
    const [variant, setVariant] = useState("Variant 1")
    const handleLotSizeChange = (event: SelectChangeEvent) => {
        setLotSize(event.target.value)
    }

    const handleVariantChange = (event: SelectChangeEvent) => {
        setVariant(event.target.value)
    }

    return (
        <Paper sx={{ maxWidth: 600, mx: "auto", overflow: "hidden" }}>
            <Box sx={{ bgcolor: "rgb(219, 238, 254)", p: 2 }}>
                <Typography variant="h6" fontWeight={600}>
                    Check the calculation result below!
                </Typography>
            </Box>

            <Box >
                <Typography variant="body2" color="text.secondary" mb={3} sx={{ paddingLeft: 2, paddingRight: 2, pt: 1 }}>
                    The distribution of the manufacturing costs is highlighted in color in the 3D preview.
                    Move the cursor to the colored faces to see detailed information. Change the lot size and see how
                    much the manufacturing costs vary.
                </Typography>


                <Box sx={{ backgroundColor: '#F2F5FBB2', p: 2 }} >
                    <Stack spacing={2} >
                        <FormRow
                            label="Model"
                            value={uploadedFileName}
                            readOnly
                        />
                        <FormRow
                            label="Material group"
                            value={selectedMaterial?.name}
                            readOnly
                        />
                        <FormRow
                            label="Semi-finished product"
                            value=""
                            readOnly
                        />
                    </Stack>
                </Box>
                <Box sx={{ backgroundColor: '#F2F5FBB2', p: 2 }} >
                    <Stack spacing={2} >
                        <FormRow
                            label="Lot Size"
                            customInput={
                                <Select
                                    fullWidth
                                    size="small"
                                    value={lotSize}
                                    onChange={handleLotSizeChange}
                                    sx={{
                                        bgcolor: "white",
                                        "& .MuiOutlinedInput-notchedOutline": {
                                            borderColor: "rgb(226, 232, 240)",
                                        },
                                    }}
                                >
                                    <MenuItem value="1">1</MenuItem>
                                    <MenuItem value="10">10</MenuItem>
                                    <MenuItem value="100">100</MenuItem>
                                </Select>
                            }
                        />
                        <FormRow
                            label="Calculation Variant"
                            customInput={
                                <Select
                                    fullWidth
                                    size="small"
                                    value={variant}
                                    onChange={handleVariantChange}
                                    sx={{
                                        bgcolor: "white",
                                        "& .MuiOutlinedInput-notchedOutline": {
                                            borderColor: "rgb(226, 232, 240)",
                                        },
                                    }}
                                >
                                    <MenuItem value="Variant 1">Variant 1</MenuItem>
                                    <MenuItem value="Variant 2">Variant 2</MenuItem>
                                </Select>
                            }
                        />
                        <FormRow
                            label="Manufacturing costs"
                            value="AED 52.72 (per unit)"
                            highlighted
                        />
                        <FormRow
                            label="Purchase price"
                            value="AED 66.69 (per unit)"
                            highlighted
                        />
                        <FormRow
                            label="Purchase price incl. programming"
                            value="AED 91.24 (per unit)"
                            highlighted
                        />
                        <FormRow
                            label="CO₂ Emission"
                            value="3,230 kg (per unit)"
                            highlighted
                        />
                    </Stack>
                </Box>
            </Box>
        </Paper>
    )
}

interface FormRowProps {
    label: string
    value?: string
    highlighted?: boolean
    readOnly?: boolean
    customInput?: React.ReactNode
}

function FormRow({ label, value, highlighted, readOnly, customInput }: FormRowProps) {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                "& > *:first-of-type": { flex: "0 0 200px" },
                "& > *:last-child": { flex: 1 },
            }}
        >
            <Typography
                variant="body2"
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    color: "rgb(71, 85, 105)",
                }}
            >
                {label}
                <Info className="h-4 w-4 text-gray-400" />
            </Typography>

            {customInput || (
                <Typography>{value}</Typography>
            )}
        </Box>
    )
}

