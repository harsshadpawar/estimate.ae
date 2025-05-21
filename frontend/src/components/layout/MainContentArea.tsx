import React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { DRAWER_WIDTH, MINI_DRAWER_WIDTH } from "@/pages/layout/layout";

interface MainContentAreaProps {
  open: boolean;
  isMobile: boolean;
  children: React.ReactNode;
}

const Main = styled('main', {
  shouldForwardProp: (prop) => prop !== 'open' && prop !== 'isMobile',
})<{
  open: boolean;
  isMobile: boolean;
}>(({ theme, open, isMobile }) => ({
  flexGrow: 1,
  bgcolor: 'red',
  padding: theme.spacing(3),
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: isMobile ? 0 : (open ? DRAWER_WIDTH : MINI_DRAWER_WIDTH),
  width: isMobile 
    ? '100%' 
    : `calc(100% - ${open ? DRAWER_WIDTH : MINI_DRAWER_WIDTH}px)`,
  height: '100vh',
  overflow: 'auto', // Enable scrolling
  [theme.breakpoints.up('md')]: {
    marginTop: 64,
    height: 'calc(100vh - 64px)', // Adjust for AppBar height
  },
  [theme.breakpoints.down('md')]: {
    marginTop: 56,
    // height: 'calc(100vh - 56px)', // Adjust for AppBar height on mobile
    marginLeft: 0,
    width: '100%',
  },
  // bgcolor: '#F8F9FF',
  
}));

const MainContentArea: React.FC<MainContentAreaProps> = ({ open, isMobile, children }) => {
  return (
    <Main open={open} isMobile={isMobile}>
      <Box sx={{ py: 4 }}>
        {children}
      </Box>
    </Main>
  );
};

export default MainContentArea;
