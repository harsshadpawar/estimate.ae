// import React, { useEffect, useRef, useState } from "react";
// import {
//     Box,
//     TextField,
//     Typography,
//     Button,
//     MenuItem,
//     FormControl,
//     Select,
//     Backdrop,
//     CircularProgress,
//     Container,
//     SelectChangeEvent,
// } from "@mui/material";
// import { styled } from '@mui/material/styles';
// import DashboardHeader from "../DashboardHeader";
// import { Modal } from "../../../components/common/CustomModal";
// import ModalComponent from '../../dashboard/ModalData'

// // Redux imports
// import { useDispatch, useSelector } from "react-redux";
// import { 
//   uploadCadFile,
// } from "../../../redux/features/cad/cadSlice";
// import { 
//   getForgeToken 
// } from "../../../redux/features/forge/forgeSlice";
// import { 
//   fetchMaterials, 
//   fetchMaterialGroups 
// } from "../../../redux/features/materials/materialsSlice";
// import { 
//   fetchMachines 
// } from "../../../redux/features/machines/machinesSlice";
// import { 
//   fetchSurfaceTreatments 
// } from "../../../redux/features/surfaceTreatments/surfaceTreatmentsSlice";
// import { 
//   calculateCosts,
// } from "../../../redux/features/costs/costsSlice";
// import { RootState } from "../../../redux/store/store";

// // Type definitions
// interface Material {
//   id: string;
//   name: string;
//   material_group_id: string;
//   // Add other material properties as needed
// }

// interface MaterialGroup {
//   id: string;
//   name: string;
//   density?: number;
//   // Add other group properties as needed
// }

// interface Machine {
//   id: string;
//   name: string;
//   category: string;
//   // Add other machine properties as needed
// }

// interface SurfaceTreatment {
//   id: string;
//   name: string;
//   // Add other treatment properties as needed
// }

// interface SelectedMachine {
//   id: string;
//   programmingTime: string;
// }

// interface DimensionValues {
//   rawMaterialDimensions: {
//     volume: number;
//     surfaceArea: number;
//   };
// }

// interface CalculationData {
//   selectedMaterial: Material | undefined;
//   selectedSurfaceTreatment: SurfaceTreatment | undefined;
//   selectedMachines: any[]; // Replace 'any' with proper type if possible
//   volume: number;
//   surfaceArea: number;
// }




// const quantities = [1, 5, 10, 25, 50, 100, 250, 500, 1000] as const;

// const SelectProcessingData: React.FC = () => {
//     const dispatch = useDispatch();

//     // Redux selectors with TypeScript types
//     const {
//         fileId: cadFileId,
//         fileName: uploadedFileName,
//         status: cadStatus
//     } = useSelector((state: RootState) => state.cad);

//     const { token: accessToken } = useSelector((state: RootState) => state.forge);

//     const {
//         materials,
//         groups: materialGroups,
//         status: materialsStatus
//     } = useSelector((state: RootState) => state.materials);

//     const {
//         machines,
//         status: machinesStatus
//     } = useSelector((state: RootState) => state.machines);

//     const {
//         treatments: surfaceTreatments,
//         status: surfaceTreatmentsStatus
//     } = useSelector((state: RootState) => state.surfaceTreatments);

//     const {
//         setupCosts: setupCostsData,
//         unitCosts: unitCostsData,
//         totalCost,
//         details: costDetails,
//         status: costsStatus
//     } = useSelector((state: RootState) => state.costs);

//     // Local state with TypeScript types
//     const [openModal, setOpenModal] = useState<boolean>(false);
//     const [selectedPart, setSelectedPart] = useState<string>("");
//     const [groupedMaterials, setGroupedMaterials] = useState<Record<string, Material[]>>({});
//     const [volume, setVolume] = useState<number>(0);
//     const [surfaceArea, setSurfaceArea] = useState<number>(0);
//     const [isCalculationDone, setIsCalculationDone] = useState<boolean>(false);
//     const [setupCostsTotal, setSetupCostsTotal] = useState<number>(0);
//     const [unitCostsTotal, setUnitCostsTotal] = useState<number>(0);
//     const [selectedMachines, setSelectedMachines] = useState<SelectedMachine[]>([]);
//     const [programmingTime, setProgrammingTime] = useState<string>();
//     const [selectedSurfaceTreatmentId, setSelectedSurfaceTreatmentId] = useState<string>('');
//     const [selectedSurfaceTreatmentName, setSelectedSurfaceTreatmentName] = useState<string>("");
//     const [quantity, setQuantity] = useState<number>();
//     const [additionalPartTreatment, setAdditionalPartTreatment] = useState<SurfaceTreatment | {}>({});
//     const [groupedMachines, setGroupedMachines] = useState<Record<string, Machine[]>>({});
//     const [selectedMaterialName, setSelectedMaterialName] = useState<string>("");
//     const [selectedMaterialGroupName, setSelectedMaterialGroupName] = useState<string>("");
//     const [rawMaterialGroup, setRawMaterialGroup] = useState<MaterialGroup | {}>({});
//     const [rawMaterial, setRawMaterial] = useState<Material | {}>({});
//     const [selectedMaterialId, setSelectedMaterialId] = useState<string>('');
//     const [addedMachines, setAddedMachines] = useState<Array<{name: string, programmingTime: string}>>([{ name: "", programmingTime: "" }]);

