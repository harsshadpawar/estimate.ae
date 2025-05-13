import React, { useContext, useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { styled, useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  AppBar,
  Toolbar,
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
import { AuthContext } from "../context/AuthContext";
import LOGO from '../assets/images/Group 11.png';
import Logoo from '../assets/images/Logoo.png';
import TopBar from "../components/TopBar";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store/store";

const INITIAL_DRAWER_WIDTH = 280;

const Root = styled(Box)({
  display: 'flex',
  height: '100%',
  overflow: 'hidden',
  overflowY: 'auto'
});

const SidebarDrawer = styled(Drawer)(({ theme, width }) => ({
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    boxSizing: 'border-box',
    backgroundColor: '#ffffff',
    border: 'none',
    padding: width === INITIAL_DRAWER_WIDTH ? '16px 16px 16px 0px' : 0,
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
}));

const LogoContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '24px 16px',
  marginBottom: '24px',
});

const StyledListItem = styled(ListItem)({
  borderRadius: '16px',
  marginBottom: '8px',
  padding: '12px 16px',
  '&:hover': {
    backgroundColor: 'rgba(5, 145, 252, 0.08)',
  },
  '&.Mui-selected': {
    backgroundColor: '#0591FC',
    '&:hover': {
      backgroundColor: '#0591FC',
    },
  },
});

const MainContent = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  backgroundColor: '#f9f9f9',
  paddingTop: theme.spacing(8),
}));

const ContentArea = styled(Box)({});

const StyledLogoButton = styled(IconButton)(({ theme, width }) => ({
  position: "fixed",
  top: theme.spacing(3),
  left: width,
  zIndex: 1301,
  backgroundColor: "#fff",
  border: "1px solid #d1d5db",
  borderTopRightRadius: "9999px",
  borderBottomRightRadius: "9999px",
  padding: theme.spacing(1),
  boxShadow: theme.shadows[2],
  "&:hover": {
    color: "#374151",
  },
  color: "#6b7280",
}));

const StyledLogo = styled("img")(({ theme }) => ({
  height: 24,
  width: 24,
  margin: "0 8px",
  "@keyframes spin": {
    "0%": { transform: "rotate(0deg)" },
    "100%": { transform: "rotate(360deg)" },
  },
}));


