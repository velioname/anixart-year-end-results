'use client';

import { Box, Typography } from '@mui/material';
import ScreenWrapper from '../ScreenWrapper';

export default function FinalScreen() {
  return (
    <ScreenWrapper id="final-screen">
      <Box sx={{ textAlign: 'center', maxWidth: 600, width: '100%', px: { xs: 2, sm: 3 } }}>
        <Box
          sx={{
            animation: 'scaleIn 0.6s ease-out',
            '@keyframes scaleIn': {
              from: {
                opacity: 0,
                transform: 'scale(0.8)',
              },
              to: {
                opacity: 1,
                transform: 'scale(1)',
              },
            },
          }}
        >
          <Typography 
            variant="h1" 
            component="h1" 
            gutterBottom
            sx={{
              fontWeight: 700,
              fontSize: { xs: '3rem', sm: '4rem', md: '5rem' },
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2,
            }}
          >
            Anixart
          </Typography>
        </Box>
        <Box
          sx={{
            animation: 'slideUp 0.6s ease-out 0.2s both',
            '@keyframes slideUp': {
              from: {
                opacity: 0,
                transform: 'translateY(20px)',
              },
              to: {
                opacity: 1,
                transform: 'translateY(0)',
              },
            },
          }}
        >
          <Typography 
            variant="h4" 
            component="h2" 
            sx={{ 
              mt: 2, 
              mb: 4,
              fontWeight: 500,
              fontSize: { xs: '1.75rem', sm: '2rem' },
            }}
          >
            Итоги года
          </Typography>
        </Box>
        <Box
          sx={{
            animation: 'slideUp 0.6s ease-out 0.4s both',
            '@keyframes slideUp': {
              from: {
                opacity: 0,
                transform: 'translateY(20px)',
              },
              to: {
                opacity: 1,
                transform: 'translateY(0)',
              },
            },
          }}
        >
          <Typography 
            variant="body1" 
            color="text.secondary"
            sx={{ 
              mt: 4,
              fontSize: { xs: '1rem', sm: '1.125rem' },
              lineHeight: 1.8,
            }}
          >
            Спасибо за использование нашего приложения!
            <br />
            Надеемся, что твои итоги года были интересными 🎉
          </Typography>
        </Box>
      </Box>
    </ScreenWrapper>
  );
}
