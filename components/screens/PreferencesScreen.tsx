'use client';

import { Box, Card, CardContent, Chip, Typography } from '@mui/material';
import ScreenWrapper from '../ScreenWrapper';

interface PreferredItem {
  name: string;
  percentage: number;
}

interface PreferencesScreenProps {
  genres?: PreferredItem[];
  audiences?: PreferredItem[];
  themes?: PreferredItem[];
}

export default function PreferencesScreen({
  genres,
  audiences,
  themes,
}: PreferencesScreenProps) {
  return (
    <ScreenWrapper id="preferences-screen">
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
            Предпочтения
          </Typography>
        </Box>
        {genres && genres.length > 0 && (
          <Box
            sx={{
              animation: 'slideUp 0.6s ease-out 0.2s both',
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
                mb: 3,
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6,
                },
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Жанры
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center', mt: 2 }}>
                  {genres.slice(0, 10).map((genre, index) => (
                    <Box
                      key={index}
                      sx={{
                        animation: `scaleIn 0.3s ease-out ${0.4 + index * 0.05}s both`,
                        '@keyframes scaleIn': {
                          from: {
                            opacity: 0,
                            transform: 'scale(0)',
                          },
                          to: {
                            opacity: 1,
                            transform: 'scale(1)',
                          },
                        },
                      }}
                    >
                      <Chip 
                        label={`${genre.name} (${genre.percentage}%)`} 
                        color="primary"
                        sx={{ fontWeight: 500 }}
                      />
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Box>
        )}
        {((audiences && audiences.length > 0) || (themes && themes.length > 0)) && (
          <Box
            sx={{
              animation: 'slideUp 0.6s ease-out 0.4s both',
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
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6,
                },
              }}
            >
              <CardContent>
                {audiences && audiences.length > 0 && (
                  <>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                      Аудитория
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center', mt: 2, mb: 3 }}>
                      {audiences.slice(0, 5).map((audience, index) => (
                        <Box
                          key={index}
                          sx={{
                            animation: `scaleIn 0.3s ease-out ${0.6 + index * 0.1}s both`,
                            '@keyframes scaleIn': {
                              from: {
                                opacity: 0,
                                transform: 'scale(0)',
                              },
                              to: {
                                opacity: 1,
                                transform: 'scale(1)',
                              },
                            },
                          }}
                        >
                          <Chip 
                            label={`${audience.name} (${audience.percentage}%)`} 
                            variant="outlined"
                            sx={{ fontWeight: 500 }}
                          />
                        </Box>
                      ))}
                    </Box>
                  </>
                )}
                {themes && themes.length > 0 && (
                  <>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                      Тематика
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center', mt: 2 }}>
                      {themes.slice(0, 5).map((theme, index) => (
                        <Box
                          key={index}
                          sx={{
                            animation: `scaleIn 0.3s ease-out ${0.8 + index * 0.1}s both`,
                            '@keyframes scaleIn': {
                              from: {
                                opacity: 0,
                                transform: 'scale(0)',
                              },
                              to: {
                                opacity: 1,
                                transform: 'scale(1)',
                              },
                            },
                          }}
                        >
                          <Chip 
                            label={`${theme.name} (${theme.percentage}%)`} 
                            variant="outlined"
                            sx={{ fontWeight: 500 }}
                          />
                        </Box>
                      ))}
                    </Box>
                  </>
                )}
              </CardContent>
            </Card>
          </Box>
        )}
      </Box>
    </ScreenWrapper>
  );
}