//     const isLoading = 
//         cadStatus === 'loading' || 
//         materialsStatus === 'loading' || 
//         machinesStatus === 'loading' || 
//         surfaceTreatmentsStatus === 'loading' || 
//         costsStatus === 'loading';

//     const isFileUploaded = cadStatus === 'succeeded';

//     useEffect(() => {
//         dispatch(fetchMaterials());
//         dispatch(fetchMachines());
//         dispatch(fetchSurfaceTreatments());
//         dispatch(fetchMaterialGroups());
//     }, [dispatch]);

//     const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
//         const selectedFile = event.target.files?.[0];
//         if (selectedFile) {
//             setFile(selectedFile);
//             dispatch(uploadCadFile(selectedFile))
//                 .then(() => dispatch(getForgeToken()));
//         }
//     };

//     const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
//         e.preventDefault();
//         setDragOver(true);
//     };

//     const handleDragLeave = () => {
//         setDragOver(false);
//     };

//     const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
//         e.preventDefault();
//         setDragOver(false);
//         const files = e.dataTransfer.files;
//         if (files.length > 0) {
//             dispatch(uploadCadFile(files[0]))
//                 .then(() => dispatch(getForgeToken()));
//         }
//     };

//     const handleMaterialSelection = (materialId: string) => {
//         setSelectedMaterialId(materialId);
//     };

//     const handleMaterialChange = (e: SelectChangeEvent<{id: string, name: string}>) => {
//         const selMaterial = e.target.value as {id: string, name: string};
//         setRawMaterial(selMaterial);
//         setSelectedMaterialName(selMaterial.name);
//         handleMaterialSelection(selMaterial.id);
//     };

//     const handleMaterialGroupChange = (e: SelectChangeEvent<MaterialGroup>) => {
//         setSelectedMaterialName('');
//         const selMaterialId = e.target.value as MaterialGroup;
//         const selMaterialGroup = materialGroups.find(group => group.id === selMaterialId.id);

//         if (selMaterialGroup) {
//             setRawMaterialGroup(selMaterialGroup);
//             setSelectedMaterialGroupName(selMaterialGroup.name);

//             const groupedMaterials = materials.filter(
//                 material => material.material_group_id === selMaterialId.id
//             );

//             const grouped = {
//                 [selMaterialGroup.name]: groupedMaterials
//             };

//             setGroupedMaterials(grouped);
//         }
//     };

//     useEffect(() => {
//         if (materials.length && materialGroups.length) {
//             groupMaterialsByGroups();
//         }
//     }, [materials, materialGroups]);

//     const groupMaterialsByGroups = () => {
//         const grouped = materialGroups.reduce((acc: Record<string, Material[]>, group) => {
//             const groupMaterials = materials.filter(material => material.material_group_id === group.id);
//             acc[group.name] = groupMaterials;
//             return acc;
//         }, {});
//         setGroupedMaterials(grouped);
//     };

//     useEffect(() => {
//         if (machines.length) {
//             groupMachinesByCategories();
//         }
//     }, [machines]);

//     const groupMachinesByCategories = () => {
//         const grouped = machines?.reduce((acc: Record<string, Machine[]>, machine) => {
//             const category = machine.category;
//             if (!acc[category]) acc[category] = [];
//             acc[category].push(machine);
//             return acc;
//         }, {});
//         setGroupedMachines(grouped);
//     };

//     const getDimensions = (dimensionValues: DimensionValues) => {
//         setVolume(dimensionValues.rawMaterialDimensions.volume);
//         setSurfaceArea(dimensionValues.rawMaterialDimensions.surfaceArea);
//     };

//     const getSelectedMachine = (selectedMachines: SelectedMachine[]) => {
//         return selectedMachines.map((machine) => {
//             return {
//                 ...machines.find((m) => m.id === machine.id),
//                 machining_time: getMachiningCost(machine.programmingTime)
//             };
//         });
//     };

//     const getMachiningCost = (programmingTime: string) => {
//         const programmingTimeParam = programmingTime.split(" ");
//         if (programmingTimeParam[1] === 'hour' || programmingTimeParam[1] === 'hours') {
//             return parseFloat(programmingTimeParam[0]);
//         } else {
//             return parseFloat(programmingTimeParam[0]) / 60;
//         }
//     };

//     const calcSetupCostsTotal = (setupCosts: Record<string, number>) => {
//         const total = Object.values(setupCosts).reduce((a, b) => a + b, 0);
//         setSetupCostsTotal(total);
//     };

//     const calcUnitCostsTotal = (unitCosts: Record<string, number>) => {
//         const total = Object.values(unitCosts).reduce((a, b) => a + b, 0);
//         setUnitCostsTotal(total);
//     };

