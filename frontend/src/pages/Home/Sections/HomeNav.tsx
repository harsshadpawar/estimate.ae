'use client'

import React, { useState } from 'react'
import {
    AppBar,
    Toolbar,
    Box,
    Button,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemText,
    useMediaQuery,
    useTheme,
} from '@mui/material'
import { Menu as MenuIcon } from '@mui/icons-material'
// import Image from 'next/image'
import mainlogo from '@/assets/images/mainlogo.png'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LanguageDropdown from '@/components/languageDropdown'

const HomeNav: React.FC = () => {
    const { t, i18n } = useTranslation();
    const [mobileOpen, setMobileOpen] = useState(false)
    const navigate = useNavigate();
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen)
    }

    const navItems = [t('nav.home'), t('nav.about'), t('nav.faq'), t('nav.contact')];


    const handleNavigate = (page: any) => {
        navigate(`/${page}`)
    }

    const handleScroll = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center', p: 2 }}>
            <List>
                {navItems.map((item) => (
                    <ListItem key={item} button="true" onClick={() => handleScroll(item)} disablePadding>
                        <ListItemText primary={item} />
                    </ListItem>
                ))}
            </List>
            <Box
                sx={{
                    display: { sm: 'none' },
                    flexDirection: 'column',
                    gap: 2,
                    mt: 2,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Button
                    variant="outlined"
                    onClick={() => handleNavigate('register')}
                    sx={{
                        borderColor: '#FFFFFF',
                        // color: '#FFFFFF',
                        backgroundColor: '#15D7FF',
                        color: 'black',
                        fontWeight: 700,
                        fontSize: '14px',
                        borderRadius: '12px',
                        width: '80%',
                        mb: 2,
                        '&:hover': {
                            borderColor: '#FFFFFF',
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        },
                    }}
                >
                    SIGNUP
                </Button>
                <Button
                    variant="contained"
                    onClick={() => handleNavigate('login')}
                    sx={{
                        backgroundColor: '#15D7FF',
                        color: 'black',
                        fontSize: '14px',
                        fontWeight: 700,
                        borderRadius: '12px',
                        width: '80%',
                        '&:hover': {
                            backgroundColor: '#12B8E0',
                        },
                    }}
                >
                    LOGIN
                </Button>
            </Box>
        </Box>
    );


    return (
        <AppBar position="static" sx={{ backgroundColor: 'transparent', boxShadow: 'none',}}>
            <Toolbar
                sx={{
                    display: 'flex',
                    // width: '100%',
                    flex: 1,

                    justifyContent: 'space-between', // This ensures equal spacing
                    alignItems: 'center', // Aligns items vertically in the center
                    mt: 2,
                }}
            >
                {/* Logo Section */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        width: isMobile ? 'auto' : { md: '200px', lg: '265px' },
                        height: isMobile ? '50px' : { md: '60px', lg: '71.55px' },
                    }}
                >
                    <Box
                        component="img"
                        src={mainlogo}
                        alt="Logo"
                        sx={{
                            // width: '100%',
                            height: '100%',
                        }}
                    />
                </Box>

                {/* Navigation Links */}
                {!isMobile &&
                    <>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center', // Center navigation items
                                flex: 1, // Take up remaining space
                            }}
                        >
                            {navItems.map((item) => (
                                <Button
                                    key={item}
                                    sx={{
                                        color: 'white',
                                        fontWeight: 700,

                                        fontSize: '14px',
                                    }}
                                    onClick={() => handleScroll(`${item}`)}
                                >
                                    {item}
                                </Button>
                            ))}
                        </Box>

                    </>
                }
                {/* Buttons Section */}
                <Box
                    sx={{
                        display: 'flex',
                        gap: '10px',
                        height: { md: '40px', lg: '48px' },
                        width: { sm: '250px', md: '272px' },
                        
                    }}
                >
                    <LanguageDropdown />
                    <Button
                        variant="outlined"
                        onClick={() => handleNavigate('register')}
                        sx={{
                            borderColor: '#FFFFFF',
                            display: { xs: 'none', sm: 'flex' },
                            color: '#FFFFFF',
                            fontWeight: 700,
                            fontSize: '14px',
                            borderRadius: '12px',
                            '&:hover': {
                                borderColor: '#FFFFFF',
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            },
                            width: '130px',
                            // height: '48px',
                        }}
                    >
                        {t('nav.signup')}
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => handleNavigate('login')}
                        sx={{
                            backgroundColor: '#15D7FF',
                            color: 'black',
                            display: { xs: 'none', sm: 'flex' },
                            fontSize: '14px',
                            fontWeight: 700,
                            borderRadius: '12px',
                            '&:hover': {
                                backgroundColor: '#12B8E0',
                            },
                            width: '130px',
                            // height: '48px',
                        }}
                    >
                        {t('nav.login')}
                    </Button>
                    {isMobile && (
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2, display: { md: 'none' } }}
                        >
                            <MenuIcon />
                        </IconButton>
                    )}
                </Box>

            </Toolbar>

            {/* Mobile Drawer */}
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true, // Better open performance on mobile.
                }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
                }}
            >
                {drawer}
            </Drawer>
        </AppBar>
    )
}

export default HomeNav

