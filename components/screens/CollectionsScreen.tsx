'use client';

import { Box, Card, CardContent, Typography } from '@mui/material';
import ScreenWrapper from '../ScreenWrapper';

interface CollectionsScreenProps {
  collectionCount: number;
  topCollection?: {
    title: string;
    description?: string;
  };
}

export default function CollectionsScreen({
  collectionCount,
  topCollection,
}: CollectionsScreenProps) {
  return (
    <ScreenWrapper id="collections-screen">
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
            Коллекции
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
              mb: 3,
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 6,
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography 
                variant="h1" 
                component="div"
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1,
                }}
              >
                {collectionCount}
              </Typography>
              <Typography 
                variant="body1" 
                color="text.secondary"
                sx={{ fontWeight: 500 }}
              >
                Всего коллекций
              </Typography>
            </CardContent>
          </Card>
        </Box>
        {topCollection && (
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
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Самая активная коллекция
                </Typography>
                <Typography 
                  variant="h5" 
                  component="h2"
                  sx={{
                    fontWeight: 600,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 1,
                  }}
                >
                  {topCollection.title}
                </Typography>
                {topCollection.description && (
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ mt: 2 }}
                  >
                    {topCollection.description}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Box>
        )}
      </Box>
    </ScreenWrapper>
  );
}
