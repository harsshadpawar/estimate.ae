import React, { useEffect } from 'react';
import { Box, Container } from '@mui/material';
import mask from '@/assets/images/home_banner.jpg';
import HomeNav from './Sections/homeNav';
import Content from './Sections/content';
import AboutUs from './Sections/aboutUs';
import KeyBenefits from './Sections/keyBenifeits';
import Features from './Sections/features';
import CardBox from './Sections/cardBox';
import Footer from './Sections/footer';
import TestimonialsCarousel from './Sections/testimonials';
import FAQSection from './Sections/faqs';
import { useTranslation } from 'react-i18next';

function Index() {
    const { t } = useTranslation();
    useEffect(() => {
        particlesJS("particles-container", {
            particles: {
                number: { value: 150, density: { enable: true, value_area: 800 } },
                color: { value: "#ffffff" },
                shape: {
                    type: "triangle",
                    stroke: { width: 0, color: "#000000" },
                    polygon: { nb_sides: 5 },
                    image: { src: "img/github.svg", }
                },
                opacity: {
                    value: 0.5,
                    random: false,
                    anim: { enable: false, speed: 1, opacity_min: 0.1, sync: false }
                },
                size: {
                    value: 3,
                    random: true,
                    anim: { enable: false, speed: 40, size_min: 0.1, sync: false }
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: "#ffffff",
                    opacity: 0.4,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 6,
                    direction: "none",
                    random: false,
                    straight: false,
                    out_mode: "out",
                    bounce: false,
                    attract: { enable: false, rotateX: 600, rotateY: 1200 }
                }
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: { enable: true, mode: "repulse" },
                    onclick: { enable: true, mode: "push" },
                    resize: true
                },
                modes: {
                    grab: { distance: 400, line_linked: { opacity: 1 } },
                    bubble: { distance: 400, size: 40, duration: 2, opacity: 8, speed: 3 },
                    repulse: { distance: 200, duration: 0.4 },
                    push: { particles_nb: 4 },
                    remove: { particles_nb: 2 }
                }
            },
            retina_detect: true
        });
    }, []);

    return (
        <Box>
            <Box
                id="particles-container" // Add this to the Box where particles will appear
                sx={{
                    position: 'absolute', // Position it absolute to cover the background
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: { xs: '650px', sm: '900px', md: '700px', lg: '640px', xl: '719px' },
                    zIndex: -1,
                    backgroundImage: `url(${mask})`,
                    // backgroundColor: "#2065B7",
                    backgroundSize: 'cover',
                    // borderBottomLeftRadius: '200px',
                }}
            />
            <Box sx={{ position: 'relative', marginX: '100px' }}>
                <HomeNav />
                <Content />
            </Box>
            <Box sx={{ marginX: '100px' }}>
                <AboutUs />
            </Box>
            <KeyBenefits />
            <Container>
                <Features />
            </Container>
            <Box sx={{ marginX: '100px' }}>
                <TestimonialsCarousel />
            </Box>
            <Box>
                <FAQSection />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', mt: { xs: 3, md: 5 } }}>
                {/* CardBox Section */}
                <Box sx={{ flex: 1, justifyContent: 'center', width: '100%', alignItems: 'center', margin: 'auto', position: { sm: 'static', md: 'absolute' }, mt: { xs: 2, md: 0 } }}>
                    <Box sx={{ marginX: '100px', mt: 14 }}>
                        <CardBox />
                    </Box>
                </Box>
                {/* Footer Section */}
                <Box sx={{ mt: { xs: 0, md: 55 }, color: '#FFFFFF' }}>
                    <Footer />
                </Box>
            </Box>
        </Box>
    );
}

export default Index;
