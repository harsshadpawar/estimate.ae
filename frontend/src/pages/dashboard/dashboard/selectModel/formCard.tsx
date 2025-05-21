// import React, { useState, useEffect } from 'react';
// import {
//     Box,
//     TextField,
//     FormControl,
//     InputLabel,
//     Select,
//     MenuItem,
//     Chip,
//     OutlinedInput,
//     Radio,
//     RadioGroup,
//     FormControlLabel,
//     FormLabel,
//     Paper,
//     Grid,
//     SelectChangeEvent,
//     Theme,
//     useTheme,
//     InputAdornment,
//     IconButton
// } from '@mui/material';
// import { Close as CloseIcon, ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
// import { useSelector, useDispatch } from 'react-redux';
// import { RootState } from '@/redux/store/store';
// import {
//     fetchMaterials,
//     fetchMaterialGroups
// } from "@/redux/features/materials/materialsSlice";
// import {
//     fetchSurfaceTreatments
// } from "@/redux/features/surfaceTreatments/surfaceTreatmentsSlice";
// import {
//     fetchMachines
// } from "@/redux/features/machines/machinesSlice";

// // Define types for form data
// interface FormDataType {
//     model: string;
//     materialGroup: string;
//     materialGroupId: string;
//     material: string;
//     materialId: string;
//     surfaceTreatment: string;
//     surfaceTreatmentId: string;
//     quantity: string;
//     processSelection: string;
// }

// // Types from the original code
// interface Material {
//     id: string;
//     name: string;
//     material_group_id: string;
//     // Other properties as needed
// }

// interface MaterialGroup {
//     id: string;
//     name: string;
//     density?: number;
//     // Other properties as needed
// }

// interface SurfaceTreatment {
//     id: string;
//     name: string;
//     // Other properties as needed
// }

// const ITEM_HEIGHT = 48;
// const ITEM_PADDING_TOP = 8;
// const MenuProps = {
//     PaperProps: {
//         style: {
//             maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
//             width: 250,
//         },
//     },
// };

// // Quantity options similar to original code
// const quantities = ['1', '5', '10', '25', '50', '100', '250', '500', '1000'];

// export default function FormCard() {
//     const theme = useTheme();
//     const dispatch = useDispatch();

//     // Form state
//     const [formData, setFormData] = useState<FormDataType>({
//         model: 'PIPE.STP',
//         materialGroup: '',
//         materialGroupId: '',
//         material: '',
//         materialId: '',
//         surfaceTreatment: '',
//         surfaceTreatmentId: '',
//         quantity: '',
//         processSelection: 'Milling'
//     });

//     // Redux state
//     const { materials, groups: materialGroups, status: materialsStatus } = useSelector((state: RootState) => state.materials);
//     const { machines, status: machinesStatus } = useSelector((state: RootState) => state.machines);
//     const { treatments: surfaceTreatments, status: surfaceTreatmentsStatus } = useSelector((state: RootState) => state.surfaceTreatments);

//     // Local state for filtered materials
//     const [filteredMaterials, setFilteredMaterials] = useState<Material[]>([])

//     // Filter materials when material group changes
//     useEffect(() => {
//         if (formData.materialGroupId && materials.length > 0) {
//             const filtered = materials.filter(
//                 material => material.material_group_id === formData.materialGroupId
//             );
//             setFilteredMaterials(filtered);
//         } else {
//             setFilteredMaterials([]);
//         }
//     }, [formData.materialGroupId, materials]);

//     // Handle material group change
//     const handleMaterialGroupChange = (event: SelectChangeEvent<string>) => {
//         const selectedGroupId = event.target.value;
//         const selectedGroup = materialGroups.find(group => group.id === selectedGroupId);

//         setFormData(prev => ({
//             ...prev,
//             materialGroupId: selectedGroupId,
//             materialGroup: selectedGroup ? selectedGroup.name : '',
//             material: '', // Reset material when group changes
//             materialId: '' // Reset materialId when group changes
//         }));
//     };

//     // Handle material change
//     const handleMaterialChange = (event: SelectChangeEvent<string>) => {
//         const selectedMaterialId = event.target.value;
//         const selectedMaterial = materials.find(material => material.id === selectedMaterialId);

//         setFormData(prev => ({
//             ...prev,
//             materialId: selectedMaterialId,
//             material: selectedMaterial ? selectedMaterial.name : ''
//         }));
//     };

