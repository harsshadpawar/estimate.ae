import Slider from 'react-slick';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Rating,
  GlobalStyles,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

const testimonials = [
  {
    name: 'John D.',
    subtitle: 'Lorem Ipsum is simply',
    rating: 5,
    description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry...',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    name: 'Jane A.',
    subtitle: 'Printing and Typesetting',
    rating: 4,
    description: 'It has survived not only five centuries, but also the leap into electronic typesetting...',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    name: 'Mark R.',
    subtitle: 'Typesetting Industry',
    rating: 5,
    description: 'It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum...',
    image: 'https://randomuser.me/api/portraits/men/45.jpg',
  },
  {
    name: 'Anna B.',
    subtitle: 'Lorem Ipsum Text',
    rating: 4,
    description: 'More recently with desktop publishing software like Aldus PageMaker including versions...',
    image: 'https://randomuser.me/api/portraits/women/47.jpg',
  },
];

const sliderSettings = {
  infinite: true,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  arrows: true,
  responsive: [
    {
      breakpoint: 960,
      settings: {
        slidesToShow: 2,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1,
      },
    },
  ],
};

const TestimonialsCarousel = () => {
  const { t } = useTranslation();

  const translatedTestimonials = t('testimonials.list', { returnObjects: true });

  return (
    <Box sx={{ p: 5, textAlign: 'center', bgcolor: '#fff' }}>
      <GlobalStyles
        styles={{
          '.slick-prev:before, .slick-next:before': {
            color: 'lightgray',
            fontSize: '30px',
          },
        }}
      />
      <Typography variant="subtitle2" sx={{ color: '#0591FC', fontWeight: '700', mb: 1, fontSize: '16px' }}>
        {t('testimonials.heading')}
      </Typography>
      <Typography variant="h4" sx={{ fontWeight: '600', mb: 4, fontSize: '48px' }}>
        {t('testimonials.subheading')}
      </Typography>

      <Slider {...sliderSettings}>
        {translatedTestimonials.map((testimonial, index) => (
          <Box key={index} py={5}>
            <Card
              sx={{
                borderRadius: 4,
                boxShadow: 3,
                pt: 6,
                pb: 4,
                px: 3,
                position: 'relative',
                textAlign: 'center',
                overflow: 'visible',
                mx: 2,
                height: '300px'
              }}
            >
              <Avatar
                src={testimonials[index]?.image}
                alt={testimonial.name}
                sx={{
                  width: 80,
                  height: 80,
                  position: 'absolute',
                  top: -40,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  boxShadow: 1,
                }}
              />

              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: '700', mt: 2, fontSize: '22px' }}>
                  {testimonial.name}
                </Typography>
                <Typography sx={{ color: '#0591FC', fontWeight: 600, fontSize: '18px', mb: 1 }}>
                  {testimonial.subtitle}
                </Typography>
                <Rating
                  value={testimonials[index]?.rating || 5}
                  readOnly
                  sx={{
                    color: '#FFA500',
                    mb: 2,
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{ color: 'text.secondary', fontSize: '16px', lineHeight: 1.6, fontWeight: '400' }}
                >
                  {testimonial.description}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Slider>
    </Box>
  );
};


export default TestimonialsCarousel;
