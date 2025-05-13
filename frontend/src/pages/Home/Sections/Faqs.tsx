import React, { useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTranslation } from 'react-i18next';

export default function FAQSection() {
  const [expanded, setExpanded] = useState('panel0');
  const { t } = useTranslation();
  const faqs = t('faq.list', { returnObjects: true });

  const handleChange = (panel) => (_event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Box
      sx={{
        background: 'linear-gradient(90deg, rgba(69,223,255,0.15) 0%, rgba(15,146,249,0.25) 50%, rgba(71,224,255,0.15) 100%)',
        py: 5,
        minHeight: '100vh',
      }}
    >
      <Box sx={{ marginX: '100px' }}>
        <Typography
          variant="overline"
          sx={{ textAlign: 'center', display: 'block', color: '#0591FC', fontWeight: '700', mb: 1, fontSize: '16px' }}
        >
          {t('faq.title')}
        </Typography>
        <Typography
          variant="h4"
          sx={{
            fontWeight: '600',
            fontSize: '48px',
            textAlign: 'center',
            mb: 4,
          }}
        >
          {t('faq.subtitle')}
        </Typography>

        {faqs?.map((faq, index) => (
          <Accordion
            key={index}
            expanded={expanded === `panel${index}`}
            onChange={handleChange(`panel${index}`)}
            sx={{
              mb: 2,
              borderRadius: expanded === `panel${index}` ? '0px' : '10px',
              boxShadow: 3,
              backgroundColor: '#fff',
              '&:before': {
                display: 'none',
              },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: '#5C5C5C' }} />}
              sx={{
                px: 3,
                py: 1,
              }}
            >
              <Typography
                sx={{
                  fontWeight: 600,
                  color: expanded === `panel${index}` ? '#0591FC' : '#000000',
                  my: 0,
                }}
              >
                {faq.question}
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ px: 3, pb: 2, color: '#343A40' }}>
              <Typography variant="body2">{faq.answer}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Box>
  );
}