//     // Handle surface treatment change
//     const handleSurfaceTreatmentChange = (event: SelectChangeEvent<string>) => {
//         const selectedTreatmentId = event.target.value;
//         const selectedTreatment = surfaceTreatments.find(treatment => treatment.id === selectedTreatmentId);

//         setFormData(prev => ({
//             ...prev,
//             surfaceTreatmentId: selectedTreatmentId,
//             surfaceTreatment: selectedTreatment ? selectedTreatment.name : ''
//         }));
//     };

//     // Handle quantity change
//     const handleQuantityChange = (event: SelectChangeEvent<string>) => {
//         setFormData(prev => ({
//             ...prev,
//             quantity: event.target.value
//         }));
//     };

//     // Handle radio button changes
//     const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//         setFormData(prev => ({
//             ...prev,
//             processSelection: (event.target as HTMLInputElement).value
//         }));
//     };

//     // Clear a field
//     const clearField = (fieldName: keyof FormDataType) => {
//         switch (fieldName) {
//             case 'materialGroup':
//                 setFormData(prev => ({
//                     ...prev,
//                     materialGroup: '',
//                     materialGroupId: '',
//                     material: '', // Also clear dependent field
//                     materialId: '' // Also clear dependent field
//                 }));
//                 break;
//             case 'material':
//                 setFormData(prev => ({
//                     ...prev,
//                     material: '',
//                     materialId: ''
//                 }));
//                 break;
//             case 'surfaceTreatment':
//                 setFormData(prev => ({
//                     ...prev,
//                     surfaceTreatment: '',
//                     surfaceTreatmentId: ''
//                 }));
//                 break;
//             case 'quantity':
//                 setFormData(prev => ({
//                     ...prev,
//                     quantity: ''
//                 }));
//                 break;
//             default:
//                 setFormData(prev => ({
//                     ...prev,
//                     [fieldName]: ''
//                 }));
//         }
//     };

//     // Loading state check
//     const isLoading =
//         materialsStatus === 'loading' ||
//         machinesStatus === 'loading' ||
//         surfaceTreatmentsStatus === 'loading';

//     return (
//         <Paper elevation={0} sx={{ p: 3, bgcolor: 'primary.lighter', borderRadius: 2 }}>
//             <Grid container spacing={2}>
//                 {/* Model */}
//                 <Grid item xs={12} sm={3} display="flex" alignItems="center">
//                     <FormLabel sx={{ fontWeight: 500 }}>Model:</FormLabel>
//                 </Grid>
//                 <Grid item xs={12} sm={9}>
//                     <TextField
//                         fullWidth
//                         value={formData.model}
//                         InputProps={{
//                             readOnly: true,
//                         }}
//                         variant="outlined"
//                         sx={{
//                             bgcolor: 'action.disabledBackground',
//                             '& .MuiOutlinedInput-root': {
//                                 '& fieldset': { borderColor: 'grey.300' },
//                             }
//                         }}
//                     />
//                 </Grid>

//                 {/* Material Group */}
//                 <Grid item xs={12} sm={3} display="flex" alignItems="center">
//                     <FormLabel sx={{ fontWeight: 500 }}>Raw Material Group:</FormLabel>
//                 </Grid>
//                 <Grid item xs={12} sm={9}>
//                     <FormControl fullWidth variant="outlined">
//                         <InputLabel id="material-group-label">Material Group</InputLabel>
//                         <Select
//                             labelId="material-group-label"
//                             id="material-group"
//                             value={formData.materialGroupId}
//                             onChange={handleMaterialGroupChange}
//                             input={
//                                 <OutlinedInput
//                                     label="Material Group"
//                                     endAdornment={
//                                         formData.materialGroupId ? (
//                                             <InputAdornment position="end">
//                                                 <IconButton
//                                                     onClick={(e) => {
//                                                         e.stopPropagation();
//                                                         clearField('materialGroup');
//                                                     }}
//                                                     edge="end"
//                                                     size="small"
//                                                 >
//                                                     <CloseIcon sx={{ marginRight: '10px', fontSize: '18px' }} />
//                                                 </IconButton>
//                                             </InputAdornment>
//                                         ) : null
//                                     }
//                                 />
//                             }
//                             MenuProps={MenuProps}
//                             IconComponent={ExpandMoreIcon}
//                             disabled={isLoading || materialGroups.length === 0}
//                         >
//                             {materialGroups.map((group) => (
//                                 <MenuItem key={group.id} value={group.id}>
//                                     {group.name}
//                                 </MenuItem>
//                             ))}
//                         </Select>
//                     </FormControl>
//                 </Grid>