//     const handleCalculateCosts = () => {
//         const calculationData: CalculationData = {
//             selectedMaterial: materials.find((m) => m.id === selectedMaterialId),
//             selectedSurfaceTreatment: surfaceTreatments.find((sT) => sT.id === selectedSurfaceTreatmentId),
//             selectedMachines: getSelectedMachine(selectedMachines),
//             volume: volume,
//             surfaceArea: surfaceArea
//         };

//         dispatch(calculateCosts(calculationData))
//             .then(() => {
//                 setIsCalculationDone(true);
//                 setOpenModal(true);
//             });
//     };

//     const handleSurfaceTreatmentChange = (e: SelectChangeEvent<SurfaceTreatment>) => {
//         const selSurfaceTreatment = e.target.value as SurfaceTreatment;
//         setAdditionalPartTreatment(selSurfaceTreatment);
//         setSelectedSurfaceTreatmentName(selSurfaceTreatment.name);
//         handleSurfaceTreatmentSelection(selSurfaceTreatment.id);
//     };

//     const handleSurfaceTreatmentSelection = (surfaceTreatmentId: string) => {
//         setSelectedSurfaceTreatmentId(surfaceTreatmentId);
//     };
//     return (
//         <Box sx={{ padding: '20px' }}>
//             <Container maxWidth="lg" sx={{ padding: '20px' }}>
//                 {isLoading && (
//                     <Backdrop
//                         sx={{
//                             color: '#fff',
//                             zIndex: (theme) => theme.zIndex.drawer + 1,
//                         }}
//                         open={isLoading}
//                     >
//                         <CircularProgress color="inherit" />
//                     </Backdrop>
//                 )}
//                 <DashboardHeader />
//                 <Typography variant="h5" gutterBottom sx={{ paddingTop: 3, fontSize: { xs: '1.2rem', sm: '1.5rem' } }}>
//                     Upload your model and select processing data
//                 </Typography>
//                 <Box sx={{ padding: 3, maxWidth: "100%", margin: "auto", bgcolor: 'white', borderRadius: 5 }}>
//                     <Box
//                         sx={{
//                             display: 'flex',
//                             flexDirection: 'column',
//                             gap: 2,
//                             mb: 3,
//                             px: { xs: 1, sm: 3, md: 5 },
//                             alignItems: "center",
//                         }}
//                     >
//                         <Box
//                             sx={{
//                                 padding: { xs: "10px", sm: "20px" },
//                                 display: 'flex',
//                                 justifyContent: 'center',
//                                 alignItems: 'center',
//                             }}
//                         >
//                             <input
//                                 accept=".stp,.dwg,.dxf"
//                                 style={{ display: "none" }}
//                                 id="upload-file"
//                                 type="file"
//                                 multiple
//                                 onChange={handleFileUpload}
//                             />
//                             <label htmlFor="upload-file">
//                                 <Box
//                                     sx={{
//                                         width: '100%',
//                                         padding: "12px 12px",
//                                         textAlign: "center",
//                                         backgroundColor: "#0591FC",
//                                         color: "#fff",
//                                         borderRadius: "14px",
//                                         cursor: "pointer",
//                                         "&:hover": {
//                                             backgroundColor: "#0591FC",
//                                         },
//                                     }}
//                                 >
//                                     Select a Sample Model
//                                 </Box>
//                             </label>
//                         </Box>
//                     </Box>

