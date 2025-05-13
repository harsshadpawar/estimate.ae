import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { styled, alpha } from '@mui/material/styles';

import { CiMenuFries } from "react-icons/ci";
import {
    AppBar,
    Toolbar,
    Typography,
    InputBase,
    IconButton,
    Badge,
    Avatar,
    Menu,
    MenuItem,
    Box,
} from "@mui/material";
import {
    Search as SearchIcon,
    Mail as MailIcon,
    Notifications as NotificationsIcon,
    Menu as MenuIcon,
} from "@mui/icons-material";
import apiClient from "../../services/interceptor";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile, logout } from "../../redux/features/authSlice";

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.95),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 1),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    maxWidth: '400px',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: alpha(theme.palette.common.black, 0.4),
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    width: '100%',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        width: '100%',
    },
}));

const StyledAppBar = styled(AppBar)(({ theme }) => ({
    backgroundColor: '#F8F9FF',
    boxShadow: 'none',
    // borderBottom: '1px solid',
    borderColor: alpha(theme.palette.divider, 0.1),
}));

const TopBar = ({ handleDrawerToggle }: { handleDrawerToggle: () => void }) => {
    const location = useLocation();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const dispatch = useDispatch();

    const user = useSelector((state: any) => state.auth.userProfileData);

    useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

    // Map paths to page titles
    const pageTitles = {
        "/dashboard": "Dashboard",
        "/user-configuration": "User Configuration",
        "/account-page": "Account Page",
    };

    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleDrawerToggle()
    };

    const handleLogout = async () => {
        // Perform logout action
        // Redirect to login page
        dispatch(logout())
        setAnchorEl(null);
    };

    return (
        <StyledAppBar position="static" sx={{ my: 2 }}>
            <Toolbar>
                <IconButton
                    onClick={handleDrawerToggle}
                    // size="large"
                    // edge="start"
                    color="inherit"
                    aria-label="open drawer"
                    sx={{ color: 'text.primary', display: { xs: 'flex', sm: 'flex', md: 'none' } }}
                >
                    <CiMenuFries onClick={() => handleMenuClose()} />
                </IconButton>

                <Typography
                    // variant="h6"
                    noWrap
                    component="div"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        color: 'text.primary',
                        fontWeight: 600,
                        fontSize: { xs: '24px', sm: '26px', md: '28px' },
                        lineHeight: '33.89px',
                        marginLeft: '20px',

                    }}
                >
                    {pageTitles[location.pathname] || "Dashboard"}
                </Typography>

                <Search
                    sx={{
                        borderRadius: '10px',
                        overflow: 'hidden',
                        border: '1px solid #ccc',
                        backgroundColor: '#f8f8f8', // Optional: Background color
                    }}
                >
                    <SearchIconWrapper>
                        <SearchIcon sx={{ height: '16px', width: '16px', color: '#888' }} /> {/* Custom icon color */}
                    </SearchIconWrapper>
                    <StyledInputBase
                        placeholder="Search…"
                        inputProps={{ 'aria-label': 'search' }}
                        sx={{
                            color: '#333', // Input text color
                            '::placeholder': {
                                color: '#000', // Placeholder color
                                opacity: 1, // Ensure visibility of placeholder
                            },
                        }}
                    />
                </Search>


                <Box sx={{ flexGrow: 1 }} />

                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {/* Mail Icon with Badge */}
                    {/* <Box
                        sx={{
                            backgroundColor: "#FFFF",
                            borderRadius: "12px",
                            display: { xs: 'none', sm: 'flex', md: 'flex' }
                        }}
                    >
                        <IconButton aria-label="show 4 new mails">
                            <Badge
                                variant="dot"
                                color="warning"
                                sx={{
                                    "& .MuiBadge-dot": {
                                        top: "5px",
                                        right: "5px",
                                    },
                                }}
                            >
                                <MailIcon sx={{ color: "#000" }} />
                            </Badge>
                        </IconButton>
                    </Box> */}

                    {/* Notifications Icon with Badge */}
                    {/* <Box
                        sx={{
                            backgroundColor: "#FFFF",
                            borderRadius: "12px",
                            display: { xs: 'none', sm: 'flex', md: 'flex' }
                        }}
                    >
                        <IconButton aria-label="show 17 new notifications">
                            <Badge
                                variant="dot"
                                color="warning"
                                sx={{
                                    "& .MuiBadge-dot": {
                                        top: "5px",
                                        right: "5px",
                                    },
                                }}
                            >
                                <NotificationsIcon sx={{ color: "#000" }} />
                            </Badge>
                        </IconButton>
                    </Box> */}

                    {/* Profile Section */}
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
                            // size="large"
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
                        <Typography sx={{ fontSize: { xs: '14px', sm: '14px', md: '14px' }, fontWeight: 500, color: "#000", marginLeft: '10px' }}>
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

