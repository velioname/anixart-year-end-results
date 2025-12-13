'use client';

import { Avatar, Box, Typography, Card, CardContent, Chip } from '@mui/material';
import ScreenWrapper from '../ScreenWrapper';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface WelcomeScreenProps {
  login: string;
  avatar?: string;
}

export default function WelcomeScreen({ login, avatar }: WelcomeScreenProps) {
  const requirements = [
    { text: 'Активный аккаунт в Anixart', icon: '✓' },
    { text: 'История просмотров', icon: '✓' },
    { text: 'Статистика активности', icon: '✓' },
  ];

  return (
    <ScreenWrapper id="welcome-screen">
      <Box sx={{ textAlign: 'center', maxWidth: 800, width: '100%', px: { xs: 2, sm: 3 } }}>
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
          {avatar && (
            <Avatar
              src={avatar}
              alt={login}
              sx={{
                width: { xs: 120, sm: 160 },
                height: { xs: 120, sm: 160 },
                margin: '0 auto 24px',
                border: '6px solid',
                borderColor: 'primary.main',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
              }}
            />
          )}
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
            variant="h2" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontWeight: 700,
              fontSize: { xs: '2rem', sm: '3rem' },
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2,
            }}
          >
            {login}
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
            variant="h4" 
            component="h2" 
            color="primary" 
            sx={{ 
              mt: 2,
              mb: 4,
              fontWeight: 500,
              letterSpacing: '0.5px',
              fontSize: { xs: '1.5rem', sm: '2rem' },
            }}
          >
            Твои итоги года
          </Typography>
        </Box>
        
        <Box
          sx={{
            animation: 'slideUp 0.6s ease-out 0.6s both',
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
            mt: 4,
          }}
        >
          <Card
            sx={{
              backgroundColor: 'background.paper',
              boxShadow: 3,
              borderRadius: 3,
            }}
          >
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography 
                variant="h6" 
                gutterBottom
                sx={{ 
                  fontWeight: 600,
                  mb: 2,
                  fontSize: { xs: '1rem', sm: '1.25rem' },
                }}
              >
                Что нужно для итогов года?
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {requirements.map((req, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      textAlign: 'left',
                    }}
                  >
                    <CheckCircleIcon 
                      sx={{ 
                        color: 'success.main',
                        fontSize: { xs: '1.25rem', sm: '1.5rem' },
                      }} 
                    />
                    <Typography 
                      variant="body1"
                      sx={{
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                        color: 'text.primary',
                      }}
                    >
                      {req.text}
                    </Typography>
                  </Box>
                ))}
              </Box>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ 
                  mt: 3,
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  fontStyle: 'italic',
                }}
              >
                Все данные собираются автоматически из твоего профиля Anixart
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </ScreenWrapper>
  );
}