//                     <Typography variant="h6" sx={{ margin: "10px 0", fontSize: { xs: '1rem', sm: '1.25rem' } }}>
//                         Please select data below
//                     </Typography>
//                     <Box
//                         sx={{
//                             display: 'flex',
//                             flexDirection: 'column',
//                             gap: 2,
//                             mb: 3,
//                             bgcolor: '#F2F5FB80',
//                             borderRadius: 4,
//                             padding: 3,
//                         }}
//                     >
//                         <Typography variant="body1" gutterBottom sx={{ fontSize: '12px' }}>
//                             Model: <span>{uploadedFileName && uploadedFileName}</span>
//                         </Typography>
//                         <Box
//                             sx={{
//                                 display: 'flex',
//                                 flexWrap: 'wrap',
//                                 gap: 2,
//                             }}
//                         >
//                             <Box sx={{ flex: '1 1 calc(25% - 16px)' }}>
//                                 <FormControl fullWidth>
//                                     <Typography variant="body1" sx={{ fontSize: '12px' }}>Raw Material Group</Typography>
//                                     <Select
//                                         sx={{
//                                             height: '36px',
//                                             '& .MuiInputBase-root': {
//                                                 height: '36px',
//                                                 borderBottom: '2px solid #000',
//                                                 borderTop: 'none',
//                                                 borderLeft: 'none',
//                                                 borderRight: 'none',
//                                             },
//                                         }}
//                                         fullWidth
//                                         value={selectedMaterialGroupName}
//                                         onChange={handleMaterialGroupChange}
//                                         renderValue={() => (selectedMaterialGroupName ? selectedMaterialGroupName : 'Select a material')}
//                                     >
//                                         {materialGroups
//                                             .map((material) => (
//                                                 <MenuItem key={material.id} value={material as any}>
//                                                     {material.name}
//                                                 </MenuItem>
//                                             ))}
//                                     </Select>
//                                 </FormControl>
//                             </Box>
//                             <Box sx={{ flex: '1 1 calc(25% - 16px)' }}>
//                                 <FormControl fullWidth>
//                                     <Typography variant="body1" sx={{ fontSize: '12px' }}>Raw Material</Typography>
//                                     <Select
//                                         sx={{
//                                             height: '36px',
//                                             '& .MuiInputBase-root': {
//                                                 height: '36px',
//                                                 borderBottom: '2px solid #000',
//                                                 borderTop: 'none',
//                                                 borderLeft: 'none',
//                                                 borderRight: 'none',
//                                             },
//                                         }}
//                                         fullWidth
//                                         value={selectedMaterialName}
//                                         onChange={handleMaterialChange}
//                                         renderValue={() => (selectedMaterialName ? selectedMaterialName : 'Select a material')}
//                                     >
//                                         {Object.entries(groupedMaterials)
//                                             .filter(([_, items]) => items?.length > 0)
//                                             .map(([category, items]) => [
//                                                 ...items?.map((item) => (
//                                                     <MenuItem value={{ id: item.id, name: item.name } as any} key={item.id}>
//                                                         {item.name}
//                                                     </MenuItem>
//                                                 )),
//                                             ])}
//                                     </Select>
//                                 </FormControl>
//                             </Box>
//                             <Box sx={{ flex: '1 1 calc(25% - 16px)' }}>
//                                 <FormControl fullWidth>
//                                     <Typography variant="body1" sx={{ fontSize: '12px', whiteSpace: 'nowrap', overflow: 'hidden' }}>Additional Part Treatment</Typography>
//                                     <Select
//                                         value={selectedSurfaceTreatmentName}
//                                         onChange={handleSurfaceTreatmentChange}
//                                         renderValue={() => (selectedSurfaceTreatmentName ? selectedSurfaceTreatmentName : "Select a surface treatment")}
//                                         sx={{
//                                             height: '36px',
//                                             '& .MuiInputBase-root': {
//                                                 height: '36px',
//                                             },
//                                         }}
//                                     >
//                                         {Array.isArray(surfaceTreatments) &&
//                                             [...new Map(surfaceTreatments.map((st) => [st.name, st])).values()]
//                                                 .map((st) => (
//                                                     <MenuItem value={st as any} key={st.id}>
//                                                         {st.name}
//                                                     </MenuItem>
//                                                 ))}
//                                     </Select>
//                                 </FormControl>
//                             </Box>
//                             <Box sx={{ flex: '1 1 calc(25% - 16px)' }}>
//                                 <FormControl fullWidth>
//                                     <Typography variant="body1" sx={{ fontSize: '12px', whiteSpace: 'nowrap', overflow: 'hidden' }}>
//                                         Quantity
//                                     </Typography>
//                                     <Select
//                                         value={quantity}
//                                         onChange={(e) => setQuantity(e.target.value as number)}
//                                         renderValue={() => (quantity ? quantity.toString() : "Select a quantity")}
//                                         sx={{
//                                             height: '36px',
//                                             '& .MuiInputBase-root': {
//                                                 height: '36px',
//                                             },
//                                         }}
//                                     >
//                                         {quantities.map((quantityValue) => (
//                                             <MenuItem key={quantityValue} value={quantityValue}>
//                                                 {quantityValue}
//                                             </MenuItem>
//                                         ))}
//                                     </Select>
//                                 </FormControl>
//                             </Box>
//                         </Box>
//                     </Box>
//                 </Box>
//                 <Box sx={{ display: 'flex', justifyContent: 'end', mt: 2 }}>
//                     <Button
//                         disabled={
//                             !isFileUploaded ||
//                             selectedMaterialGroupName === "" ||
//                             selectedMaterialName === "" ||
//                             selectedSurfaceTreatmentName === ""
//                         }
//                         onClick={handleCalculateCosts}
//                         sx={{
//                             padding: { xs: "8px", sm: "12px" },
//                             fontSize: { xs: '0.8rem', sm: '1rem' },
//                             textAlign: "center",
//                             backgroundColor: "#0591FC",
//                             color: "#fff",
//                             borderRadius: "14px",
//                             cursor: "pointer",
//                             "&:hover": {
//                                 backgroundColor: "#0591FC",
//                             },
//                         }}>
//                         Calculate
//                     </Button>
//                 </Box>
//                 <Modal
//                     isOpen={openModal}
//                     onClose={() => setOpenModal(false)}
//                     title="Calculation result"
//                 >
//                     <Box sx={{ pb: 5 }}>
//                         <ModalComponent
//                             cadFileId={cadFileId}
//                             selectedMaterialGroupName={selectedMaterialGroupName}
//                             selectedSurfaceTreatmentName={selectedSurfaceTreatmentName}
//                             setOpenModal={setOpenModal}
//                             accessToken={accessToken}
//                             setDimensions={getDimensions}
//                             selectedMaterial={materials.find((m) => m.id === selectedMaterialId)}
//                             selectedSurfaceTreatment={surfaceTreatments.find((sT) => sT.id === selectedSurfaceTreatmentId)}
//                             volume={volume}
//                             surfaceArea={surfaceArea}
//                             setupCostsData={setupCostsTotal}
//                             unitCostsData={unitCostsTotal}
//                             totalCost={totalCost}
//                             costDetails={costDetails}
//                             getDimensions={getDimensions}
//                             uploadedFileName={uploadedFileName}
//                             selectedPart={selectedPart}
//                             selectedMaterialName={selectedMaterialName}
//                             selectedMachines={selectedMachines}
//                             rawMaterialGroup={rawMaterialGroup}
//                             density={(rawMaterialGroup as MaterialGroup)?.density}
//                             quantities={quantity}
//                         />
//                     </Box>
//                 </Modal>
//             </Container>
//         </Box>
//     );
// };