//                 {/* Material */}
//                 <Grid item xs={12} sm={3} display="flex" alignItems="center">
//                     <FormLabel sx={{ fontWeight: 500 }}>Raw Material:</FormLabel>
//                 </Grid>
//                 <Grid item xs={12} sm={9}>
//                     <FormControl fullWidth variant="outlined">
//                         <InputLabel id="material-label">Material</InputLabel>
//                         <Select
//                             labelId="material-label"
//                             id="material"
//                             value={formData.materialId}
//                             onChange={handleMaterialChange}
//                             input={
//                                 <OutlinedInput
//                                     label="Material"
//                                     endAdornment={
//                                         formData.materialId ? (
//                                             <InputAdornment position="end">
//                                                 <IconButton
//                                                     onClick={(e) => {
//                                                         e.stopPropagation();
//                                                         clearField('material');
//                                                     }}
//                                                     edge="end"
//                                                     size="small"
//                                                 >
//                                                     <CloseIcon sx={{ marginRight: '10px', fontSize: '18px' }} />
//                                                 </IconButton>
//                                             </InputAdornment>
//                                         ) : null
//                                     }
//                                 />
//                             }
//                             MenuProps={MenuProps}
//                             IconComponent={ExpandMoreIcon}
//                             disabled={isLoading || filteredMaterials.length === 0 || !formData.materialGroupId}
//                         >
//                             {filteredMaterials.map((material) => (
//                                 <MenuItem key={material.id} value={material.id}>
//                                     {material.name}
//                                 </MenuItem>
//                             ))}
//                         </Select>
//                     </FormControl>
//                 </Grid>

//                 {/* Surface Treatment */}
//                 <Grid item xs={12} sm={3} display="flex" alignItems="center">
//                     <FormLabel sx={{ fontWeight: 500 }}>Additional Part Treatment:</FormLabel>
//                 </Grid>
//                 <Grid item xs={12} sm={9}>
//                     <FormControl fullWidth variant="outlined">
//                         <InputLabel id="surface-treatment-label">Surface Treatment</InputLabel>
//                         <Select
//                             labelId="surface-treatment-label"
//                             id="surface-treatment"
//                             value={formData.surfaceTreatmentId}
//                             onChange={handleSurfaceTreatmentChange}
//                             input={
//                                 <OutlinedInput
//                                     label="Surface Treatment"
//                                     endAdornment={
//                                         formData.surfaceTreatmentId ? (
//                                             <InputAdornment position="end">
//                                                 <IconButton
//                                                     onClick={(e) => {
//                                                         e.stopPropagation();
//                                                         clearField('surfaceTreatment');
//                                                     }}
//                                                     edge="end"
//                                                     size="small"
//                                                 >
//                                                     <CloseIcon sx={{ marginRight: '10px', fontSize: '18px' }} />
//                                                 </IconButton>
//                                             </InputAdornment>
//                                         ) : null
//                                     }
//                                 />
//                             }
//                             MenuProps={MenuProps}
//                             IconComponent={ExpandMoreIcon}
//                             disabled={isLoading || surfaceTreatments.length === 0}
//                         >
//                             {surfaceTreatments.map((treatment) => (
//                                 <MenuItem key={treatment.id} value={treatment.id}>
//                                     {treatment.name}
//                                 </MenuItem>
//                             ))}
//                         </Select>
//                     </FormControl>
//                 </Grid>

