'use client';

import { Box, styled } from '@mui/material';
import React from 'react';

const ScreenContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(4),
  boxSizing: 'border-box',
  position: 'relative',
  animation: 'fadeIn 0.5s ease-out',
  paddingBottom: '100px', // Отступ для footer
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
    paddingBottom: '80px',
  },
  [theme.breakpoints.down('xs')]: {
    padding: theme.spacing(1.5),
    paddingBottom: '70px',
  },
  '@keyframes fadeIn': {
    from: {
      opacity: 0,
    },
    to: {
      opacity: 1,
    },
  },
}));

interface ScreenWrapperProps {
  children: React.ReactNode;
  id?: string;
}

export default function ScreenWrapper({ children, id }: ScreenWrapperProps) {
  return (
    <ScreenContainer id={id} className="wrapped-screen">
      {children}
    </ScreenContainer>
  );
}