// export default SelectProcessingData;




import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Button,
    MenuItem,
    FormControl,
    Select,
    Backdrop,
    CircularProgress,
    Container,
    SelectChangeEvent,
} from "@mui/material";

// Components
import DashboardHeader from "../DashboardHeader";
import { Modal } from "../../../components/common/CustomModal";
import ModalComponent from '../../dashboard/ModalData';

// Redux imports
import { useDispatch, useSelector } from "react-redux";
import {
    uploadCadFile,
} from "../../../redux/features/cad/cadSlice";
import {
    getForgeToken
} from "../../../redux/features/forge/forgeSlice";
import {
    fetchMaterials,
    fetchMaterialGroups
} from "../../../redux/features/materials/materialsSlice";
import {
    fetchMachines
} from "../../../redux/features/machines/machinesSlice";
import {
    fetchSurfaceTreatments
} from "../../../redux/features/surfaceTreatments/surfaceTreatmentsSlice";
import {
    calculateCosts,
} from "../../../redux/features/costs/costsSlice";
import { RootState } from "../../../redux/store/store";

// Type definitions
import {
    Material,
    MaterialGroup,
    Machine,
    SurfaceTreatment,
    SelectedMachine,
    DimensionValues,
    CalculationData
} from "./types";

const quantities = [1, 5, 10, 25, 50, 100, 250, 500, 1000] as const;

