import React, { useState } from "react";
import { Box, TextField, Typography, Button, MenuItem, Select, ListSubheader, IconButton, Paper, Grid, FormControl, Slider } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import "./dataSelection.css";
import { styled } from '@mui/material/styles';
import InfoIcon from '@mui/icons-material/Info';
const StyledPaper = styled(Paper)(({ theme }) => ({
  // maxWidth: '900px',
  margin: '0 auto',
  borderRadius: '8px',
  overflow: 'hidden',
}));
const StyledHeader = styled(Box)(({ theme }) => ({
  backgroundColor: '#CAE8FF',
  padding: theme.spacing(2),
}));
const StyledContent = styled(Box)(({ theme }) => ({
  paddingRight: theme.spacing(3),
  paddingLeft: theme.spacing(3),
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
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
    height: 15,
    width: 15,
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
const programmingTimes = [
  "10 mins", "20 mins", "30 mins", "1 hour", "2 hours", "4 hours", "6 hours",
  "8 hours", "10 hours", "12 hours", "14 hours", "16 hours", "18 hours", "20 hours",
  "22 hours", "24 hours", "26 hours", "28 hours", "30 hours", "32 hours", "34 hours",
  "36 hours", "38 hours", "40 hours", "42 hours", "44 hours", "46 hours", "48 hours",
  "50 hours", "52 hours", "54 hours", "56 hours", "58 hours", "60 hours",
];

const DataSelection = ({
  machines,
  materials,
  surfaceTreatments,
  uploadedFileName,
  handleMachineSelection,
  handleMaterialSelection,
  handleSurfaceTreatmentSelection
}: any) => {
  const [selectedMaterialName, setSelectedMaterialName] = useState("");
  const [selectedSurfaceTreatmentName, setSelectedSurfaceTreatmentName] = useState("");
  const [addedMachines, setAddedMachines] = useState([]);

  const handleAddMachine = () => {
    setAddedMachines((prevMachines) => [
      ...prevMachines,
      { name: "", programmingTime: "" },
    ]);
  };
  const [sliderValues, setSliderValues] = React.useState({
    hourlyRate: 1,
    setupTime: 1,
    cuttingParameter: 1,
  });

  const handleSliderChange = (name: string) => (event: Event, newValue: number | number[]) => {
    setSliderValues(prev => ({ ...prev, [name]: newValue as number }));
  };
  const handleMachineChange = (index, field, value) => {
    const updatedMachines = [...addedMachines];
    if (field === "machine") {
      updatedMachines[index].name = value.name;
      updatedMachines[index].id = value.id;
    } else {
      updatedMachines[index][field] = value;
    }
    setAddedMachines(updatedMachines);
    handleMachineSelection(addedMachines);
  };

  const handleDeleteMachine = (index) => {
    setAddedMachines((prevMachines) => prevMachines.filter((_, i) => i !== index));
  };

  const handleMaterialChange = (e) => {
    const selMaterial = e.target.value;
    setSelectedMaterialName(selMaterial.name);
    handleMaterialSelection(selMaterial.id);
  };

  const handleSurfaceTreatmentChange = (e) => {
    const selSurfaceTreatment = e.target.value;
    setSelectedSurfaceTreatmentName(selSurfaceTreatment.name);
    handleSurfaceTreatmentSelection(selSurfaceTreatment.id);
  };

  return (
    <StyledPaper elevation={1}>
      <StyledHeader>
        <Typography sx={{ fontSize: '18px', fontWeight: '600', lineHeight: '24px' }}>Please select data below</Typography>
      </StyledHeader>
      <StyledContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Model */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <LabelWithInfo sx={{ flex: 1 }}>
              <Typography sx={{ fontSize: '15px', fontWeight: 500, lineHeight: '18.15px' }}>
                Model
              </Typography>
              <InfoIcon fontSize="small" color="action" />
            </LabelWithInfo>
            <TextField
              sx={{
                flex: 2,
                height: '36px',
                '& .MuiInputBase-root': {
                  height: '36px',
                },
              }}
              fullWidth
              value={uploadedFileName}
              disabled
              variant="outlined"
            />
          </Box>


          {/* Material Group */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <LabelWithInfo sx={{ flex: 1 }}>
              <Typography sx={{ fontSize: '15px', fontWeight: 500, lineHeight: '18.15px' }}>
                Material Group
              </Typography>
              <InfoIcon fontSize="small" color="action" />
            </LabelWithInfo>
            <Select
              sx={{
                flex: 2,
                height: '36px',
                '& .MuiInputBase-root': {
                  height: '36px',
                },
              }}
              fullWidth
              value={selectedMaterialName}
              onChange={handleMaterialChange}
              renderValue={() => (selectedMaterialName ? selectedMaterialName : 'Select a material')}
            >
              {Object.entries(materials)
                .filter(([_, items]) => items?.length > 0)
                .map(([category, items]) => [
                  <ListSubheader key={category}>{category}</ListSubheader>,
                  ...items?.map((item) => (
                    <MenuItem value={{ id: item.id, name: item.name }} key={item.id}>
                      {item.name}
                    </MenuItem>
                  )),
                ])}
            </Select>
          </Box>

          {/* Semi Finished Product */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <LabelWithInfo sx={{ flex: 1 }}>
              <Typography sx={{ fontSize: '15px', fontWeight: 500, lineHeight: '18.15px' }}>
                Semi Finished Product
              </Typography>
              <InfoIcon fontSize="small" color="action" />
            </LabelWithInfo>
            <TextField
              sx={{
                flex: 2,
                height: '36px',
                '& .MuiInputBase-root': {
                  height: '36px',
                },
              }}
              fullWidth
              variant="outlined"
            />
          </Box>


          {/* Surface Treatment */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <LabelWithInfo sx={{ flex: 1 }}>
              <Typography sx={{ fontSize: '15px', fontWeight: 500, lineHeight: '18.15px' }}>
                Surface Treatment
              </Typography>
              <InfoIcon fontSize="small" color="action" />
            </LabelWithInfo>
            <FormControl
              sx={{
                flex: 2,
                height: '36px',
              }}
              fullWidth
              variant="outlined"
            >
              <Select
                value={selectedSurfaceTreatmentName}
                onChange={handleSurfaceTreatmentChange}
                renderValue={() =>
                  selectedSurfaceTreatmentName ? selectedSurfaceTreatmentName : 'Select a surface treatment'
                }
                sx={{
                  height: '36px',
                  '& .MuiInputBase-root': {
                    height: '36px',
                  },
                }}
              >
                {Array.isArray(surfaceTreatments) &&
                  surfaceTreatments.map((st: any) => (
                    <MenuItem value={{ id: st.id, name: st.name }} key={st.id}>
                      {st.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Box>

        </Box>
      </StyledContent>
      <StyledContent>
        {/* Hourly Rate Slider */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Label Section */}
          <LabelWithInfo sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2">Hourly rate</Typography>
            <InfoIcon fontSize="small" color="action" sx={{ marginLeft: 1 }} />
          </LabelWithInfo>

          {/* Slider Section */}
          <Box sx={{ flex: 2 }}>
            <CustomSlider
              value={sliderValues.hourlyRate}
              onChange={handleSliderChange('hourlyRate')}
              step={1}
              marks
              min={0}
              max={2}
            />
            <SliderLabels sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="caption">LOW</Typography>
              <Typography variant="caption">MEDIUM</Typography>
              <Typography variant="caption">HIGH</Typography>
            </SliderLabels>
          </Box>
        </Box>


        {/* Setup Time Slider */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Label Section */}

          <LabelWithInfo sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2">Setup Time</Typography>
            <InfoIcon fontSize="small" color="action" sx={{ marginLeft: 1 }} />
          </LabelWithInfo>
          {/* Slider Section */}
          <Box sx={{ flex: 2 }}>
            <CustomSlider
              sx={{ flex: 1 }}
              value={sliderValues.setupTime}
              onChange={handleSliderChange('setupTime')}
              step={1}
              marks
              min={0}
              max={2}
            />
            <SliderLabels sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="caption">LOW</Typography>
              <Typography variant="caption">MEDIUM</Typography>
              <Typography variant="caption">HIGH</Typography>
            </SliderLabels>
          </Box>
        </Box>


        {/* Cutting Parameter Slider */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>

          {/* Label Section */}

          <LabelWithInfo sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2">Cutting Parameter</Typography>
            <InfoIcon fontSize="small" color="action" sx={{ marginLeft: 1 }} />
          </LabelWithInfo>


          {/* Slider Section */}
          <Box sx={{ flex: 2 }}>
            <Box>
              <CustomSlider
                sx={{ flex: 1 }}
                value={sliderValues.cuttingParameter}
                onChange={handleSliderChange('cuttingParameter')}
                step={1}
                marks
                min={0}
                max={2}
              />
              <SliderLabels sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="caption">LOW</Typography>
                <Typography variant="caption">MEDIUM</Typography>
                <Typography variant="caption">HIGH</Typography>
              </SliderLabels>
            </Box>
          </Box>
        </Box>
      </StyledContent>
      {/* <Box sx={{ marginBottom: "20px" }}>
        <Typography>Model</Typography>
        <TextField fullWidth value={uploadedFileName} disabled />
      </Box>

      <Box sx={{ marginBottom: "20px" }}>
        <Typography>Material</Typography>
        <Select
          fullWidth
          value={selectedMaterialName}
          onChange={handleMaterialChange}
          renderValue={() => (selectedMaterialName ? selectedMaterialName : "Select a material")}
        >
          {Object.entries(materials)
            .filter(([_, items]) => items.length > 0) // Show only groups with materials
            .map(([category, items]) => [
              <ListSubheader key={category}>{category}</ListSubheader>,
              ...items.map((item) => (
                <MenuItem value={{ id: item.id, name: item.name }} key={item.id}>
                  {item.name}
                </MenuItem>
              )),
            ])}
        </Select>
      </Box>

      <Box sx={{ marginBottom: "20px" }}>
        <Typography>Surface Treatment</Typography>
        <Select
          fullWidth
          value={selectedSurfaceTreatmentName}
          onChange={handleSurfaceTreatmentChange}
          renderValue={() => (selectedSurfaceTreatmentName ? selectedSurfaceTreatmentName : "Select a surface treatment")}
        >
          // {/* {surfaceTreatments?.map((st:any) => (
          //     <MenuItem value={{ id: st.id, name: st.name }} key={st.id}>
          //       {st.name}
          //     </MenuItem>
          //   ))} *
          {Array.isArray(surfaceTreatments) &&
            surfaceTreatments.map((st: any) => (
              <MenuItem value={{ id: st.id, name: st.name }} key={st.id}>
                {st.name}
              </MenuItem>
            ))}

        </Select>
      </Box> */}

      <StyledContent>
        <div className="machines-header">
          <Typography variant="h6" gutterBottom sx={{ marginTop: "20px" }}>
            Machines
          </Typography>
          <Button variant="outlined" onClick={handleAddMachine}>
            Add Machine
          </Button>
        </div>
        {addedMachines.map((machine, index) => (
          <Box
            key={index}
            className="machine-container"
          >
            <Typography className="machine-number">
              Machine {index + 1}
            </Typography>
            <Box sx={{ flexGrow: 1 }}>
              <Typography sx={{ fontSize: "0.9rem", marginBottom: "4px" }}>
                Name
              </Typography>
              <Select
                fullWidth
                value={machine.name}
                onChange={(e) =>
                  handleMachineChange(index, "machine", e.target.value)
                }
                renderValue={() => (machine.name ? machine.name : "Select a machine")}
              >
                {Object.entries(machines)
                  .filter(([_, items]) => items.length > 0) // Show only categories with machines
                  .map(([category, items]) => [
                    <ListSubheader key={category}>{category}</ListSubheader>,
                    ...items.map((item) => (
                      <MenuItem value={{ id: item.id, name: item.name }} key={item.id}>
                        {item.name}
                      </MenuItem>
                    )),
                  ])}
              </Select>
            </Box>
            <Box>
              <Typography sx={{ fontSize: "0.9rem", marginBottom: "4px" }}>
                Programming Time
              </Typography>
              <Select
                fullWidth
                value={machine.programmingTime}
                onChange={(e) =>
                  handleMachineChange(index, "programmingTime", e.target.value)
                }
              >
                {programmingTimes.map((time) => (
                  <MenuItem value={time} key={time}>
                    {time}
                  </MenuItem>
                ))}
              </Select>
            </Box>
            <IconButton onClick={() => handleDeleteMachine(index)}>
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}
      </StyledContent>
    </StyledPaper>
  );
};

export default DataSelection;
