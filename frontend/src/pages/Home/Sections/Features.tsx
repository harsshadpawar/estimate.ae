import { Box, Container, Typography } from '@mui/material'
import React from 'react'
import amico1 from '../../../assets/images/amico1.png'
import amico2 from '../../../assets/images/amico2.png'
import amico3 from '../../../assets/images/amico3.png'
import amico4 from '../../../assets/images/amico4.png'

import { useTranslation } from 'react-i18next'
function Features() {
    const { t } = useTranslation();
    return (
        <Container sx={{ mt: 5 }}>
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
                {t("features.features")}
            </Typography>

            {/* Section 1 */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: 'center',
                    gap: 4,
                    mb: 8,
                }}
            >
                <Box sx={{ flex: 1 }}>
                    <Typography
                        component="h2"
                        gutterBottom
                        sx={{
                            mb: 4,
                            fontWeight: 700,
                            lineHeight: { xs: '44px', md: '56px' },
                            fontSize: { xs: '30px', md: '38px' },
                            color: '#000',
                        }}
                    >
                        {t("features.Comprehensive")} <span style={{ color: '#0591FC' }}>{t("features.machinesetup")}</span> {t("features.Reports")}
                    </Typography>
                    <Typography
                        component="p"
                        sx={{
                            mb: 4,
                            fontWeight: 400,
                            lineHeight: { xs: '24px', md: '28px' },
                            fontSize: { xs: '14px', md: '16px' },
                            color: '#555555',
                        }}
                    >
                        {t("features.content")}
                    </Typography>
                </Box>
                <Box sx={{ flex: 1, textAlign: 'center' }}>
                    <Box
                        component="img"
                        src={amico1}
                        alt="Machine Setup Illustration"
                        sx={{
                            maxWidth: '100%',
                            height: 'auto',
                        }}
                    />
                </Box>
            </Box>

            {/* Section 2 */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column-reverse', md: 'row' },
                    alignItems: 'center',
                    gap: 4,
                    mb: 8,
                }}
            >
                <Box sx={{ flex: 1, textAlign: 'center' }}>
                    <Box
                        component="img"
                        src={amico2}
                        alt="AI-Driven Insights"
                        sx={{
                            maxWidth: '100%',
                            height: 'auto',
                        }}
                    />
                </Box>
                <Box sx={{ flex: 1 }}>
                    <Typography
                        component="h2"
                        gutterBottom
                        sx={{
                            mb: 4,
                            fontWeight: 700,
                            lineHeight: { xs: '44px', md: '56px' },
                            fontSize: { xs: '30px', md: '38px' },
                            color: '#000',
                        }}
                    >
                        {t("features.content1")} <span style={{ color: '#0591FC' }}>{t("features.content2")}</span> {t("features.fortoolpath")}
                    </Typography>
                    <Typography
                        component="p"
                        sx={{
                            mb: 4,
                            fontWeight: 400,
                            lineHeight: { xs: '24px', md: '28px' },
                            fontSize: { xs: '14px', md: '16px' },
                            color: '#555555',
                        }}
                    >
                        {t("features.content3")}
                    </Typography>
                </Box>
            </Box>

            {/* Section 3 */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: 'center',
                    gap: 4,
                    mb: 8,
                }}
            >
                <Box sx={{ flex: 1 }}>
                    <Typography
                        component="h2"
                        gutterBottom
                        sx={{
                            mb: 4,
                            fontWeight: 700,
                            lineHeight: { xs: '44px', md: '56px' },
                            fontSize: { xs: '30px', md: '38px' },
                            color: '#000',
                        }}
                    >
                        <span style={{ color: '#0591FC' }}>{t("features.content4")}</span> {t("features.content5")}
                    </Typography>
                    <Typography
                        component="p"
                        sx={{
                            mb: 4,
                            fontWeight: 400,
                            lineHeight: { xs: '24px', md: '28px' },
                            fontSize: { xs: '14px', md: '16px' },
                            color: '#555555',
                        }}
                    >
                        {t("features.content6")}
                    </Typography>
                </Box>
                <Box sx={{ flex: 1, textAlign: 'center' }}>
                    <Box
                        component="img"
                        src={amico3}
                        alt="User-Friendly UI"
                        sx={{
                            maxWidth: '100%',
                            height: 'auto',
                        }}
                    />
                </Box>
            </Box>

            {/* Section 4 */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column-reverse', md: 'row' },
                    alignItems: 'center',
                    gap: 4,
                }}
            >
                <Box sx={{ flex: 1, textAlign: 'center' }}>
                    <Box
                        component="img"
                        src={amico4}
                        alt="Process Optimization"
                        sx={{
                            maxWidth: '100%',
                            height: 'auto',
                        }}
                    />
                </Box>
                <Box sx={{ flex: 1 }}>
                    <Typography
                        component="h2"
                        gutterBottom
                        sx={{
                            mb: 4,
                            fontWeight: 700,
                            lineHeight: { xs: '44px', md: '56px' },
                            fontSize: { xs: '30px', md: '38px' },
                            color: '#000',
                        }}
                    >
                        <span style={{ color: '#0591FC' }}>{t("features.content7")}</span> {t("features.content8")}
                    </Typography>
                    <Typography
                        component="p"
                        sx={{
                            mb: 4,
                            fontWeight: 400,
                            lineHeight: { xs: '24px', md: '28px' },
                            fontSize: { xs: '14px', md: '16px' },
                            color: '#555555',
                        }}
                    >
                        {t("features.content9")}
                    </Typography>
                </Box>
            </Box>
        </Container>
    )
}

export default Features