//                 {/* Quantity */}
//                 <Grid item xs={12} sm={3} display="flex" alignItems="center">
//                     <FormLabel sx={{ fontWeight: 500 }}>Quantity:</FormLabel>
//                 </Grid>
//                 <Grid item xs={12} sm={9}>
//                     <FormControl fullWidth variant="outlined">
//                         <InputLabel id="quantity-label">Quantity</InputLabel>
//                         <Select
//                             labelId="quantity-label"
//                             id="quantity"
//                             value={formData.quantity}
//                             onChange={handleQuantityChange}
//                             input={
//                                 <OutlinedInput
//                                     label="Quantity"
//                                     endAdornment={
//                                         <InputAdornment position="end">
//                                             {/* <Chip size="small" sx={{ mr: 1 }} /> */}
//                                             {formData.quantity && (
//                                                 <IconButton
//                                                     onClick={(e) => {
//                                                         e.stopPropagation();
//                                                         clearField('quantity');
//                                                     }}
//                                                     edge="end"
//                                                     size="small"
//                                                 >
//                                                     <CloseIcon sx={{ marginRight: '10px', fontSize: '18px' }} />
//                                                 </IconButton>
//                                             )}
//                                         </InputAdornment>
//                                     }
//                                 />
//                             }
//                             MenuProps={MenuProps}
//                             IconComponent={ExpandMoreIcon}
//                         >
//                             {quantities.map((option) => (
//                                 <MenuItem key={option} value={option}>
//                                     {option}
//                                 </MenuItem>
//                             ))}
//                         </Select>
//                     </FormControl>
//                 </Grid>

//                 {/* Process Selection */}
//                 <Grid item xs={12} sm={3} display="flex" alignItems="center">
//                     <FormLabel sx={{ fontWeight: 500 }}>Process Selection:</FormLabel>
//                 </Grid>
//                 <Grid item xs={12} sm={9}>
//                     <RadioGroup
//                         row
//                         name="processSelection"
//                         value={formData.processSelection}
//                         onChange={handleRadioChange}
//                     >
//                         <FormControlLabel value="Milling" control={<Radio />} label="Milling" />
//                         <FormControlLabel value="Turning" control={<Radio />} label="Turning" />
//                     </RadioGroup>
//                 </Grid>
//             </Grid>
//         </Paper>
//     );
// }





// ================================


