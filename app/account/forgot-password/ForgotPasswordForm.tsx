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

export const ForgotPasswordForm: React.FC = () => {
    const [email, setEmail] = React.useState("");
    const [submitted, setSubmitted] = React.useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: implement password reset logic
        console.log("Reset password for", { email });
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <Alert severity="success">
                <AlertTitle>Check your email</AlertTitle>
                If an account exists for <strong>{email}</strong>, you will receive a password reset link shortly.
            </Alert>
        );
    }

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Alert severity="info">
                <AlertTitle>Forgot Password</AlertTitle>
                Enter your email address and we'll send you a link to reset your password.
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

            <Button type="submit" variant="contained" fullWidth>
                Send Reset Link
            </Button>

            <Link component={NextLink} href="/account/signin" underline="hover">
                Back to Sign In
            </Link>
        </Box>
    );
};
