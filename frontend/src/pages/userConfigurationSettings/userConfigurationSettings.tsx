import React from "react";
import { Box, Tab, Tabs, Typography, styled, useMediaQuery, useTheme } from "@mui/material";
import Machine from "./machines/machines";
import Materials from "./materials/materials";
import MaterialGroups from "./materialGroups/materialGroups";
import SurfaceTreatments from "./surfaceTreatments/surfaceTreatments";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// Styled components
const StyledTabs = styled(Tabs)(({ theme }) => ({
  minHeight: '20px',
  '& .MuiTabs-indicator': {
    display: 'none', // Hide the default indicator
  },
  [theme.breakpoints.down('sm')]: {
    '& .MuiTabs-flexContainer': {
      flexWrap: 'wrap',
      justifyContent: 'center',
    },
  },
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: 'none',
  // minHeight: '40px',
  // padding: '8px 24px',
  borderRadius: '100px',
  color: '#000',
  marginRight: '8px',
  marginBottom: '8px',
  border: '1px solid transparent',
  '&.Mui-selected': {
    color: '#fff',
    backgroundColor: '#0591FC',
  },
  '&:not(.Mui-selected)': {
    backgroundColor: '#fff',
    border: '1px solid #E5E7EB',
  },
  [theme.breakpoints.down('sm')]: {
    flex: '1 1 calc(50% - 8px)',
    maxWidth: 'calc(50% - 8px)',
  },
}));

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`configuration-tabpanel-${index}`}
      aria-labelledby={`configuration-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{}}>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `configuration-tab-${index}`,
    'aria-controls': `configuration-tabpanel-${index}`,
  };
}

const UserConfigurationSettings: React.FC = () => {
  const [value, setValue] = React.useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{padding:{xs:'10px',md:'20px'}}}>
      <Box sx={{ borderBottom: 'none' }}>
        <StyledTabs
          value={value}
          onChange={handleChange}
          aria-label="configuration tabs"
          variant={isMobile ? "fullWidth" : "scrollable"}
          scrollButtons={isMobile ? false : "auto"}
        >
          <StyledTab label="Machines" {...a11yProps(0)} />
          <StyledTab label="Surface Treatment" {...a11yProps(1)} />
          <StyledTab label="Materials" {...a11yProps(2)} />
          <StyledTab label="Material Groups" {...a11yProps(3)} />
        </StyledTabs>
      </Box>
      <TabPanel value={value} index={0}>
        <Machine />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <SurfaceTreatments />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Materials />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <MaterialGroups />  
      </TabPanel>
    </Box>
  );
};

export default UserConfigurationSettings;

