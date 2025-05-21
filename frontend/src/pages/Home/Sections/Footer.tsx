
import { Box, Container, IconButton, Link, Typography } from '@mui/material'
import React from 'react'
import footer from '@/assets/images/footer.png'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import TwitterIcon from '@mui/icons-material/Twitter'
import FacebookIcon from '@mui/icons-material/Facebook'
import InstagramIcon from '@mui/icons-material/Instagram'
import mainlogo from '@/assets/images/mainlogo.png'
import { useTranslation } from 'react-i18next'
function Footer() {
    const { t } = useTranslation();
    return (
        <Box id="CONTACT US"
            sx={{
                backgroundImage: `url(${footer})`,
                backgroundSize: 'cover',
                color: '#fff',
                m: 'auto'
            }}
        >
            <Box sx={{ mx: '100px', pt: { xs: 0, sm: 20, md: 30 } }}>
                <Box
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 4,
                        justifyContent: 'space-between',
                    }}
                >
                    {/* Logo and Description Column */}
                    <Box >
                        <Box sx={{ mb: 2 }}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    width: { md: '200px', lg: '265px' },
                                    height: { md: '60px', lg: '71.55px' },
                                }}
                            >
                                <Box
                                    component="img"
                                    src={mainlogo}
                                    alt="Logo"
                                    sx={{
                                        height: '100%',
                                        mt: { xs: 20, sm: 2, md: 0 }
                                    }}
                                />
                            </Box>
                        </Box>
                        <Typography variant="body2" sx={{ mb: 3,width:'300px' }}>
                           {t('footer.text')}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            {[LinkedInIcon, TwitterIcon, FacebookIcon, InstagramIcon].map((Icon, i) => (
                                <IconButton
                                    key={i}
                                    sx={{
                                        color: 'white',
                                        border: '1px solid white',
                                        '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                                    }}
                                    size="small"
                                >
                                    <Icon />
                                </IconButton>
                            ))}
                        </Box>
                    </Box>
                    {/* Useful Links */}
                    <Box >
                        <Typography variant="h6" sx={{ mb: 1, fontSize: '18px', fontWeight: '700' }}>
                            {t('footer.usefullinks')}
                        </Typography>
                        <Box sx={{ backgroundColor: '#15D7FF', width: '50px', height: '4px', mb: 3 }}></Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Link href="#" color="inherit" underline="hover">{t('footer.aboutus')}</Link>
                            <Link href="#" color="inherit" underline="hover">{t('footer.contactus')}</Link>
                            <Link href="#" color="inherit" underline="hover">{t('footer.faq')}</Link>
                        </Box>
                    </Box>
                    {/* Help & Support */}
                    <Box >
                        <Typography variant="h6" sx={{ mb: 1, fontSize: '18px', fontWeight: '700' }}>
                            {t('footer.helpandsuppport')}
                        </Typography>
                        <Box sx={{ backgroundColor: '#15D7FF', width: '50px', height: '4px', mb: 3 }}></Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Link href="#" color="inherit" underline="hover">{t('footer.privacy')}</Link>
                            <Link href="#" color="inherit" underline="hover">{t('footer.terms')}</Link>
                        </Box>
                    </Box>
                    {/* Contact Info */}
                    <Box >
                        <Typography variant="h6" sx={{ mb: 1, fontSize: '18px', fontWeight: '700' }}>
                            {t('footer.touch')}
                        </Typography>
                        <Box sx={{ backgroundColor: '#15D7FF', width: '50px', height: '4px', mb: 3 }}></Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Typography variant="body2">
                                {t("footer.email")}: <Link href="mailto:info@gmail.com" color="#15D7FF" fontWeight="700" underline="hover">info@estimate.ae</Link>
                            </Typography>

                            <Typography variant="body2">{t("footer.phone")}: +97145706345</Typography>

                        </Box>
                    </Box>
                </Box>

                {/* Footer Bottom */}
                <Typography variant="body2" sx={{ mt: 4, textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', pt: 2 }}>
                    {t('footer.rights')}
                </Typography>
            </Box>
        </Box>
    )
}

export default Footer