// FileUpload Component
const FileUpload: React.FC<{
    onFileUpload: (file: File) => void
}> = ({ onFileUpload }) => {
    const [dragOver, setDragOver] = useState(false);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            onFileUpload(selectedFile);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = () => {
        setDragOver(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragOver(false);
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            onFileUpload(files[0]);
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                mb: 3,
                px: { xs: 1, sm: 3, md: 5 },
                alignItems: "center",
            }}
        >
            <Box
                sx={{
                    padding: { xs: "10px", sm: "20px" },
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <input
                    accept=".stp,.dwg,.dxf"
                    style={{ display: "none" }}
                    id="upload-file"
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                />
                <label htmlFor="upload-file">
                    <Box
                        sx={{
                            width: '100%',
                            padding: "12px 12px",
                            textAlign: "center",
                            backgroundColor: "#0591FC",
                            color: "#fff",
                            borderRadius: "14px",
                            cursor: "pointer",
                            "&:hover": {
                                backgroundColor: "#0591FC",
                            },
                        }}
                    >
                        Select a Sample Model
                    </Box>
                </label>
            </Box>
        </Box>
    );
};

// MaterialSelection Component
const MaterialSelection: React.FC<{
    materialGroups: MaterialGroup[];
    groupedMaterials: Record<string, Material[]>;
    selectedMaterialGroupName: string;
    selectedMaterialName: string;
    onMaterialGroupChange: (e: SelectChangeEvent<MaterialGroup>) => void;
    onMaterialChange: (e: SelectChangeEvent<{ id: string, name: string }>) => void;
}> = ({
    materialGroups,
    groupedMaterials,
    selectedMaterialGroupName,
    selectedMaterialName,
    onMaterialGroupChange,
    onMaterialChange
}) => {
        return (
            <>
                <Box sx={{ flex: '1 1 calc(25% - 16px)' }}>
                    <FormControl fullWidth>
                        <Typography variant="body1" sx={{ fontSize: '12px' }}>Raw Material Group</Typography>
                        <Select
                            sx={{
                                height: '36px',
                                '& .MuiInputBase-root': {
                                    height: '36px',
                                    borderBottom: '2px solid #000',
                                    borderTop: 'none',
                                    borderLeft: 'none',
                                    borderRight: 'none',
                                },
                            }}
                            fullWidth
                            value={selectedMaterialGroupName}
                            onChange={onMaterialGroupChange}
                            renderValue={() => (selectedMaterialGroupName ? selectedMaterialGroupName : 'Select a material')}
                        >
                            {materialGroups.map((material) => (
                                <MenuItem key={material.id} value={material as any}>
                                    {material.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
                <Box sx={{ flex: '1 1 calc(25% - 16px)' }}>
                    <FormControl fullWidth>
                        <Typography variant="body1" sx={{ fontSize: '12px' }}>Raw Material</Typography>
                        <Select
                            sx={{
                                height: '36px',
                                '& .MuiInputBase-root': {
                                    height: '36px',
                                    borderBottom: '2px solid #000',
                                    borderTop: 'none',
                                    borderLeft: 'none',
                                    borderRight: 'none',
                                },
                            }}
                            fullWidth
                            value={selectedMaterialName}
                            onChange={onMaterialChange}
                            renderValue={() => (selectedMaterialName ? selectedMaterialName : 'Select a material')}
                        >
                            {Object.entries(groupedMaterials)
                                .filter(([_, items]) => items?.length > 0)
                                .map(([category, items]) =>
                                    items?.map((item) => (
                                        <MenuItem value={{ id: item.id, name: item.name } as any} key={item.id}>
                                            {item.name}
                                        </MenuItem>
                                    ))
                                )}
                        </Select>
                    </FormControl>
                </Box>
            </>
        );
    };

// TreatmentAndQuantitySelection Component
const TreatmentAndQuantitySelection: React.FC<{
    surfaceTreatments: SurfaceTreatment[];
    selectedSurfaceTreatmentName: string;
    quantity: number | undefined;
    onSurfaceTreatmentChange: (e: SelectChangeEvent<SurfaceTreatment>) => void;
    onQuantityChange: (quantity: number) => void;
}> = ({
    surfaceTreatments,
    selectedSurfaceTreatmentName,
    quantity,
    onSurfaceTreatmentChange,
    onQuantityChange
}) => {
        return (
            <>
                <Box sx={{ flex: '1 1 calc(25% - 16px)' }}>
                    <FormControl fullWidth>
                        <Typography variant="body1" sx={{ fontSize: '12px', whiteSpace: 'nowrap', overflow: 'hidden' }}>Additional Part Treatment</Typography>
                        <Select
                            value={selectedSurfaceTreatmentName}
                            onChange={onSurfaceTreatmentChange}
                            renderValue={() => (selectedSurfaceTreatmentName ? selectedSurfaceTreatmentName : "Select a surface treatment")}
                            sx={{
                                height: '36px',
                                '& .MuiInputBase-root': {
                                    height: '36px',
                                },
                            }}
                        >
                            {Array.isArray(surfaceTreatments) &&
                                [...new Map(surfaceTreatments.map((st) => [st.name, st])).values()]
                                    .map((st) => (
                                        <MenuItem value={st as any} key={st.id}>
                                            {st.name}
                                        </MenuItem>
                                    ))}
                        </Select>
                    </FormControl>
                </Box>
                <Box sx={{ flex: '1 1 calc(25% - 16px)' }}>
                    <FormControl fullWidth>
                        <Typography variant="body1" sx={{ fontSize: '12px', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                            Quantity
                        </Typography>
                        <Select
                            value={quantity}
                            onChange={(e) => onQuantityChange(e.target.value as number)}
                            renderValue={() => (quantity ? quantity.toString() : "Select a quantity")}
                            sx={{
                                height: '36px',
                                '& .MuiInputBase-root': {
                                    height: '36px',
                                },
                            }}
                        >
                            {quantities.map((quantityValue) => (
                                <MenuItem key={quantityValue} value={quantityValue}>
                                    {quantityValue}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
            </>
        );
    };

const SelectProcessingData: React.FC = () => {
    const dispatch = useDispatch();

    // Redux selectors
    const {
        fileId: cadFileId,
        fileName: uploadedFileName,
        status: cadStatus
    } = useSelector((state: RootState) => state.cad);

    const { token: accessToken } = useSelector((state: RootState) => state.forge);

    const {
        materials,
        groups: materialGroups,
        status: materialsStatus
    } = useSelector((state: RootState) => state.materials);

    const {
        machines,
        status: machinesStatus
    } = useSelector((state: RootState) => state.machines);

    const {
        treatments: surfaceTreatments,
        status: surfaceTreatmentsStatus
    } = useSelector((state: RootState) => state.surfaceTreatments);

    const {
        setupCosts: setupCostsData,
        unitCosts: unitCostsData,
        totalCost,
        details: costDetails,
        status: costsStatus
    } = useSelector((state: RootState) => state.costs);

    // Local state
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [selectedPart, setSelectedPart] = useState<string>("");
    const [groupedMaterials, setGroupedMaterials] = useState<Record<string, Material[]>>({});
    const [volume, setVolume] = useState<number>(0);
    const [surfaceArea, setSurfaceArea] = useState<number>(0);
    const [isCalculationDone, setIsCalculationDone] = useState<boolean>(false);
    const [setupCostsTotal, setSetupCostsTotal] = useState<number>(0);
    const [unitCostsTotal, setUnitCostsTotal] = useState<number>(0);
    const [selectedMachines, setSelectedMachines] = useState<SelectedMachine[]>([]);
    const [selectedSurfaceTreatmentId, setSelectedSurfaceTreatmentId] = useState<string>('');
    const [selectedSurfaceTreatmentName, setSelectedSurfaceTreatmentName] = useState<string>("");
    const [quantity, setQuantity] = useState<number>();
    const [additionalPartTreatment, setAdditionalPartTreatment] = useState<SurfaceTreatment | {}>({});
    const [groupedMachines, setGroupedMachines] = useState<Record<string, Machine[]>>({});
    const [selectedMaterialName, setSelectedMaterialName] = useState<string>("");
    const [selectedMaterialGroupName, setSelectedMaterialGroupName] = useState<string>("");
    const [rawMaterialGroup, setRawMaterialGroup] = useState<MaterialGroup | {}>({});
    const [rawMaterial, setRawMaterial] = useState<Material | {}>({});
    const [selectedMaterialId, setSelectedMaterialId] = useState<string>('');

    const isLoading =
        cadStatus === 'loading' ||
        materialsStatus === 'loading' ||
        machinesStatus === 'loading' ||
        surfaceTreatmentsStatus === 'loading' ||
        costsStatus === 'loading';

    const isFileUploaded = cadStatus === 'succeeded';

    useEffect(() => {
        dispatch(fetchSurfaceTreatments());
        dispatch(fetchMaterialGroups());
        dispatch(fetchMaterials());
        dispatch(fetchMachines());

    }, [dispatch]);

    const handleFileUpload = (selectedFile: File) => {
        if (selectedFile) {
            dispatch(uploadCadFile(selectedFile))
                .then(() => dispatch(getForgeToken()));
        }
    };

    const handleMaterialSelection = (materialId: string) => {
        setSelectedMaterialId(materialId);
    };

    const handleMaterialChange = (e: SelectChangeEvent<{ id: string, name: string }>) => {
        const selMaterial = e.target.value as { id: string, name: string };
        setRawMaterial(selMaterial);
        setSelectedMaterialName(selMaterial.name);
        handleMaterialSelection(selMaterial.id);
    };

    const handleMaterialGroupChange = (e: SelectChangeEvent<MaterialGroup>) => {
        setSelectedMaterialName('');
        const selMaterialId = e.target.value as MaterialGroup;
        const selMaterialGroup = materialGroups.find(group => group.id === selMaterialId.id);

        if (selMaterialGroup) {
            setRawMaterialGroup(selMaterialGroup);
            setSelectedMaterialGroupName(selMaterialGroup.name);

            const groupedMaterials = materials.filter(
                material => material.material_group_id === selMaterialId.id
            );

            const grouped = {
                [selMaterialGroup.name]: groupedMaterials
            };

            setGroupedMaterials(grouped);
        }
    };

    useEffect(() => {
        if (materials.length && materialGroups.length) {
            groupMaterialsByGroups();
        }
    }, [materials, materialGroups]);

    const groupMaterialsByGroups = () => {
        const grouped = materialGroups.reduce((acc: Record<string, Material[]>, group) => {
            const groupMaterials = materials.filter(material => material.material_group_id === group.id);
            acc[group.name] = groupMaterials;
            return acc;
        }, {});
        setGroupedMaterials(grouped);
    };

    useEffect(() => {
        if (machines.length) {
            groupMachinesByCategories();
        }
    }, [machines]);

    const groupMachinesByCategories = () => {
        const grouped = machines?.reduce((acc: Record<string, Machine[]>, machine) => {
            const category = machine.category;
            if (!acc[category]) acc[category] = [];
            acc[category].push(machine);
            return acc;
        }, {});
        setGroupedMachines(grouped);
    };

    const getDimensions = (dimensionValues: DimensionValues) => {
        setVolume(dimensionValues.rawMaterialDimensions.volume);
        setSurfaceArea(dimensionValues.rawMaterialDimensions.surfaceArea);
    };

    const getSelectedMachine = (selectedMachines: SelectedMachine[]) => {
        return selectedMachines.map((machine) => {
            return {
                ...machines.find((m) => m.id === machine.id),
                machining_time: getMachiningCost(machine.programmingTime)
            };
        });
    };

    const getMachiningCost = (programmingTime: string) => {
        const programmingTimeParam = programmingTime.split(" ");
        if (programmingTimeParam[1] === 'hour' || programmingTimeParam[1] === 'hours') {
            return parseFloat(programmingTimeParam[0]);
        } else {
            return parseFloat(programmingTimeParam[0]) / 60;
        }
    };



    const handleCalculateCosts = () => {
        const calculationData: CalculationData = {
            selectedMaterial: materials.find((m) => m.id === selectedMaterialId),
            selectedSurfaceTreatment: surfaceTreatments.find((sT) => sT.id === selectedSurfaceTreatmentId),
            selectedMachines: getSelectedMachine(selectedMachines),
            volume: volume,
            surfaceArea: surfaceArea
        };

        dispatch(calculateCosts(calculationData))
            .then(() => {
                setIsCalculationDone(true);
                setOpenModal(true);
            });
    };

    const handleSurfaceTreatmentChange = (e: SelectChangeEvent<SurfaceTreatment>) => {
        const selSurfaceTreatment = e.target.value as SurfaceTreatment;
        setAdditionalPartTreatment(selSurfaceTreatment);
        setSelectedSurfaceTreatmentName(selSurfaceTreatment.name);
        handleSurfaceTreatmentSelection(selSurfaceTreatment.id);
    };

    const handleSurfaceTreatmentSelection = (surfaceTreatmentId: string) => {
        setSelectedSurfaceTreatmentId(surfaceTreatmentId);
    };

    const handleQuantityChange = (newQuantity: number) => {
        setQuantity(newQuantity);
    };

    return (
        <Box sx={{ padding: '20px' }}>
            <Container maxWidth="lg" sx={{ padding: '20px' }}>
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
                <Typography variant="h5" gutterBottom sx={{ paddingTop: 3, fontSize: { xs: '1.2rem', sm: '1.5rem' } }}>
                    Upload your model and select processing data
                </Typography>
                <Box sx={{ padding: 3, maxWidth: "100%", margin: "auto", bgcolor: 'white', borderRadius: 5 }}>
                    <FileUpload onFileUpload={handleFileUpload} />

                    <Typography variant="h6" sx={{ margin: "10px 0", fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                        Please select data below
                    </Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                            mb: 3,
                            bgcolor: '#F2F5FB80',
                            borderRadius: 4,
                            padding: 3,
                        }}
                    >
                        <Typography variant="body1" gutterBottom sx={{ fontSize: '12px' }}>
                            Model: <span>{uploadedFileName && uploadedFileName}</span>
                        </Typography>
                        <Box
                            sx={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 2,
                            }}
                        >
                            <MaterialSelection
                                materialGroups={materialGroups}
                                groupedMaterials={groupedMaterials}
                                selectedMaterialGroupName={selectedMaterialGroupName}
                                selectedMaterialName={selectedMaterialName}
                                onMaterialGroupChange={handleMaterialGroupChange}
                                onMaterialChange={handleMaterialChange}
                            />
                            <TreatmentAndQuantitySelection
                                surfaceTreatments={surfaceTreatments}
                                selectedSurfaceTreatmentName={selectedSurfaceTreatmentName}
                                quantity={quantity}
                                onSurfaceTreatmentChange={handleSurfaceTreatmentChange}
                                onQuantityChange={handleQuantityChange}
                            />
                        </Box>
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'end', mt: 2 }}>
                    <Button
                        disabled={
                            !isFileUploaded ||
                            selectedMaterialGroupName === "" ||
                            selectedMaterialName === "" ||
                            selectedSurfaceTreatmentName === ""
                        }
                        onClick={handleCalculateCosts}
                        sx={{
                            padding: { xs: "8px", sm: "12px" },
                            fontSize: { xs: '0.8rem', sm: '1rem' },
                            textAlign: "center",
                            backgroundColor: "#0591FC",
                            color: "#fff",
                            borderRadius: "14px",
                            cursor: "pointer",
                            "&:hover": {
                                backgroundColor: "#0591FC",
                            },
                        }}>
                        Calculate
                    </Button>
                </Box>
                <Modal
                    isOpen={openModal}
                    onClose={() => setOpenModal(false)}
                    title="Calculation result"
                    width={'60%'}
                >
                    <Box sx={{ pb: 5 }}>
                        <ModalComponent
                            cadFileId={cadFileId}
                            selectedMaterialGroupName={selectedMaterialGroupName}
                            selectedSurfaceTreatmentName={selectedSurfaceTreatmentName}
                            setOpenModal={setOpenModal}
                            accessToken={accessToken}
                            setDimensions={getDimensions}
                            selectedMaterial={materials.find((m) => m.id === selectedMaterialId)}
                            selectedSurfaceTreatment={surfaceTreatments.find((sT) => sT.id === selectedSurfaceTreatmentId)}
                            volume={volume}
                            surfaceArea={surfaceArea}
                            setupCostsData={setupCostsTotal}
                            unitCostsData={unitCostsTotal}
                            totalCost={totalCost}
                            costDetails={costDetails}
                            getDimensions={getDimensions}
                            uploadedFileName={uploadedFileName}
                            selectedPart={selectedPart}
                            selectedMaterialName={selectedMaterialName}
                            selectedMachines={selectedMachines}
                            rawMaterialGroup={rawMaterialGroup}
                            density={(rawMaterialGroup as MaterialGroup)?.density}
                            quantities={quantity}
                        />
                    </Box>
                </Modal>
            </Container>
        </Box>
    );
};

export default SelectProcessingData;