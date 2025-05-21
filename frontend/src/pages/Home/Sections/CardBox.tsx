
import { Box, Button, Typography } from '@mui/material';
import React from 'react';
import mask from '@/assets/images/cardmask.png';
import cardboximg from '@/assets/images/cardboximg.png';
import { useNavigate } from 'react-router-dom';
  import { useTranslation } from 'react-i18next';


function CardBox() {
    const navigate = useNavigate();
    const handleNavigate = (page: any) => {
        navigate(`/${page}`);
    };
  const { t } = useTranslation();
    return (
        <Box
            id="centered-box"
            sx={{
                backgroundImage: `url(${mask})`,
                backgroundSize: 'cover',
                background: 'linear-gradient(to right,#246EC9 , #06A9F2 )',
                borderRadius: '15px',
            }}
        >
            <Box sx={{ padding: { xs: 5, sm: 9 } }}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        gap: 8,
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    {/* Left Content */}
                    <Box sx={{ flex: 1}}>
                        <Typography
                            gutterBottom
                            sx={{
                                mb: 4,
                                fontWeight: 700,
                                lineHeight: { xs: '40px', md: '46px' },
                                fontSize: { xs: '30px', md: '36px' },
                                color: '#ffff',
                            }}
                        >
                             {t('cardbox.title')}
                        </Typography>
                        <Typography
                            sx={{
                                mb: 4,
                                fontWeight: 400,
                                lineHeight: { xs: '24px', md: '28px' },
                                fontSize: { xs: '14px', md: '18px' },
                                color: '#fff',
                            }}
                        >
                            {t('cardbox.description')}
                        </Typography>
                        <Box
                            sx={{
                                display: 'flex',
                                gap: '10px',
                                height: { md: '40px', lg: '48px' },
                            }}
                        >
                            <Button
                                variant="contained"
                                sx={{
                                    backgroundColor: '#15D7FF',
                                    color: '#fff',
                                    display: { xs: 'none', sm: 'flex' },
                                    fontSize: '14px',
                                    fontWeight: 700,
                                    borderRadius: '12px',
                                    '&:hover': {
                                        backgroundColor: '#12B8E0',
                                    },
                                }}
                            >
                                {t('cardbox.contact')}
                            </Button>
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
                                }}
                            >
                                {t('cardbox.register')}
                            </Button>
                        </Box>
                    </Box>

                    {/* Right Image */}
                    {/* <Box
                        sx={{
                            flex: 1,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    > */}
                        <Box
                            component="img"
                            src={cardboximg}
                            alt="Machine Setup Illustration"
                            sx={{
                                Width: '100%',
                                height: 'auto',
                            }}
                        />
                    {/* </Box> */}
                </Box>
            </Box>
        </Box>
    );
}

export default CardBox;
