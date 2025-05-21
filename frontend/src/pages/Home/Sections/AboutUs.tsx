import React from 'react'
import {
  Box,
  Button,
  Container,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import about from '@/assets/images/about.png'
import { useTranslation } from 'react-i18next';
function AboutUs() {
  const theme = useTheme()
  const { t } = useTranslation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <Box
      id="ABOUT US"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        pt: 0,
        pb: 8,
      }}
    >
      {/* Main Content */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Image Section */}
        <Box
          component="img"
          src={about}
          alt="About Us"
          sx={{
            width: { xs: '100%', md: '50%' },
            maxWidth: '100%',
          }}
        />

        {/* Text Section */}
        <Box
          sx={{
            width: { xs: '100%', md: '50%' },
            pl: { xs: 2, md: 4, lg: 10 },
            mt: { xs: 4, md: 0 },
          }}
        >
          <Typography
            color="primary"
            sx={{
              mb: 1,
              fontWeight: 700,
              fontSize: { xs: '14px', md: '16px' },
              lineHeight: '19.36px',
            }}
          >
            {t("about.about_welcome")}
          </Typography>
          <Typography
            variant="h3"
            sx={{
              mb: 3,
              fontWeight: 600,
              fontSize: { sm: '40px', md: '48px' },
            }}
          >
           {t("about.about_heading")}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              mb: 4,
              color: 'text.secondary',
              fontSize: { xs: '1rem', md: '18px' },
              lineHeight: '28px',
              fontWeight: 400,
            }}
          >
            {t("about.about_content")}
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default AboutUs
