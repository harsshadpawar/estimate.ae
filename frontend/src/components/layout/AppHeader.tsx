import React from "react";
import { AppBar, Toolbar } from "@mui/material";
import TopBar from "./TopBar";
import { DRAWER_WIDTH, MINI_DRAWER_WIDTH } from "@/pages/layout/layout";

// Props for AppHeader
interface AppHeaderProps {
  drawerOpen: boolean;
  toggleDrawer: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ drawerOpen, toggleDrawer }) => {
  return (
    <AppBar
      position="fixed"
      sx={{
        width: { 
          xs: '100%',
          md: `calc(100% - ${drawerOpen ? DRAWER_WIDTH : MINI_DRAWER_WIDTH}px)` 
        },
        ml: { 
          xs: 0,
          md: drawerOpen ? DRAWER_WIDTH : MINI_DRAWER_WIDTH
        },
        transition: (theme) => theme.transitions.create(['margin', 'width'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        bgcolor: '#F8F9FF',
        boxShadow: 'none',
        borderBottom: '1px solid',
        borderColor: 'divider',
        zIndex: (theme) => theme.zIndex.drawer, // Ensure AppBar is above drawer
      }}
    >
      <Toolbar sx={{ p: 0 }}>
        <TopBar handleDrawerToggle={toggleDrawer} />
      </Toolbar>
    </AppBar>
  );
};

export default AppHeader;