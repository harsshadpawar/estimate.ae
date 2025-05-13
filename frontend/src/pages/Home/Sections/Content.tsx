'use client'

import React from 'react'
import {
    Box,
    Button,
    Container,
    Grid,
    Typography,
    Paper,
    IconButton,
    useTheme,
    useMediaQuery,
} from '@mui/material'
import { Menu as MenuIcon, CloudUpload, Info } from '@mui/icons-material'
import dash from '../../../assets/images/dash.png'
import { useTranslation } from 'react-i18next'
export default function Content() {
    const { t } = useTranslation();
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))

    return (
        <Box
            sx={{
                position: 'relative',
                overflow: 'hidden',
                pt: 17,
                pb: 0,
                pl: 0,
            }}
        >

            {/* Main Content */}
            <Box>
                {/* <Grid container >
                    {/* Left Column - Text Content */}

                {/* <Grid item xs={12} md={5}>  */}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        justifyContent: 'space-between',
                        px: 2,
                    }}
                >
                    <Box sx={{ mb: 4 }}>
                        <Typography
                            // variant="h1"
                            sx={{
                                fontSize: { xs: '35px', md: '40px', lg: '48px' },
                                fontWeight: 700,
                                color: 'white',
                                lineHeight: 1.2,
                                mb: 10,
                            }}
                        >
                            {t("home.home_heading_line1")}{' '}
                            <span style={{ color: '#15D7FF' }}>
                                {t("home.home_heading_highlight")}
                            </span>
                            <span style={{ whiteSpace: 'nowrap' }}>
                                {t("home.home_heading_line2")}{' '}<br />
                            </span>
                            {t("home.home_heading_line3")}
                        </Typography>
                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor: '#15D7FF',
                                color: 'white',
                                display: { xs: 'none', sm: 'flex' },
                                fontSize: '18px',
                                fontWeight: 700,
                                borderRadius: '12px',
                                '&:hover': {
                                    backgroundColor: '#12B8E0',
                                },
                                width: '210px',
                                height: '64px',
                            }}
                        >
                           {t("home.get_started")}
                        </Button>
                    </Box>
                    {/* </Grid> */}

                    {/* Right Column - Dashboard Preview */}
                    {/* <Grid item xs={12} md={7} lg={5}> */}
                    <Box
                        component="img"
                        src={dash}
                        alt="Logo"
                        sx={{
                            mt: -3,
                            width: { md: '600px', lg: '720px', xl: '850px' },
                        }}
                    />
                    {/* </Grid> */}
                </Box>
            </Box>
        </Box >
    )
}

