import React from "react";
import { styled } from "@mui/material/styles";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material";
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import TuneIcon from '@mui/icons-material/Tune';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import HomeIcon from "@mui/icons-material/Home";
import SettingsIcon from "@mui/icons-material/Settings";
import LOGO from '@/assets/images/Group 11.png';
import Logoo from '@/assets/images/Group 7.png'
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard'; // replacing SpaceDashboardFilled
import GroupIcon from '@mui/icons-material/Group'; // replacing PeopleFilled
import { DRAWER_WIDTH, MINI_DRAWER_WIDTH } from "@/pages/layout/layout";

import { Theme } from "@mui/material";

interface MenuItem {
  path: string;
  text: string;
  icon: string;
}

interface SideNavigationProps {
  isMobile: boolean;
  drawerOpen: boolean;
  mobileDrawerOpen: boolean;
  setMobileDrawerOpen: (open: boolean) => void;
  activeTab: string;
  handleTabClick: (path: string) => void;
  handleHome: () => void;
  menuItems: MenuItem[];
}

interface StyledListItemProps {
  active: number;
}

// For desktop drawer
const DesktopDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    backgroundColor: '#ffffff',
    border: 'none',
    padding: '16px 0 16px 0',
    overflowX: 'hidden',
    zIndex: theme.zIndex.drawer,
    transition: theme.transitions.create(['width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
}));

const LogoContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '24px 16px',
  marginBottom: '24px',
  cursor: 'pointer',
});

const StyledListItem = styled(ListItem, {
  shouldForwardProp: (prop) => prop !== 'active',
})<StyledListItemProps>(({ active }) => ({
  borderRadius: '0 16px 16px 0',
  marginBottom: '8px',
  padding: '12px 16px',
  height: '60px',
  backgroundColor: active ? '#0591FC' : '#ffffff',
  '&:hover': {
    backgroundColor: active ? '#0591FC' : 'rgba(5, 145, 252, 0.08)',
  },
}));

const SideNavigation: React.FC<SideNavigationProps> = ({
  isMobile,
  drawerOpen,
  mobileDrawerOpen,
  setMobileDrawerOpen,
  activeTab,
  handleTabClick,
  handleHome,
  menuItems,
}) => {
  console.log("isMobile:", isMobile, "mobileDrawerOpen:", mobileDrawerOpen);

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Dashboard': return <DashboardIcon />;
      case 'ManageAccounts': return <ManageAccountsIcon />;
      case 'Analytics': return <AnalyticsIcon />;
      case 'MonetizationOn': return <MonetizationOnIcon />;
      case 'Tune': return <TuneIcon />;
      case 'NotificationsActive': return <NotificationsActiveIcon />;
      case 'Subscriptions': return <SubscriptionsIcon />;
      case 'Settings': return <SettingsIcon />;
      case 'People': return <PeopleIcon />;
      case 'Group': return <GroupIcon />;
      case 'SpaceDashboard': return <SpaceDashboardIcon />;
      case 'Home':
      default: return <HomeIcon />;
    }
  };

  const renderDrawerContent = (isMinimal = false) => (
    <>
      <LogoContainer onClick={handleHome}>
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          img: {
            height: { xs: '40px', sm: '45px', md: '50px' },
            width: isMinimal ? '40px' : '100%',
            objectFit: 'contain',
          }
        }}>
          <img src={!isMinimal ? LOGO : Logoo} alt="Logo" />
        </Box>
      </LogoContainer>

      <List sx={{
        paddingRight: isMinimal ? 1 : 3,
        overflowY: 'auto',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        '&::-webkit-scrollbar': { display: 'none' },
      }}>
        {menuItems.map((item) => (
          <Tooltip
            title={isMinimal ? item.text : ""}
            placement="right"
            key={item.path}
            arrow
            disableHoverListener={!isMinimal}
          >
            <StyledListItem
              onClick={() => handleTabClick(item.path)}
              active={activeTab === item.path ? 1 : 0}
              sx={{
                justifyContent: isMinimal ? 'center' : 'flex-start',
                px: isMinimal ? 2 : 2,
                cursor: 'pointer'
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: isMinimal ? '24px' : '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: activeTab === item.path ? '#ffffff' : '#666666',
                  mr: isMinimal ? 0 : 2,
                }}
              >
                {getIconComponent(item.icon)}
              </ListItemIcon>
              {!isMinimal && (
                <ListItemText
                  primary={item.text}
                  sx={{
                    '& .MuiListItemText-primary': {
                      fontSize: '15px',
                      fontWeight: activeTab === item.path ? 500 : 400,
                      color: activeTab === item.path ? '#ffffff' : '#666666',
                      lineHeight: '18.15px',
                    },
                  }}
                />
              )}
            </StyledListItem>
          </Tooltip>
        ))}
      </List>
    </>
  );

  return (
    <>
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: DRAWER_WIDTH,
            backgroundColor: '#ffffff',
            border: 'none',
            padding: '16px 0 16px 0',
            boxShadow: 3,
          },
        }}
      >
        {renderDrawerContent(false)}
      </Drawer>

      {/* Desktop Drawer */}
      <DesktopDrawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            width: drawerOpen ? DRAWER_WIDTH : MINI_DRAWER_WIDTH,
            boxShadow: 3,
          },
        }}
        open={drawerOpen}
      >
        {renderDrawerContent(!drawerOpen)}
      </DesktopDrawer>
    </>
  );
};

export default SideNavigation;