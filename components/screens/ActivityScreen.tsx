'use client';

import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import ScreenWrapper from '../ScreenWrapper';

interface ActivityScreenProps {
  watchedEpisodes: number;
  completedCount: number;
  favoriteCount: number;
  friendCount?: number;
  commentCount?: number;
  watchingCount?: number;
  planCount?: number;
}

export default function ActivityScreen({
  watchedEpisodes,
  completedCount,
  favoriteCount,
  friendCount,
  commentCount,
  watchingCount,
  planCount,
}: ActivityScreenProps) {
  const stats = [
    { value: watchedEpisodes, label: 'Просмотрено серий', icon: '📺' },
    { value: completedCount, label: 'Завершено тайтлов', icon: '✅' },
    { value: favoriteCount, label: 'В избранном', icon: '⭐' },
  ];

  const additionalStats = [];
  if (watchingCount !== undefined && watchingCount > 0) {
    additionalStats.push({ value: watchingCount, label: 'Смотрю сейчас', icon: '👀' });
  }
  if (planCount !== undefined && planCount > 0) {
    additionalStats.push({ value: planCount, label: 'В планах', icon: '📋' });
  }
  if (friendCount !== undefined && friendCount > 0) {
    additionalStats.push({ value: friendCount, label: 'Друзей', icon: '👥' });
  }
  if (commentCount !== undefined && commentCount > 0) {
    additionalStats.push({ value: commentCount, label: 'Комментариев', icon: '💬' });
  }

  return (
    <ScreenWrapper id="activity-screen">
      <Box sx={{ textAlign: 'center', maxWidth: 800, width: '100%', px: { xs: 2, sm: 3 } }}>
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
              mb: 4,
              fontWeight: 700,
            }}
          >
            Активность
          </Typography>
        </Box>
        <Grid container spacing={3}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={4} key={index}>
              <Box
                sx={{
                  animation: `slideUp 0.6s ease-out ${index * 0.2}s both`,
                  '@keyframes slideUp': {
                    from: {
                      opacity: 0,
                      transform: 'translateY(30px)',
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
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: 6,
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Typography 
                      variant="h3" 
                      component="div" 
                      sx={{
                        fontSize: '3rem',
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
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        mb: 1,
                      }}
                    >
                      {stat.value.toLocaleString('ru-RU')}
                    </Typography>
                    <Typography 
                      variant="body1" 
                      color="text.secondary"
                      sx={{ fontWeight: 500 }}
                    >
                      {stat.label}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            </Grid>
          ))}
        </Grid>
        {additionalStats.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Grid container spacing={2}>
              {additionalStats.map((stat, index) => (
                <Grid item xs={6} sm={3} key={index}>
                  <Box
                    sx={{
                      animation: `slideUp 0.6s ease-out ${0.6 + index * 0.1}s both`,
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
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: 4,
                        },
                      }}
                    >
                      <CardContent sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h5" sx={{ mb: 0.5 }}>
                          {stat.icon}
                        </Typography>
                        <Typography 
                          variant="h5" 
                          component="div"
                          sx={{
                            fontWeight: 600,
                            color: 'primary.main',
                            mb: 0.5,
                          }}
                        >
                          {stat.value.toLocaleString('ru-RU')}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          color="text.secondary"
                          sx={{ fontSize: '0.75rem' }}
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
