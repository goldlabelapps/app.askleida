"use client";
import React, { useState } from "react";
import Image from 'next/image';
import {
  IconButton,
} from '@mui/material';
import { 
  Icon,
  useDesignSystem
} from '../../NX/DesignSystem';

export interface I_Signin {
  publicUrl: string;
  onSignin?: (email: string, password: string) => void;
  error?: string | null;
}

export default function Signin({ publicUrl, onSignin, error: externalError }: I_Signin) {
  void publicUrl;
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
    if (onSignin) onSignin(email, password);
  };

  // Use designSystem for siteName and avatar (logo)
  // You can get theme mode from MUI if needed, or default to 'light'
  const themeMode = 'dark'; // Replace with MUI theme if available

  const siteName = designSystem?.config?.siteName || "Sign In";
  const avatarUrl = designSystem?.config?.avatars?.[themeMode] || designSystem?.avatar || '';
  

  return (
    <section className="hero" aria-label="Sign in">
      <div className="wrap">
        <div className="waitlist glass-strong signin-card">
          <div className="signin-avatar-wrap">
              <a href="https://askleida.com" className="logo-link">
                <Image
                    src={`/askleida/svg/logo-dark.svg`}
                    alt="Leida"
                    width={110}
                    height={22}
                    className="logo" />
            </a>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="field signin-field">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                autoComplete="email"
                required
              />
            </div>

            <div className="field">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                autoComplete="current-password"
                required
              />
              <IconButton
                onClick={() => setShowPassword((show) => !show)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="signin-password-toggle"
                size="small"
                disableRipple
              >

                <Icon icon={showPassword ? 'hide' : 'show'} />
              </IconButton>
            </div>

            <button type="submit" className="btn btn-primary signin-submit">
              Sign In
              <span className="arrow">
                <Icon icon="signin" />
              </span>
            </button>
          </form>

          <div className={`waitlist-error ${error || externalError ? 'show' : ''}`}>
            {externalError || error}
          </div>
        </div>
      </div>
    </section>
  );
}
