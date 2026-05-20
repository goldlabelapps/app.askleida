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
import { Icon, useConfig } from '../../DesignSystem';

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
  const config = useConfig();

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

  // Use config for siteName and avatar (logo)
  const siteName = config?.siteName || "Sign In";
  const avatarUrl = config?.avatars?.light || config?.avatars?.dark || null;

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
          avatar={avatarUrl ? (
            <Avatar src={avatarUrl} alt={siteName} />
          ) : (
            <Avatar><Icon icon="user" /></Avatar>
          )}
          title={siteName}
          subheader={"Hi, please sign in"}
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
