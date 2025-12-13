'use client';

import { Box, Typography, Link } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        py: { xs: 1.5, sm: 2 },
        px: 2,
        backgroundColor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider',
        zIndex: 100,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 1,
        flexWrap: 'wrap',
        height: { xs: '60px', sm: '70px' },
        '@media (max-width: 600px)': {
          py: 1.5,
          px: 1,
          height: '60px',
        },
      }}
    >
      <Typography
        variant="body2"
        sx={{
          color: 'text.secondary',
          fontSize: { xs: '0.75rem', sm: '0.875rem' },
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
        }}
      >
        Made with <span style={{ color: '#e91e63' }}>❤️</span> by{' '}
        <Link
          href="https://github.com/velioname"
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            color: 'primary.main',
            textDecoration: 'none',
            fontWeight: 500,
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
        >
          Veliona
        </Link>
      </Typography>
      <Link
        href="https://github.com/velioname/anixart-year-end-results"
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          color: 'text.secondary',
          textDecoration: 'none',
          fontSize: { xs: '0.75rem', sm: '0.875rem' },
          '&:hover': {
            color: 'primary.main',
          },
        }}
      >
        <GitHubIcon sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }} />
        <Typography
          component="span"
          sx={{
            fontSize: 'inherit',
            '@media (max-width: 600px)': {
              display: 'none',
            },
          }}
        >
          GitHub
        </Typography>
      </Link>
    </Box>
  );
}

