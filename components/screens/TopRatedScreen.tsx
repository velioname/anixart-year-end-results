'use client';

import { Box, Card, CardContent, CardMedia, Grid, Typography, Chip, Rating, Stack } from '@mui/material';
import ScreenWrapper from '../ScreenWrapper';
import { getPosterUrl } from '@/lib/api';
import { Release } from '@/lib/api';
import StarIcon from '@mui/icons-material/Star';

interface TopRatedScreenProps {
  releases: Release[];
}

export default function TopRatedScreen({ releases }: TopRatedScreenProps) {
  if (!releases || releases.length === 0) {
    return (
      <ScreenWrapper id="top-rated-screen">
        <Box sx={{ textAlign: 'center', maxWidth: 600, width: '100%', px: { xs: 2, sm: 3 } }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ mb: 4, fontWeight: 700 }}>
            Оценено на 5 звезд
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Нет данных
          </Typography>
        </Box>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper id="top-rated-screen">
      <Box sx={{ maxWidth: 1400, width: '100%', px: { xs: 1, sm: 2, md: 3 } }}>
        <Box
          sx={{
            textAlign: 'center',
            mb: 4,
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
            Оценено на 5 звезд ⭐
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ 
              mb: 2,
              fontWeight: 600,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Всего: {releases.length}
          </Typography>
        </Box>
        <Grid container spacing={3}>
          {releases.map((release, index) => {
            const posterUrl = getPosterUrl(release.poster, release.image);
            const genres = release.genres ? release.genres.split(', ').slice(0, 4) : [];
            
            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={release.id || index}>
                <Box
                  sx={{
                    animation: `scaleIn 0.5s ease-out ${index * 0.1}s both`,
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
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      borderRadius: 3,
                      overflow: 'hidden',
                      backgroundColor: 'background.paper',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      '&:hover': {
                        transform: 'translateY(-8px) scale(1.02)',
                        boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                      },
                    }}
                  >
                    <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                      {posterUrl ? (
                        <CardMedia
                          component="img"
                          image={posterUrl}
                          alt={release.title_ru}
                          sx={{
                            height: { xs: 280, sm: 320, md: 360 },
                            objectFit: 'cover',
                            transition: 'transform 0.5s ease',
                            '&:hover': {
                              transform: 'scale(1.1)',
                            },
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            height: { xs: 280, sm: 320, md: 360 },
                            backgroundColor: 'action.hover',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            Нет изображения
                          </Typography>
                        </Box>
                      )}
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 12,
                          right: 12,
                          backgroundColor: 'rgba(0, 0, 0, 0.7)',
                          backdropFilter: 'blur(10px)',
                          borderRadius: 2,
                          px: 1.5,
                          py: 0.5,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                        }}
                      >
                        <StarIcon sx={{ color: '#FFD700', fontSize: '1.2rem' }} />
                        <Typography
                          variant="body2"
                          sx={{
                            color: 'white',
                            fontWeight: 600,
                            fontSize: '0.875rem',
                          }}
                        >
                          5.0
                        </Typography>
                      </Box>
                    </Box>
                    <CardContent sx={{ p: 2.5, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      <Typography 
                        variant="h6" 
                        component="h3"
                        sx={{ 
                          fontWeight: 700,
                          mb: 1,
                          fontSize: { xs: '1rem', sm: '1.125rem' },
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          lineHeight: 1.4,
                          minHeight: '2.8em',
                        }}
                      >
                        {release.title_ru}
                      </Typography>
                      
                      {release.title_original && (
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ 
                            mb: 1.5,
                            fontStyle: 'italic',
                            fontSize: '0.8125rem',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: 'vertical',
                          }}
                        >
                          {release.title_original}
                        </Typography>
                      )}

                      <Stack direction="row" spacing={1} sx={{ mb: 1.5, alignItems: 'center', flexWrap: 'wrap', gap: 0.5 }}>
                        {release.year && (
                          <Chip
                            label={release.year}
                            size="small"
                            sx={{
                              height: '24px',
                              fontSize: '0.75rem',
                              fontWeight: 500,
                              backgroundColor: 'primary.main',
                              color: 'white',
                            }}
                          />
                        )}
                        {release.grade && release.grade > 0 && (
                          <Chip
                            label={`⭐ ${release.grade.toFixed(1)}`}
                            size="small"
                            sx={{
                              height: '24px',
                              fontSize: '0.75rem',
                              fontWeight: 500,
                            }}
                          />
                        )}
                        {release.rating && release.rating > 0 && (
                          <Chip
                            label={`👥 ${release.rating.toLocaleString('ru-RU')}`}
                            size="small"
                            sx={{
                              height: '24px',
                              fontSize: '0.75rem',
                              fontWeight: 500,
                            }}
                          />
                        )}
                      </Stack>

                      {genres.length > 0 && (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1.5 }}>
                          {genres.map((genre, idx) => (
                            <Chip
                              key={idx}
                              label={genre.trim()}
                              size="small"
                              sx={{ 
                                height: '22px',
                                fontSize: '0.6875rem',
                                backgroundColor: 'action.selected',
                              }}
                            />
                          ))}
                        </Box>
                      )}

                      {release.description && (
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ 
                            mt: 'auto',
                            fontSize: '0.8125rem',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            lineHeight: 1.5,
                          }}
                        >
                          {release.description}
                        </Typography>
                      )}

                      <Box sx={{ mt: 1.5, display: 'flex', justifyContent: 'center' }}>
                        <Rating value={5} readOnly size="small" sx={{ color: '#FFD700' }} />
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </ScreenWrapper>
  );
}
