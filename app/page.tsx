'use client';

import { useState, useEffect } from 'react';
import { ThemeProvider, CssBaseline, createTheme, Box, Button, Typography, IconButton } from '@mui/material';
import { api } from '@/lib/api';
import {
  createAppTheme,
  getStoredThemeSettings,
  saveThemeSettings,
  ColorScheme,
  ColorPalette,
} from '@/lib/theme';
import LoginDialog from '@/components/LoginDialog';
import ThemeSettings from '@/components/ThemeSettings';
import WrappedViewer from '@/components/WrappedViewer';
import Footer from '@/components/Footer';
import SettingsIcon from '@mui/icons-material/Settings';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [themeSettingsOpen, setThemeSettingsOpen] = useState(false);
  const [colorScheme, setColorScheme] = useState<ColorScheme>('auto');
  const [colorPalette, setColorPalette] = useState<ColorPalette>('default');
  const [theme, setTheme] = useState(createTheme(createAppTheme('auto', 'default')));

  useEffect(() => {
    // Проверяем сохранённый токен
    const token = api.getToken();
    if (token) {
      setIsAuthenticated(true);
    }

    // Загружаем настройки темы
    const settings = getStoredThemeSettings();
    setColorScheme(settings.colorScheme);
    setColorPalette(settings.colorPalette);
    updateTheme(settings.colorScheme, settings.colorPalette);
  }, []);

  const updateTheme = (scheme: ColorScheme, palette: ColorPalette) => {
    const themeOptions = createAppTheme(scheme, palette);
    setTheme(createTheme(themeOptions));
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    api.setToken(null);
    setIsAuthenticated(false);
  };

  const handleColorSchemeChange = (scheme: ColorScheme) => {
    setColorScheme(scheme);
    saveThemeSettings(scheme, colorPalette);
    updateTheme(scheme, colorPalette);
  };

  const handleColorPaletteChange = (palette: ColorPalette) => {
    setColorPalette(palette);
    saveThemeSettings(colorScheme, palette);
    updateTheme(colorScheme, palette);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {!isAuthenticated ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            gap: 3,
            padding: 3,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
            },
          }}
        >
          <Box
            sx={{
              position: 'relative',
              zIndex: 1,
              textAlign: 'center',
            }}
          >
            <Typography 
              variant="h1" 
              component="h1" 
              sx={{
                color: 'white',
                fontWeight: 700,
                fontSize: { xs: '3rem', md: '4.5rem' },
                mb: 2,
                textShadow: '0 4px 20px rgba(0,0,0,0.3)',
              }}
            >
              Anixart
            </Typography>
            <Typography 
              variant="h3" 
              component="h2" 
              sx={{
                color: 'white',
                fontWeight: 500,
                mb: 3,
                opacity: 0.95,
              }}
            >
              Итоги года
            </Typography>
            <Typography 
              variant="h6" 
              sx={{
                color: 'white',
                opacity: 0.9,
                mb: 4,
                maxWidth: 500,
                mx: 'auto',
              }}
            >
              Узнай свою персональную статистику за год
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => setLoginDialogOpen(true)}
              sx={{
                mt: 2,
                px: 4,
                py: 1.5,
                borderRadius: '24px',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '1.1rem',
                background: 'white',
                color: 'primary.main',
                boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'rgba(255,255,255,0.95)',
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 32px rgba(0,0,0,0.3)',
                },
              }}
            >
              Войти
            </Button>
            
            <Box
              sx={{
                mt: 6,
                maxWidth: 600,
                mx: 'auto',
                px: 3,
                py: 3,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                borderRadius: 3,
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <Typography 
                variant="body2" 
                sx={{
                  color: 'white',
                  opacity: 0.95,
                  textAlign: 'center',
                  lineHeight: 1.8,
                  fontSize: { xs: '0.875rem', sm: '0.9375rem' },
                }}
              >
                🔒 <strong>Ваши данные в безопасности</strong>
                <br />
                <br />
                Наше приложение <strong>не передает ваши данные никому</strong>. 
                Авторизация требуется только для получения подробной статистики из вашего профиля Anixart.
                <br />
                <br />
                Проект с <strong>открытым исходным кодом</strong> — вы можете сами убедиться, 
                что мы ничего не собираем и не передаем третьим лицам.
                <br />
                <br />
                <Box
                  component="a"
                  href="https://github.com/velioname/anixart-year-end-results"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: 'white',
                    textDecoration: 'underline',
                    fontWeight: 500,
                    '&:hover': {
                      opacity: 0.8,
                    },
                  }}
                >
                  Посмотреть исходный код на GitHub →
                </Box>
              </Typography>
            </Box>
          </Box>
        </Box>
      ) : (
        <>
          <WrappedViewer 
            onLogout={handleLogout} 
            onOpenSettings={() => setThemeSettingsOpen(true)}
          />
        </>
      )}

      <LoginDialog
        open={loginDialogOpen}
        onClose={() => setLoginDialogOpen(false)}
        onSuccess={handleLoginSuccess}
      />

      <ThemeSettings
        open={themeSettingsOpen}
        onClose={() => setThemeSettingsOpen(false)}
        colorScheme={colorScheme}
        colorPalette={colorPalette}
        onColorSchemeChange={handleColorSchemeChange}
        onColorPaletteChange={handleColorPaletteChange}
      />

      {isAuthenticated && <Footer />}
    </ThemeProvider>
  );
}