const Layout = () => {
  const role = useSelector((state: RootState) => state?.auth?.role);


  const theme = useTheme();
  const [drawerWidth, setDrawerWidth] = useState(INITIAL_DRAWER_WIDTH);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  // const authContext = useContext(AuthContext);
  // const [role, setRole] = useState();
  const [activeTab, setActiveTab] = useState(location.pathname);
  const [mobileOpen, setMobileOpen] = useState(false);

  
  useEffect(() => {
    // Whenever screen size changes, reset drawer to default for that screen size
    setDrawerWidth(isMobile ? INITIAL_DRAWER_WIDTH : INITIAL_DRAWER_WIDTH);
  }, [isMobile]);
  useEffect(() => {
    if ('/dashboard1' === location.pathname) {
      setActiveTab('/dashboard');
    }
  }, [location.pathname]);

  const handleTabClick = (path) => {
    setActiveTab(path);
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleHome = () => {
    navigate('/');
  };

  const handleLogoClick = () => {
    setDrawerWidth(prevWidth => prevWidth === 0 ? INITIAL_DRAWER_WIDTH : 0);
  };


  // let menuItems = (role === 'customer' || role === 'user') 
  let menuItems = (true) 
    ? [
      {
        text: "Calculate Models Estimation",
        icon: <HomeIcon />,
        path: "/dashboard"
      },
      {
        text: "User Level Configuration Settings",
        icon: <SettingsIcon />,
        path: "/user-configuration"
      },
    ]
    : [
      {
        text: "Admin Dashboard",
        icon: <DashboardIcon />,
        path: "/admin/admin-dashboard"
      },
      {
        text: "User Management",
        icon: <ManageAccountsIcon />,
        path: "/admin/user-managemnet"
      },
      {
        text: "Report and Analytics",
        icon: <AnalyticsIcon />,
        path: "/admin/reports-analytics"
      },
      {
        text: "Customer Transactions",
        icon: <MonetizationOnIcon />,
        path: "/admin/customer-transactions"
      },
      {
        text: "Configuration and Setting",
        icon: <TuneIcon />,
        path: "/admin/configuration-setting"
      },
      {
        text: "Notifications",
        icon: <NotificationsActiveIcon />,
        path: "/admin/notifications"
      },
      {
        text: "Subscription Management",
        icon: <SubscriptionsIcon />,
        path: "/admin/subscription-management"
      },
    ];

  const drawer = (
    <>
      <StyledLogoButton width={drawerWidth} onClick={handleLogoClick} >
        <StyledLogo
          src={Logoo}
          alt="logo"
          style={{
            animation: drawerWidth !== INITIAL_DRAWER_WIDTH ? "spin 2s linear infinite" : "none",
          }
          }
        />
      </StyledLogoButton>


      < LogoContainer onClick={handleHome} sx={{ position: 'sticky' }}>
        <Box sx={
          {
            paddingLeft: '16px',
            img: {
              height: { xs: '40px', sm: '45px', md: '50px' },
              width: { xs: '100%', sm: '100%', md: '100%' }
            }
          }
        }>
          <img src={LOGO} alt="404" />
        </Box>
      </LogoContainer>

      < List sx={{
        padding: 0,
        overflowY: 'scroll',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        '&::-webkit-scrollbar': { display: 'none' },
      }}>
        {
          menuItems.map((item) => (
            <StyledListItem
              key={item.path}
              onClick={() => handleTabClick(item.path)}
              selected={activeTab === item.path}
              sx={{
                backgroundColor: activeTab === item.path ? '#0591FC' : '#ffffff',
                borderRadius: '0 16px 16px 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                height: '75px'
              }}
            >
              <ListItemIcon
                sx={
                  {
                    minWidth: '14.74px',
                    height: '16.89px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    color: activeTab === item.path ? '#ffffff' : '#666666',
                  }
                }
              >
                {item.icon}
              </ListItemIcon>
              < ListItemText
                primary={item.text}
                sx={{
                  '& .MuiListItemText-primary': {
                    fontSize: '15px',
                    fontWeight: activeTab === item.path ? 500 : 400,
                    color: activeTab === item.path ? '#ffffff' : '#666666',
                    lineHeight: '18.15px'
                  },
                }}
              />
            </StyledListItem>
          ))}
      </List>
    </>
  );

  return (
    <Root>
    <AppBar
      position="fixed"
      sx={{
        width: { md: `calc(100% - ${drawerWidth}px)` },
        ml: { md: `${drawerWidth}px` },
        bgcolor: '#F8F9FF',
        boxShadow: 'none',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Toolbar>
        <TopBar handleDrawerToggle={handleDrawerToggle} />
      </Toolbar>
    </AppBar>
  
    <Box
      component="nav"
      sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      aria-label="mailbox folders"
    >
      {isMobile ? (
        <SidebarDrawer
          width={drawerWidth}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { width: drawerWidth },
          }}
        >
          {drawer}
        </SidebarDrawer>
      ) : (
        <SidebarDrawer
          width={drawerWidth}
          variant="permanent"
          open
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { width: drawerWidth },
          }}
        >
          {drawer}
        </SidebarDrawer>
      )}
    </Box>
  
    <MainContent>
      <ContentArea>
        <Outlet />
      </ContentArea>
    </MainContent>
  </Root>
  
  );
};

export default Layout;


// // import React from 'react'

// // function sidebarLayout() {
// //   return (
// //     <div>sidebarLayout</div>
// //   )
// // }

// // export default sidebarLayout



// import { useState } from "react";
// import { Outlet, useLocation, useNavigate } from "react-router-dom";
// import { Drawer, List, ListItem, ListItemIcon, ListItemText, AppBar, Toolbar, Typography, IconButton, Box, styled } from "@mui/material";
// import { useSelector } from "react-redux";
// import { RootState } from "../redux/store/store"; 

// import HomeIcon from "@mui/icons-material/Home";
// import DashboardIcon from "@mui/icons-material/Dashboard";
// import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
// import AnalyticsIcon from "@mui/icons-material/Analytics";
// import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
// import TuneIcon from "@mui/icons-material/Tune";
// import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
// import SubscriptionsIcon from "@mui/icons-material/Subscriptions";
// import MenuIcon from "@mui/icons-material/Menu";

// const drawerWidth = 240;
// const INITIAL_DRAWER_WIDTH = 280;

// const Root = styled(Box)({
//   display: 'flex',
//   height: '100%',
//   overflow: 'hidden',
//   overflowY: 'auto'
// });

// const SidebarDrawer = styled(Drawer)(({ theme, width }) => ({
//   flexShrink: 0,
//   '& .MuiDrawer-paper': {
//     boxSizing: 'border-box',
//     backgroundColor: '#ffffff',
//     border: 'none',
//     padding: width === INITIAL_DRAWER_WIDTH ? '16px 16px 16px 0px' : 0,
//     [theme.breakpoints.down('md')]: {
//       width: '100%',
//     },
//   },
// }));

