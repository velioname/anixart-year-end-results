'use client';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,
  FormControlLabel,
  Box,
  Typography,
} from '@mui/material';
import { ColorScheme, ColorPalette } from '@/lib/theme';

interface ThemeSettingsProps {
  open: boolean;
  onClose: () => void;
  colorScheme: ColorScheme;
  colorPalette: ColorPalette;
  onColorSchemeChange: (scheme: ColorScheme) => void;
  onColorPaletteChange: (palette: ColorPalette) => void;
}

export default function ThemeSettings({
  open,
  onClose,
  colorScheme,
  colorPalette,
  onColorSchemeChange,
  onColorPaletteChange,
}: ThemeSettingsProps) {
  const colorPalettes: { value: ColorPalette; label: string; color: string }[] = [
    { value: 'default', label: 'По умолчанию', color: '#6750A4' },
    { value: 'blue', label: 'Синий', color: '#1976d2' },
    { value: 'purple', label: 'Фиолетовый', color: '#9c27b0' },
    { value: 'green', label: 'Зелёный', color: '#2e7d32' },
    { value: 'orange', label: 'Оранжевый', color: '#ed6c02' },
    { value: 'red', label: 'Красный', color: '#d32f2f' },
  ];

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.2)',
        },
      }}
    >
      <DialogTitle
        sx={{
          fontSize: '1.5rem',
          fontWeight: 600,
          pb: 1,
        }}
      >
        Настройки темы
      </DialogTitle>
      <DialogContent>
        <FormControl component="fieldset" sx={{ mb: 4, width: '100%' }}>
          <FormLabel component="legend">Цветовая схема</FormLabel>
          <RadioGroup
            value={colorScheme}
            onChange={(e) => onColorSchemeChange(e.target.value as ColorScheme)}
          >
            <FormControlLabel value="auto" control={<Radio />} label="Автоматическая" />
            <FormControlLabel value="light" control={<Radio />} label="Светлая" />
            <FormControlLabel value="dark" control={<Radio />} label="Тёмная" />
          </RadioGroup>
        </FormControl>

        <FormControl component="fieldset" sx={{ width: '100%' }}>
          <FormLabel component="legend">Цветовая палитра</FormLabel>
          <RadioGroup
            value={colorPalette}
            onChange={(e) => onColorPaletteChange(e.target.value as ColorPalette)}
          >
            {colorPalettes.map((palette) => (
              <FormControlLabel
                key={palette.value}
                value={palette.value}
                control={<Radio />}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        backgroundColor: palette.color,
                        border: '1px solid',
                        borderColor: 'divider',
                      }}
                    />
                    <Typography>{palette.label}</Typography>
                  </Box>
                }
              />
            ))}
          </RadioGroup>
        </FormControl>
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 2 }}>
        <Button 
          onClick={onClose}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            px: 3,
            fontWeight: 500,
          }}
        >
          Закрыть
        </Button>
      </DialogActions>
    </Dialog>
  );
}

