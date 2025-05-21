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
                pb: 17,
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
                    {/* <Box
                        component="img"
                        src={dash}
                        alt="Logo"
                        sx={{
                            mt: -3,
                            width: { md: '600px', lg: '720px', xl: '850px' },
                        }}
                    /> */}
                    <Box
                        sx={{
                            width: '100%',
                            maxWidth: { xs: '100%', sm: '560px', md: '720px', lg: '960px' },
                            height: { xs: '240px', sm: '315px', md: '405px', lg: '380px',xl:'450px' },
                            position: 'relative',
                            overflow: 'hidden',
                            borderRadius: '12px',
                        }}
                    >
                        <iframe
                            width="100%"
                            height="100%"
                            src="https://www.youtube.com/embed/4J4MWseH-oY"
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </Box>
                    {/* </Grid> */}
                </Box>
            </Box>
        </Box >
    )
}

