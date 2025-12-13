'use client';

import { Box, Card, CardContent, CardMedia, Chip, Typography } from '@mui/material';
import ScreenWrapper from '../ScreenWrapper';
import { getPosterUrl } from '@/lib/api';

interface TopReleaseScreenProps {
  release: {
    title_ru: string;
    title_original?: string;
    poster?: string;
    image?: string;
    genres?: string;
    year?: string;
    rating?: number;
    grade?: number;
    description?: string;
  };
}

export default function TopReleaseScreen({ release }: TopReleaseScreenProps) {
  // Обрабатываем poster и image - проверяем, не является ли уже полным URL
  let posterValue = release.poster;
  let imageValue = release.image;
  
  // Если image содержит полный URL, извлекаем только имя файла
  if (imageValue && imageValue.includes('s.anixmirai.com')) {
    imageValue = imageValue.split('/').pop()?.replace('.jpg', '') || imageValue;
  }
  
  // Если poster содержит полный URL, извлекаем только имя файла
  if (posterValue && posterValue.includes('s.anixmirai.com')) {
    posterValue = posterValue.split('/').pop()?.replace('.jpg', '') || posterValue;
  }
  
  const posterUrl = getPosterUrl(posterValue, imageValue);
  const genres = release.genres ? release.genres.split(', ') : [];

  return (
    <ScreenWrapper id="top-release-screen">
      <Box sx={{ textAlign: 'center', maxWidth: 600, width: '100%', px: { xs: 2, sm: 3 } }}>
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
            Топ релиз года
          </Typography>
        </Box>
        <Box
          sx={{
            animation: 'scaleIn 0.6s ease-out 0.2s both',
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
              overflow: 'hidden',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                transform: 'scale(1.02)',
                boxShadow: 8,
              },
            }}
          >
            {posterUrl && (
              <Box
                sx={{
                  animation: 'fadeIn 0.8s ease-out 0.4s both',
                  '@keyframes fadeIn': {
                    from: { opacity: 0 },
                    to: { opacity: 1 },
                  },
                }}
              >
                <CardMedia
                  component="img"
                  image={posterUrl}
                  alt={release.title_ru}
                  sx={{
                    height: 450,
                    objectFit: 'cover',
                  }}
                />
              </Box>
            )}
            <CardContent sx={{ p: 3 }}>
              <Typography 
                variant="h5" 
                component="h2" 
                gutterBottom
                sx={{ fontWeight: 600, mb: 1 }}
              >
                {release.title_ru}
              </Typography>
              {release.title_original && (
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  gutterBottom
                  sx={{ mb: 1, fontStyle: 'italic' }}
                >
                  {release.title_original}
                </Typography>
              )}
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 2, flexWrap: 'wrap' }}>
                {release.year && (
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ fontWeight: 500 }}
                  >
                    📅 {release.year}
                  </Typography>
                )}
                {release.grade && release.grade > 0 && (
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ fontWeight: 500 }}
                  >
                    ⭐ {release.grade.toFixed(2)}
                  </Typography>
                )}
                {release.rating && release.rating > 0 && (
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ fontWeight: 500 }}
                  >
                    👥 {release.rating.toLocaleString('ru-RU')}
                  </Typography>
                )}
              </Box>
              {genres.length > 0 && (
                <Box 
                  sx={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: 1, 
                    mt: 2, 
                    justifyContent: 'center' 
                  }}
                >
                  {genres.slice(0, 5).map((genre, index) => (
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
                        label={genre.trim()} 
                        size="small"
                        sx={{ fontWeight: 500 }}
                      />
                    </Box>
                  ))}
                </Box>
              )}
              {release.description && (
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ 
                    mt: 2, 
                    textAlign: 'left',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {release.description}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Box>
      </Box>
    </ScreenWrapper>
  );
}
