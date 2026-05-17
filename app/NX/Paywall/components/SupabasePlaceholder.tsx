import React from "react";
import { Typography, Box } from "@mui/material";

export default function SupabasePlaceholder({ publicUrl }: { publicUrl: string }) {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="40vh">
      <Typography variant="h5" color="textSecondary" align="center">
        Only Supabase-authenticated users authed to <b>{publicUrl}</b> can access this page.
      </Typography>
    </Box>
  );
}
