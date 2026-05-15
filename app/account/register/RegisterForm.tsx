"use client";
import React from "react";
import {
    Alert,
    AlertTitle,
    Box,
    Button,
    Link,
    TextField,
} from '@mui/material';
import NextLink from 'next/link';

export const RegisterForm: React.FC = () => {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [confirm, setConfirm] = React.useState("");
    const [error, setError] = React.useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirm) {
            setError("Passwords do not match.");
            return;
        }
        setError("");
        // TODO: implement registration logic
        console.log("Register", { email });
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Alert severity="info">
                <AlertTitle>Create an Account</AlertTitle>
                Fill in the details below to get started.
            </Alert>

            {error && (
                <Alert severity="error">{error}</Alert>
            )}

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
                autoComplete="new-password"
            />

            <TextField
                label="Confirm Password"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                fullWidth
                autoComplete="new-password"
            />

            <Button type="submit" variant="contained" fullWidth>
                Create Account
            </Button>

            <Link component={NextLink} href="/account/signin" underline="hover">
                Already have an account? Sign in
            </Link>
        </Box>
    );
};
