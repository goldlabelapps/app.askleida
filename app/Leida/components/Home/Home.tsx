"use client";
import React from 'react';
import { Typography } from '@mui/material';
import Wrapper from '../UI/Wrapper';

const Home: React.FC = () => {
    return (
        <Wrapper>
            <Typography variant="h6">
                Home
            </Typography>
            <Typography variant="body2" color="text.secondary">
                Placeholder home screen.
            </Typography>
        </Wrapper>
    );
};

export default Home;
