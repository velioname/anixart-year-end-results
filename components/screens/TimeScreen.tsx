'use client';

import { Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import ScreenWrapper from '../ScreenWrapper';

interface TimeScreenProps {
  hours: number;
  days: number;
  averagePerDay?: number;
  watchedTime: number;
}

export default function TimeScreen({ hours, days, averagePerDay, watchedTime }: TimeScreenProps) {
  const [displayHours, setDisplayHours] = useState(0);

  useEffect(() => {
    if (hours === 0) {
      setDisplayHours(0);
      return;
    }
    
    const duration = 2000;
    const steps = 60;
    const increment = hours / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= hours) {
        setDisplayHours(hours);
        clearInterval(timer);
      } else {
        setDisplayHours(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [hours]);

  return (
    <ScreenWrapper id="time-screen">
      <Box sx={{ textAlign: 'center', maxWidth: 600, width: '100%', px: { xs: 2, sm: 3 } }}>
        <Box
          sx={{
            animation: 'scaleIn 0.8s ease-out',
            '@keyframes scaleIn': {
              from: {
                opacity: 0,
                transform: 'scale(0.5)',
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
              fontSize: { xs: '4rem', md: '6rem' },
              fontWeight: 700,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2,
            }}
          >
            {displayHours}
          </Typography>
        </Box>
        <Box
          sx={{
            animation: 'slideUp 0.6s ease-out 0.3s both',
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
            gutterBottom
            sx={{ fontWeight: 500 }}
          >
            часов в аниме
          </Typography>
        </Box>
        <Box
          sx={{
            animation: 'slideUp 0.6s ease-out 0.5s both',
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
          <Box sx={{ mt: 4 }}>
            <Typography 
              variant="h5" 
              component="p" 
              sx={{ 
                opacity: 0.8,
                fontWeight: 400,
                mb: 2,
              }}
            >
              Это {days} {days === 1 ? 'день' : days < 5 ? 'дня' : 'дней'}
            </Typography>
            {averagePerDay && averagePerDay > 0 && (
              <Typography 
                variant="body1" 
                sx={{ 
                  opacity: 0.7,
                  fontWeight: 400,
                }}
              >
                В среднем {averagePerDay} {averagePerDay === 1 ? 'час' : averagePerDay < 5 ? 'часа' : 'часов'} в день
              </Typography>
            )}
            <Typography 
              variant="body2" 
              sx={{ 
                mt: 2,
                opacity: 0.6,
                fontWeight: 400,
              }}
            >
              {watchedTime.toLocaleString('ru-RU')} минут просмотра
            </Typography>
          </Box>
        </Box>
      </Box>
    </ScreenWrapper>
  );
}
