'use client';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Alert,
} from '@mui/material';
import { useState } from 'react';
import { api } from '@/lib/api';

interface LoginDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function LoginDialog({ open, onClose, onSuccess }: LoginDialogProps) {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await api.signIn(login, password);
      onSuccess();
      onClose();
      setLogin('');
      setPassword('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка авторизации');
    } finally {
      setLoading(false);
    }
  };

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
      <form onSubmit={handleSubmit}>
        <DialogTitle 
          sx={{ 
            fontSize: '1.5rem',
            fontWeight: 600,
            pb: 1,
          }}
        >
          Вход в Anixart
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 2,
                borderRadius: 2,
              }}
            >
              {error}
            </Alert>
          )}
          <TextField
            autoFocus
            margin="dense"
            label="Логин"
            type="text"
            fullWidth
            variant="outlined"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            required
            sx={{ 
              mb: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />
          <TextField
            margin="dense"
            label="Пароль"
            type="password"
            fullWidth
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button 
            onClick={onClose}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
            }}
          >
            Отмена
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={loading}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              px: 3,
              fontWeight: 500,
            }}
          >
            {loading ? 'Вход...' : 'Войти'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