// const LogoContainer = styled(Box)({
//   display: 'flex',
//   alignItems: 'center',
//   gap: '12px',
//   padding: '24px 16px',
//   marginBottom: '24px',
// });

// const StyledListItem = styled(ListItem)({
//   borderRadius: '16px',
//   marginBottom: '8px',
//   padding: '12px 16px',
//   '&:hover': {
//     backgroundColor: 'rgba(5, 145, 252, 0.08)',
//   },
//   '&.Mui-selected': {
//     backgroundColor: '#0591FC',
//     '&:hover': {
//       backgroundColor: '#0591FC',
//     },
//   },
// });

// const MainContent = styled(Box)(({ theme }) => ({
//   flexGrow: 1,
//   backgroundColor: '#f9f9f9',
//   paddingTop: theme.spacing(8),
// }));

// const ContentArea = styled(Box)({});

// const StyledLogoButton = styled(IconButton)(({ theme, width }) => ({
//   position: "fixed",
//   top: theme.spacing(3),
//   left: width,
//   zIndex: 1301,
//   backgroundColor: "#fff",
//   border: "1px solid #d1d5db",
//   borderTopRightRadius: "9999px",
//   borderBottomRightRadius: "9999px",
//   padding: theme.spacing(1),
//   boxShadow: theme.shadows[2],
//   "&:hover": {
//     color: "#374151",
//   },
//   color: "#6b7280",
// }));

// const StyledLogo = styled("img")(({ theme }) => ({
//   height: 24,
//   width: 24,
//   margin: "0 8px",
//   "@keyframes spin": {
//     "0%": { transform: "rotate(0deg)" },
//     "100%": { transform: "rotate(360deg)" },
//   },
// }));
// const Layout = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const role = useSelector((state: RootState) => state.auth.role);

//   const [mobileOpen, setMobileOpen] = useState(false);
//   const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

//   const menuItems = role === "user"
//     ? [
//         { text: "Calculate Models Estimation", icon: <HomeIcon />, path: "/dashboard" },
//         { text: "User Level Configuration Settings", icon: <TuneIcon />, path: "/user-configuration" },
//       ]
//     : [
//         { text: "Admin Dashboard", icon: <DashboardIcon />, path: "/admin/admin-dashboard" },
//         { text: "User Management", icon: <ManageAccountsIcon />, path: "/admin/user-managemnet" },
//         { text: "Report and Analytics", icon: <AnalyticsIcon />, path: "/admin/reports-analytics" },
//         { text: "Customer Transactions", icon: <MonetizationOnIcon />, path: "/admin/customer-transactions" },
//         { text: "Configuration and Setting", icon: <TuneIcon />, path: "/admin/configuration-setting" },
//         { text: "Notifications", icon: <NotificationsActiveIcon />, path: "/admin/notifications" },
//         { text: "Subscription Management", icon: <SubscriptionsIcon />, path: "/admin/subscription-management" },
//       ];

//   const drawer = (
//     <div>
//       <Toolbar />
//       <List>
//         {menuItems.map((item) => (
//           <ListItem
//             button
//             key={item.text}
//             onClick={() => navigate(item.path)}
//             selected={location.pathname === item.path}
//           >
//             <ListItemIcon>{item.icon}</ListItemIcon>
//             <ListItemText primary={item.text} />
//           </ListItem>
//         ))}
//       </List>
//     </div>
//   );

//   return (
//     <Box sx={{ display: "flex" }}>
//       <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
//         <Toolbar>
//           <IconButton
//             color="inherit"
//             aria-label="open drawer"
//             edge="start"
//             onClick={handleDrawerToggle}
//             sx={{ mr: 2, display: { sm: "none" } }}
//           >
//             <MenuIcon />
//           </IconButton>
//           <Typography variant="h6" noWrap>
//             {role === "user" ? "User Dashboard" : "Admin Panel"}
//           </Typography>
//         </Toolbar>
//       </AppBar>

//       <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
//         <Drawer
//           variant="temporary"
//           open={mobileOpen}
//           onClose={handleDrawerToggle}
//           ModalProps={{ keepMounted: true }}
//           sx={{
//             display: { xs: "block", sm: "none" },
//             "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth }
//           }}
//         >
//           {drawer}
//         </Drawer>
//         <Drawer
//           variant="permanent"
//           sx={{
//             display: { xs: "none", sm: "block" },
//             "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth }
//           }}
//           open
//         >
//           {drawer}
//         </Drawer>
//       </Box>

//       <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
//         <Toolbar />
//         <Outlet />
//       </Box>
//     </Box>
//   );
// };

// export default Layout;