import React, { useState, useEffect } from 'react';
import {
    Box,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    OutlinedInput,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormLabel,
    Paper,
    Grid,
    SelectChangeEvent,
    Theme,
    useTheme,
    InputAdornment,
    IconButton
} from '@mui/material';
import { Close as CloseIcon, ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store/store';

// Define types for form data
interface FormDataType {
    model: string;
    materialGroup: string[];
    materialGroupIds: string[];
    material: string[];
    materialIds: string[];
    surfaceTreatment: string[];
    surfaceTreatmentIds: string[];
    quantity: string[];
    processSelection: string;
}

// Types from the original code
interface Material {
    id: string;
    name: string;
    material_group_id: string;
    // Other properties as needed
}

interface MaterialGroup {
    id: string;
    name: string;
    density?: number;
    // Other properties as needed
}

interface SurfaceTreatment {
    id: string;
    name: string;
    // Other properties as needed
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

// Quantity options similar to original code
const quantities = ['1', '5', '10', '25', '50', '100', '250', '500', '1000'];

// Function to get styles for chip items
const getChipStyles = (name: string, selected: string[], theme: Theme) => {
    return {
        fontWeight:
            selected.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
};

export default function FormCard() {
    const theme = useTheme();
    const dispatch = useDispatch();

    // Form state with arrays for multiple selections
    const [formData, setFormData] = useState<FormDataType>({
        model: 'PIPE.STP',
        materialGroup: [],
        materialGroupIds: [],
        material: [],
        materialIds: [],
        surfaceTreatment: [],
        surfaceTreatmentIds: [],
        quantity: [],
        processSelection: 'Milling'
    });

    // Redux state
    const { materials, groups: materialGroups, status: materialsStatus } = useSelector((state: RootState) => state.materials);
    const { machines, status: machinesStatus } = useSelector((state: RootState) => state.machines);
    const { treatments: surfaceTreatments, status: surfaceTreatmentsStatus } = useSelector((state: RootState) => state.surfaceTreatments);

    // Local state for filtered materials
    const [filteredMaterials, setFilteredMaterials] = useState<Material[]>([]);

    // Filter materials when material group changes
    useEffect(() => {
        if (formData.materialGroupIds.length > 0 && materials.length > 0) {
            const filtered = materials.filter(
                material => formData.materialGroupIds.includes(material.material_group_id)
            );
            setFilteredMaterials(filtered);
        } else {
            setFilteredMaterials([]);
        }
    }, [formData.materialGroupIds, materials]);

    // Handle material group change
    const handleMaterialGroupChange = (event: SelectChangeEvent<string[]>) => {
        const selectedIds = typeof event.target.value === 'string'
            ? event.target.value.split(',')
            : event.target.value;

        const selectedNames = selectedIds.map(id => {
            const group = materialGroups.find(group => group.id === id);
            return group ? group.name : '';
        }).filter(name => name !== '');

        setFormData(prev => ({
            ...prev,
            materialGroupIds: selectedIds,
            materialGroup: selectedNames,
        }));
    };

    // Handle material change
    const handleMaterialChange = (event: SelectChangeEvent<string[]>) => {
        const selectedIds = typeof event.target.value === 'string'
            ? event.target.value.split(',')
            : event.target.value;

        const selectedNames = selectedIds.map(id => {
            const material = materials.find(material => material.id === id);
            return material ? material.name : '';
        }).filter(name => name !== '');

        setFormData(prev => ({
            ...prev,
            materialIds: selectedIds,
            material: selectedNames
        }));
    };

    // Handle surface treatment change
    const handleSurfaceTreatmentChange = (event: SelectChangeEvent<string[]>) => {
        const selectedIds = typeof event.target.value === 'string'
            ? event.target.value.split(',')
            : event.target.value;

        const selectedNames = selectedIds.map(id => {
            const treatment = surfaceTreatments.find(treatment => treatment.id === id);
            return treatment ? treatment.name : '';
        }).filter(name => name !== '');

        setFormData(prev => ({
            ...prev,
            surfaceTreatmentIds: selectedIds,
            surfaceTreatment: selectedNames
        }));
    };

    // Handle quantity change
    const handleQuantityChange = (event: SelectChangeEvent<string[]>) => {
        const selectedValues = typeof event.target.value === 'string'
            ? event.target.value.split(',')
            : event.target.value;

        setFormData(prev => ({
            ...prev,
            quantity: selectedValues
        }));
    };

    // Handle radio button changes
    const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            processSelection: (event.target as HTMLInputElement).value
        }));
    };

    // Delete a material group chip
    const handleDeleteMaterialGroupChip = (idToDelete: string) => {
        // Get the new arrays after removing the selected item
        const newIds = formData.materialGroupIds.filter(id => id !== idToDelete);
        const newNames = formData.materialGroup.filter((_, index) => {
            return formData.materialGroupIds[index] !== idToDelete;
        });

        setFormData(prev => ({
            ...prev,
            materialGroupIds: newIds,
            materialGroup: newNames,
            // Clear dependent fields
            material: [],
            materialIds: []
        }));
    };

    // Delete a material chip
    const handleDeleteMaterialChip = (idToDelete: string) => {
        // Get the new arrays after removing the selected item
        const newIds = formData.materialIds.filter(id => id !== idToDelete);
        const newNames = formData.material.filter((_, index) => {
            return formData.materialIds[index] !== idToDelete;
        });

        setFormData(prev => ({
            ...prev,
            materialIds: newIds,
            material: newNames
        }));
    };

    // Delete a surface treatment chip
    const handleDeleteSurfaceTreatmentChip = (idToDelete: string) => {
        // Get the new arrays after removing the selected item
        const newIds = formData.surfaceTreatmentIds.filter(id => id !== idToDelete);
        const newNames = formData.surfaceTreatment.filter((_, index) => {
            return formData.surfaceTreatmentIds[index] !== idToDelete;
        });

        setFormData(prev => ({
            ...prev,
            surfaceTreatmentIds: newIds,
            surfaceTreatment: newNames
        }));
    };

    // Delete a quantity chip
    const handleDeleteQuantityChip = (valueToDelete: string) => {
        const newValues = formData.quantity.filter(value => value !== valueToDelete);

        setFormData(prev => ({
            ...prev,
            quantity: newValues
        }));
    };

    // Clear an entire field
    const clearField = (fieldName: keyof FormDataType) => {
        switch (fieldName) {
            case 'materialGroup':
                setFormData(prev => ({
                    ...prev,
                    materialGroup: [],
                    materialGroupIds: [],
                    material: [], // Also clear dependent field
                    materialIds: [] // Also clear dependent field
                }));
                break;
            case 'material':
                setFormData(prev => ({
                    ...prev,
                    material: [],
                    materialIds: []
                }));
                break;
            case 'surfaceTreatment':
                setFormData(prev => ({
                    ...prev,
                    surfaceTreatment: [],
                    surfaceTreatmentIds: []
                }));
                break;
            case 'quantity':
                setFormData(prev => ({
                    ...prev,
                    quantity: []
                }));
                break;
            default:
                if (Array.isArray(formData[fieldName])) {
                    setFormData(prev => ({
                        ...prev,
                        [fieldName]: []
                    }));
                } else {
                    setFormData(prev => ({
                        ...prev,
                        [fieldName]: ''
                    }));
                }
        }
    };

    // Loading state check
    const isLoading =
        materialsStatus === 'loading' ||
        machinesStatus === 'loading' ||
        surfaceTreatmentsStatus === 'loading';

    return (
        <Paper elevation={0} sx={{ p: 3, bgcolor: 'primary.lighter', borderRadius: 2 }}>
            <Grid container spacing={2}>
                {/* Model */}
                <Grid item xs={12} sm={3} display="flex" alignItems="center">
                    <FormLabel sx={{ fontWeight: 500 }}>Model:</FormLabel>
                </Grid>
                <Grid item xs={12} sm={9}>
                    <TextField
                        fullWidth
                        value={formData.model}
                        InputProps={{
                            readOnly: true,
                        }}
                        variant="outlined"
                        sx={{
                            bgcolor: 'action.disabledBackground',
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: 'grey.300' },
                            }
                        }}
                    />
                </Grid>

                {/* Material Group */}
                <Grid item xs={12} sm={3} display="flex" alignItems="center">
                    <FormLabel sx={{ fontWeight: 500 }}>Raw Material Group:</FormLabel>
                </Grid>
                <Grid item xs={12} sm={9}>
                    <FormControl fullWidth variant="outlined">
                        <InputLabel id="material-group-label">Material Group</InputLabel>
                        <Select
                            labelId="material-group-label"
                            id="material-group"
                            multiple
                            value={formData.materialGroupIds}
                            onChange={handleMaterialGroupChange}
                            input={
                                <OutlinedInput
                                    label="Material Group"
                                    endAdornment={
                                        formData.materialGroupIds.length > 0 && (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        clearField('materialGroup');
                                                    }}
                                                    edge="end"
                                                    size="small"
                                                >
                                                    <CloseIcon sx={{ marginRight: '10px', fontSize: '18px' }} />
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }
                                />
                            }
                            renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selected.map((value) => {
                                        const group = materialGroups.find(g => g.id === value);
                                        return group && (
                                            <Chip
                                                key={value}
                                                label={group.name}
                                                size="small"
                                                onDelete={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteMaterialGroupChip(value);
                                                }}
                                                deleteIcon={<CloseIcon fontSize="small" />}
                                            />
                                        );
                                    })}
                                </Box>
                            )}
                            MenuProps={MenuProps}
                            IconComponent={ExpandMoreIcon}
                            disabled={isLoading || materialGroups.length === 0}
                        >
                            {materialGroups.map((group) => (
                                <MenuItem
                                    key={group.id}
                                    value={group.id}
                                    style={getChipStyles(group.name, formData.materialGroup, theme)}
                                >
                                    {group.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                {/* Material */}
                <Grid item xs={12} sm={3} display="flex" alignItems="center">
                    <FormLabel sx={{ fontWeight: 500 }}>Raw Material:</FormLabel>
                </Grid>
                <Grid item xs={12} sm={9}>
                    <FormControl fullWidth variant="outlined">
                        <InputLabel id="material-label">Material</InputLabel>
                        <Select
                            labelId="material-label"
                            id="material"
                            multiple
                            value={formData.materialIds}
                            onChange={handleMaterialChange}
                            input={
                                <OutlinedInput
                                    label="Material"
                                    endAdornment={
                                        formData.materialIds.length > 0 && (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        clearField('material');
                                                    }}
                                                    edge="end"
                                                    size="small"
                                                >
                                                    <CloseIcon sx={{ marginRight: '10px', fontSize: '18px' }} />
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }
                                />
                            }
                            renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selected.map((value) => {
                                        const material = materials.find(m => m.id === value);
                                        return material && (
                                            <Chip
                                                key={value}
                                                label={material.name}
                                                size="small"
                                                onDelete={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteMaterialChip(value);
                                                }}
                                                deleteIcon={<CloseIcon fontSize="small" />}
                                            />
                                        );
                                    })}
                                </Box>
                            )}
                            MenuProps={MenuProps}
                            IconComponent={ExpandMoreIcon}
                            disabled={isLoading || filteredMaterials.length === 0 || formData.materialGroupIds.length === 0}
                        >
                            {filteredMaterials.map((material) => (
                                <MenuItem
                                    key={material.id}
                                    value={material.id}
                                    style={getChipStyles(material.name, formData.material, theme)}
                                >
                                    {material.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                {/* Surface Treatment */}
                <Grid item xs={12} sm={3} display="flex" alignItems="center">
                    <FormLabel sx={{ fontWeight: 500 }}>Additional Part Treatment:</FormLabel>
                </Grid>
                <Grid item xs={12} sm={9}>
                    <FormControl fullWidth variant="outlined">
                        <InputLabel id="surface-treatment-label">Surface Treatment</InputLabel>
                        <Select
                            labelId="surface-treatment-label"
                            id="surface-treatment"
                            multiple
                            value={formData.surfaceTreatmentIds}
                            onChange={handleSurfaceTreatmentChange}
                            input={
                                <OutlinedInput
                                    label="Surface Treatment"
                                    endAdornment={
                                        formData.surfaceTreatmentIds.length > 0 && (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        clearField('surfaceTreatment');
                                                    }}
                                                    edge="end"
                                                    size="small"
                                                >
                                                    <CloseIcon sx={{ marginRight: '10px', fontSize: '18px' }} />
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }
                                />
                            }
                            renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selected.map((value) => {
                                        const treatment = surfaceTreatments.find(t => t.id === value);
                                        return treatment && (
                                            <Chip
                                                key={value}
                                                label={treatment.name}
                                                size="small"
                                                onDelete={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteSurfaceTreatmentChip(value);
                                                }}
                                                deleteIcon={<CloseIcon fontSize="small" />}
                                            />
                                        );
                                    })}
                                </Box>
                            )}
                            MenuProps={MenuProps}
                            IconComponent={ExpandMoreIcon}
                            disabled={isLoading || surfaceTreatments.length === 0}
                        >
                            {surfaceTreatments.map((treatment) => (
                                <MenuItem
                                    key={treatment.id}
                                    value={treatment.id}
                                    style={getChipStyles(treatment.name, formData.surfaceTreatment, theme)}
                                >
                                    {treatment.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                {/* Quantity */}
                <Grid item xs={12} sm={3} display="flex" alignItems="center">
                    <FormLabel sx={{ fontWeight: 500 }}>Quantity:</FormLabel>
                </Grid>
                <Grid item xs={12} sm={9}>
                    <FormControl fullWidth variant="outlined">
                        <InputLabel id="quantity-label">Quantity</InputLabel>
                        <Select
                            labelId="quantity-label"
                            id="quantity"
                            multiple
                            value={formData.quantity}
                            onChange={handleQuantityChange}
                            input={
                                <OutlinedInput
                                    label="Quantity"
                                    endAdornment={
                                        formData.quantity.length > 0 && (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        clearField('quantity');
                                                    }}
                                                    edge="end"
                                                    size="small"
                                                >
                                                    <CloseIcon sx={{ marginRight: '10px', fontSize: '18px' }} />
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }
                                />
                            }
                            renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selected.map((value) => (
                                        <Chip
                                            key={value}
                                            label={value}
                                            size="small"
                                            onDelete={(e) => {
                                                e.stopPropagation();
                                                handleDeleteQuantityChip(value);
                                            }}
                                            deleteIcon={<CloseIcon fontSize="small" />}
                                        />
                                    ))}
                                </Box>
                            )}
                            MenuProps={MenuProps}
                            IconComponent={ExpandMoreIcon}
                        >
                            {quantities.map((option) => (
                                <MenuItem
                                    key={option}
                                    value={option}
                                    style={getChipStyles(option, formData.quantity, theme)}
                                >
                                    {option}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                {/* Process Selection */}
                <Grid item xs={12} sm={3} display="flex" alignItems="center">
                    <FormLabel sx={{ fontWeight: 500 }}>Process Selection:</FormLabel>
                </Grid>
                <Grid item xs={12} sm={9}>
                    <RadioGroup
                        row
                        name="processSelection"
                        value={formData.processSelection}
                        onChange={handleRadioChange}
                    >
                        <FormControlLabel value="Milling" control={<Radio />} label="Milling" />
                        <FormControlLabel value="Turning" control={<Radio />} label="Turning" />
                    </RadioGroup>
                </Grid>
            </Grid>
        </Paper>
    );
}