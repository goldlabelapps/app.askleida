"use client";
import React, { useState } from "react";
import {
  Typography,
  Box,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Card,
  CardHeader,
  Avatar,
  CardContent
} from "@mui/material";
import { Icon } from '../../DesignSystem';
import { useDesignSystem } from '../../DesignSystem/hooks/useDesignSystem';

export interface I_SupabaseLogin {
  publicUrl: string;
  onSupabaseLogin?: (email: string, password: string) => void;
  error?: string | null;
}

export default function SupabaseLogin({ publicUrl, onSupabaseLogin, error: externalError }: I_SupabaseLogin) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const designSystem = useDesignSystem();

  function isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail(email) || password.length < 6) {
      setError("Invalid email or password.");
      return;
    }
    setError("");
    if (onSupabaseLogin) onSupabaseLogin(email, password);
  };

  // Use designSystem for siteName and avatar (logo)
  // You can get theme mode from MUI if needed, or default to 'light'
  const themeMode = 'dark'; // Replace with MUI theme if available

  const siteName = designSystem?.config?.siteName || "Sign In";
  const avatarUrl = designSystem?.config?.avatars?.[themeMode] || designSystem?.avatar || '';
  

  return (
    <Box 
      display="flex" 
      alignItems="center" 
      justifyContent="center" 
      minHeight="100vh" 
      sx={{ 
        bgcolor: 'none' 
      }}
    >

      <Card 
        variant="outlined" 
        sx={{ 
          width: 360, 
          maxWidth: '90vw',
        }}>
        <CardHeader
          title={<Typography variant="h6">{siteName}</Typography>}
          avatar={avatarUrl ? (
            <Avatar src={avatarUrl} alt={siteName} />
          ) : (
            <Avatar><Icon icon="user" /></Avatar>
          )}
        />
        <CardContent>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              fullWidth
              required
              margin="normal"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      onClick={() => setShowPassword((show) => !show)}
                      edge="end"
                    >
                      <Icon icon={showPassword ? 'hide' : 'show'} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {(error || externalError) && (
              <Typography color="text.secondary" sx={{ mt: 1 }}>{externalError || error}</Typography>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 2 }}
              endIcon={<Icon icon="signin" />}
            >
              Sign In
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
