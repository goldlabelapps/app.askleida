"use client";
import React from "react";
import {
    Alert,
    AlertTitle,
    Box,
    Button,
    Link,
    TextField,
    Typography,
} from '@mui/material';
import NextLink from 'next/link';

export const SignInForm: React.FC = () => {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: implement sign-in logic
        console.log("Sign in", { email });
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Alert severity="info">
                <AlertTitle>Sign In</AlertTitle>
                Enter your credentials to access your account.
            </Alert>

            <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                fullWidth
                autoComplete="email"
            />

            <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                fullWidth
                autoComplete="current-password"
            />

            <Button type="submit" variant="contained" fullWidth>
                Sign In
            </Button>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
                <Link component={NextLink} href="/account/forgot-password" underline="hover">
                    Forgot password?
                </Link>
                <Link component={NextLink} href="/account/register" underline="hover">
                    Create an account
                </Link>
            </Box>
        </Box>
    );
};
