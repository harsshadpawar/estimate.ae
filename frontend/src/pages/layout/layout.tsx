import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { getMenuItemsByRole } from "../menus/menuItems";
// Import components
import { Root } from "@/components/layout/styles";
import AppHeader from "@/components/layout/AppHeader";
import SideNavigation from "@/components/layout/SideNavigation";
import MainContentArea from "@/components/layout/MainContentArea";
import { RootState } from "@/redux/store/store";
import { useSelector } from "react-redux";

// Constants
export const DRAWER_WIDTH = 280;
export const MINI_DRAWER_WIDTH = 72;

const Layout = () => {
    const role = useSelector((state: RootState) => state?.auth?.role);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const navigate = useNavigate();
    const location = useLocation();

    const [drawerOpen, setDrawerOpen] = useState(true);
    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
    const [activeTab, setActiveTab] = useState(location.pathname);
    const [userRole, setUserRole] = useState('');

    // Initialize role and active tab
    useEffect(() => {
        if (role) {
            setUserRole(role);
        }

        // Handle special routing case
        if (location.pathname === '/dashboard1') {
            setActiveTab('/dashboard');
        } else {
            setActiveTab(location.pathname);
        }
    }, [role, location.pathname]);

    // Handle screen size changes
    useEffect(() => {
        if (isMobile) {
            setDrawerOpen(false);
        } else {
            setDrawerOpen(true);
            setMobileDrawerOpen(false); // Close mobile drawer when switching to desktop
        }
    }, [isMobile]);

    const handleTabClick = (path: string) => {
        setActiveTab(path);
        navigate(path);
        if (isMobile) {
            setMobileDrawerOpen(false);
        }
    };

    const toggleDrawer = () => {
        if (isMobile) {
            setMobileDrawerOpen(!mobileDrawerOpen);
        } else {
            setDrawerOpen(!drawerOpen);
        }
    };

    const handleHome = () => {
        navigate('/');
    };

    // Get menu items based on user role
    const menuItems = getMenuItemsByRole(userRole);

    return (
        <Root>
            <AppHeader
                drawerOpen={drawerOpen}
                toggleDrawer={toggleDrawer}
            />

            <SideNavigation
                isMobile={isMobile}
                drawerOpen={drawerOpen}
                mobileDrawerOpen={mobileDrawerOpen}
                setMobileDrawerOpen={setMobileDrawerOpen}
                activeTab={activeTab}
                handleTabClick={handleTabClick}
                handleHome={handleHome}
                menuItems={menuItems}
            />

            <MainContentArea
                open={drawerOpen}
                isMobile={isMobile}
            >
                <Outlet />
            </MainContentArea>
        </Root>
    );
};

export default Layout;