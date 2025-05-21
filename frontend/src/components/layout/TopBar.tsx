import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { styled, alpha } from '@mui/material/styles';

import { CiMenuFries } from "react-icons/ci";
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Avatar,
    Menu,
    MenuItem,
    Box,
    useMediaQuery,
    useTheme
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile, logout } from "@/redux/features/authSlice";

const StyledAppBar = styled(AppBar)(({ theme }) => ({
    backgroundColor: '#F8F9FF',
    boxShadow: 'none',
    borderColor: alpha(theme.palette.divider, 0.1),
    width: '100%'
}));

const TopBar = ({ handleDrawerToggle }: { handleDrawerToggle: () => void }) => {
    const location = useLocation();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const dispatch = useDispatch();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const user = useSelector((state: any) => state.auth.userProfileData);

    useEffect(() => {
        dispatch(fetchUserProfile());
    }, [dispatch]);

    // Map paths to page titles
    const pageTitles: {[key: string]: string} = {
        "/dashboard": "Dashboard",
        "/user-configuration": "User Configuration",
        "/account-page": "Account Page",
    };

    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        dispatch(logout())
        setAnchorEl(null);
    };

    return (
        <StyledAppBar position="static" sx={{ my: 2 }}>
            <Toolbar sx={{ px: 4 }}>
                <IconButton
                    onClick={handleDrawerToggle}
                    color="inherit"
                    aria-label="toggle drawer"
                    edge="start"
                    sx={{ 
                        color: 'text.primary', 
                        mr: 2,
                    }}
                >
                    <CiMenuFries size={24} />
                </IconButton>

                <Typography
                    noWrap
                    component="div"
                    sx={{
                        color: 'text.primary',
                        fontWeight: 600,
                        fontSize: { xs: '20px', sm: '22px', md: '24px' },
                        lineHeight: '33.89px',
                    }}
                >
                    {pageTitles[location.pathname] || "Dashboard"}
                </Typography>

                <Box sx={{ flexGrow: 1 }} />

                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box
                        sx={{
                            backgroundColor: "#FFFF",
                            borderRadius: "16px",
                            display: "flex",
                            alignItems: "center",
                            p: 1,
                        }}
                    >
                        <IconButton
                            edge="end"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleProfileMenuOpen}
                            sx={{ p: 0 }}
                        >
                            <Avatar
                                alt={user?.first_name}
                                src="/placeholder.svg"
                                sx={{ width: 32, height: 32, mr: 1 }}
                            />
                        </IconButton>
                        <Typography sx={{ 
                            fontSize: { xs: '14px', sm: '14px', md: '14px' }, 
                            fontWeight: 500, 
                            color: "#000", 
                            marginLeft: '10px',
                            display: { xs: 'none', sm: 'block' }
                        }}>
                            {user?.first_name}
                        </Typography>
                    </Box>

                    {/* Profile Dropdown Menu */}
                    <Menu
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                    >
                        <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
                        <MenuItem onClick={handleMenuClose}>My account</MenuItem>
                        <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </StyledAppBar>
    );
};

export default TopBar;