
import React from 'react'
import {
    Box,
    Typography,
    useTheme,
} from '@mui/material'
import benefit1 from '@/assets/images/beneifit1.png'
import benefit2 from '@/assets/images/benefit2.png'
import benefit3 from '@/assets/images/benefit3.png'
import benefit4 from '@/assets/images/benefit4.png'
import benefit5 from '@/assets/images/benefit5.png'
import { useTranslation } from 'react-i18next'


export default function KeyBenefits() {
    const { t } = useTranslation();
    const benefits = [
        {
            icon: benefit1,
            title: t('benefits.benefit1.title'),
            description: t('benefits.benefit1.description'),
        },
        {
            icon: benefit2,
            title: t('benefits.benefit2.title'),
            description: t('benefits.benefit2.description'),
        },
        {
            icon: benefit3,
            title: t('benefits.benefit3.title'),
            description: t('benefits.benefit3.description'),
        },
        {
            icon: benefit4,
            title: t('benefits.benefit4.title'),
            description: t('benefits.benefit4.description'),
        },
        {
            icon: benefit5,
            title: t('benefits.benefit5.title'),
            description: t('benefits.benefit5.description'),
        },
    ]

    const theme = useTheme()

    return (
        <Box
            sx={{
                background: 'linear-gradient(90deg, rgba(69,223,255,0.15) 0%, rgba(15,146,249,0.25) 50%, rgba(71,224,255,0.15) 100%)',
                py: 5,
            }}
        >
            <Box sx={{ mx: { xs: 2, sm: 6, md: 12 } }}>
                <Typography
                    component="h2"
                    align="center"
                    gutterBottom
                    sx={{
                        mb: 6,
                        fontWeight: 600,
                        lineHeight: { xs: '48px', md: '57.6px' },
                        fontSize: { xs: '40px', md: '48px' }
                    }}
                >
                    {t('benefits.benefits')}
                </Typography>

                <Box
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 4,
                        width:'100%'
                    }}
                >
                    {benefits.map((benefit, index) => (
                        <Box
                            key={index}
                            sx={{
                                width:{lg:'28%'},
                                p: 3,
                                borderRadius: 2,
                                transition: 'all 0.2s ease-in-out',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: theme.shadows[4],
                                },
                            }}
                        >
                            <Box
                                sx={{
                                    width: '100px',
                                    height: '100px',
                                    borderRadius: 2,
                                    backgroundColor: 'transparent',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mb: 2,
                                }}
                            >
                                <img
                                    src={benefit.icon}
                                    alt={benefit.title}
                                    style={{
                                        objectFit: 'contain',
                                        width: '100%',
                                        height: '100%',
                                    }}
                                />
                            </Box>

                            <Typography
                                variant="h6"
                                sx={{
                                    mb: 2,
                                    fontWeight: 700,
                                    fontSize: { xs: '20px', md: '24px' }
                                }}
                            >
                                {benefit.title}
                            </Typography>

                            <Typography
                                variant="body1"
                                color="text.secondary"
                                sx={{
                                    lineHeight: '28.8px',
                                    fontWeight: 400,
                                    fontSize: { xs: '16px', md: '18px' }
                                }}
                            >
                                {benefit.description}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </Box>
        </Box>
    )
}

