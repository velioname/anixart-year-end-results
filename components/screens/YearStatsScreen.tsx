'use client';

import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import ScreenWrapper from '../ScreenWrapper';

interface YearStatsScreenProps {
  watchedThisYear: number;
  completedThisYear: number;
  droppedThisYear: number;
  favoritesAddedThisYear: number;
  watchingThisYear: number;
  planThisYear: number;
  holdOnThisYear: number;
  commentsThisYear: number;
}

export default function YearStatsScreen({
  watchedThisYear,
  completedThisYear,
  droppedThisYear,
  favoritesAddedThisYear,
  watchingThisYear,
  planThisYear,
  holdOnThisYear,
  commentsThisYear,
}: YearStatsScreenProps) {
  const mainStats = [
    { value: watchedThisYear, label: 'Просмотрено', icon: '📺', color: '#667eea' },
    { value: completedThisYear, label: 'Завершено', icon: '✅', color: '#48bb78' },
    { value: watchingThisYear, label: 'Смотрю', icon: '👀', color: '#4299e1' },
  ];

  const secondaryStats = [
    { value: planThisYear, label: 'В планах', icon: '📋', color: '#ed8936' },
    { value: droppedThisYear, label: 'Брошено', icon: '❌', color: '#f56565' },
    { value: holdOnThisYear, label: 'Отложено', icon: '⏸️', color: '#9f7aea' },
    { value: favoritesAddedThisYear, label: 'Добавлено в избранное', icon: '⭐', color: '#fbbf24' },
    { value: commentsThisYear, label: 'Комментариев написано', icon: '💬', color: '#38b2ac' },
  ].filter(stat => stat.value > 0);

  return (
    <ScreenWrapper id="year-stats-screen">
      <Box sx={{ textAlign: 'center', maxWidth: 1000, width: '100%', px: { xs: 2, sm: 3 } }}>
        <Box
          sx={{
            animation: 'slideDown 0.6s ease-out',
            '@keyframes slideDown': {
              from: {
                opacity: 0,
                transform: 'translateY(-20px)',
              },
              to: {
                opacity: 1,
                transform: 'translateY(0)',
              },
            },
          }}
        >
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom 
            sx={{ 
              mb: 2,
              fontWeight: 700,
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
            }}
          >
            В этом году
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary"
            sx={{ mb: 4 }}
          >
            Твоя активность за {new Date().getFullYear()} год
          </Typography>
        </Box>

        {/* Основные статистики */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {mainStats.map((stat, index) => (
            <Grid item xs={12} sm={4} key={index}>
              <Box
                sx={{
                  animation: `scaleIn 0.6s ease-out ${index * 0.2}s both`,
                  '@keyframes scaleIn': {
                    from: {
                      opacity: 0,
                      transform: 'scale(0.9)',
                    },
                    to: {
                      opacity: 1,
                      transform: 'scale(1)',
                    },
                  },
                }}
              >
                <Card
                  sx={{
                    height: '100%',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    background: `linear-gradient(135deg, ${stat.color}15 0%, ${stat.color}05 100%)`,
                    border: `2px solid ${stat.color}30`,
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: 8,
                      borderColor: stat.color,
                    },
                  }}
                >
                  <CardContent sx={{ p: 3, textAlign: 'center' }}>
                    <Typography 
                      variant="h2" 
                      component="div" 
                      sx={{
                        fontSize: '3.5rem',
                        mb: 1,
                      }}
                    >
                      {stat.icon}
                    </Typography>
                    <Typography 
                      variant="h2" 
                      component="div" 
                      sx={{
                        fontWeight: 700,
                        background: `linear-gradient(135deg, ${stat.color} 0%, ${stat.color}dd 100%)`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        mb: 1,
                        fontSize: { xs: '2.5rem', sm: '3rem' },
                      }}
                    >
                      {stat.value.toLocaleString('ru-RU')}
                    </Typography>
                    <Typography 
                      variant="h6" 
                      color="text.secondary"
                      sx={{ fontWeight: 600 }}
                    >
                      {stat.label}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Дополнительные статистики */}
        {secondaryStats.length > 0 && (
          <Box>
            <Typography 
              variant="h5" 
              sx={{ 
                mb: 3,
                fontWeight: 600,
                textAlign: 'center',
              }}
            >
              Дополнительная статистика
            </Typography>
            <Grid container spacing={2}>
              {secondaryStats.map((stat, index) => (
                <Grid item xs={6} sm={4} md={3} key={index}>
                  <Box
                    sx={{
                      animation: `slideUp 0.5s ease-out ${0.6 + index * 0.1}s both`,
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
                    <Card
                      sx={{
                        height: '100%',
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                        background: `linear-gradient(135deg, ${stat.color}10 0%, ${stat.color}05 100%)`,
                        border: `1px solid ${stat.color}20`,
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: 4,
                          borderColor: stat.color,
                        },
                      }}
                    >
                      <CardContent sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ mb: 1 }}>
                          {stat.icon}
                        </Typography>
                        <Typography 
                          variant="h4" 
                          component="div"
                          sx={{
                            fontWeight: 700,
                            color: stat.color,
                            mb: 0.5,
                            fontSize: { xs: '1.5rem', sm: '2rem' },
                          }}
                        >
                          {stat.value.toLocaleString('ru-RU')}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ 
                            fontSize: { xs: '0.75rem', sm: '0.875rem' },
                            fontWeight: 500,
                          }}
                        >
                          {stat.label}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Box>
    </ScreenWrapper>
  );
}

