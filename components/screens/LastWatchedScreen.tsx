'use client';

import { Box, Card, CardContent, CardMedia, Typography } from '@mui/material';
import ScreenWrapper from '../ScreenWrapper';
import { formatDate } from '@/lib/utils';
import { getPosterUrl } from '@/lib/api';

interface LastWatchedScreenProps {
  release: {
    title_ru: string;
    poster?: string;
    image?: string;
    title_original?: string;
    year?: string;
  };
  episode?: number;
  watchedAt?: number;
  episodeName?: string;
}

export default function LastWatchedScreen({
  release,
  episode,
  watchedAt,
  episodeName,
}: LastWatchedScreenProps) {
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

  return (
    <ScreenWrapper id="last-watched-screen">
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
            Последний просмотр
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
                    height: 350,
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
              {release.year && (
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  gutterBottom
                  sx={{ mb: 2 }}
                >
                  📅 {release.year}
                </Typography>
              )}
              {episode && (
                <Box sx={{ mb: 2 }}>
                  <Typography 
                    variant="h6" 
                    color="primary" 
                    gutterBottom
                    sx={{ fontWeight: 600 }}
                  >
                    Эпизод {episode}
                  </Typography>
                  {episodeName && (
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ fontStyle: 'italic' }}
                    >
                      {episodeName}
                    </Typography>
                  )}
                </Box>
              )}
              {watchedAt && (
                <Box sx={{ 
                  mt: 2, 
                  p: 2, 
                  backgroundColor: 'action.hover',
                  borderRadius: 2,
                }}>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ mb: 0.5, fontWeight: 500 }}
                  >
                    Просмотрено
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ fontWeight: 500 }}
                  >
                    {formatDate(watchedAt)}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>
      </Box>
    </ScreenWrapper>
  );
}
