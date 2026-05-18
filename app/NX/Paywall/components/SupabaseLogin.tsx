"use client";
import React, { useState } from "react";
import { 
  Typography, 
  Box, 
  TextField, 
  Button, 
  InputAdornment, 
  IconButton, 
  Paper,
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
  console.log('config', config);

  function isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail(email) || password.length < 6) {
      setError("Please enter a valid email and password.");
      return;
    }
    setError("");
    if (onSupabaseLogin) onSupabaseLogin(email, password);
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="40vh">
      <Paper elevation={3} sx={{ p: 3, minWidth: 320 }}>
        {/* Millie */}
        <Typography variant="h5" color="textSecondary" align="center" sx={{ mb: 2 }}>
          Only Supabase-authenticated users authed to <b>{publicUrl}</b> can access this url.
        </Typography>
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
            <Typography color="error" sx={{ mt: 1 }}>{externalError || error}</Typography>
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
      </Paper>
    </Box>
  );
}
