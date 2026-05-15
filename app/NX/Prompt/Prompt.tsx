'use client';
import React from 'react';
// import { useRouter } from 'next/navigation';
import {
  Box,
} from '@mui/material';
// import { Icon } from '../DesignSystem';
// import { useDispatch } from '../Uberedux';

export default function Prompt({
  url = null,
}: {
  url?: string | null;
}) {

  return (
    <Box>
      What we aim to do is take a LinkedIn profile and save ourselves the time
      of analysing ourselves by having AI (in this case Google's Gemini) do it for us. 
      
      We're interested in whether the profile belongs to a person who is technical or business-oriented.
      
      This judgement will determine how the app behaves. Paste a LinkedIn profile URL to begin
    </Box>
  );
}
