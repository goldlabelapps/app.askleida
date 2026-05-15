import { createTheme } from '@mui/material';
import { T_Theme } from '../../types';

export function useMUITheme(t: T_Theme) {
  if (!t) return;
  // Support both string and object for t.primary, t.secondary, t.background, t.text
  const getMain = (val: any, fallback: string = '#1976d2') => {
    if (typeof val === 'string') return val;
    if (val && typeof val.main === 'string') return val.main;
    return fallback;
  };
  // Typography fontFamily from config (typography.heading, typography.body)
  // If t.typography exists, use it for fontFamily
  const headingFont = t?.typography?.heading?.join(', ') || 'Cormorant Garamond, Fraunces, serif';
  const bodyFont = t?.typography?.body?.join(', ') || 'Inter, sans-serif';
  return createTheme({
    palette: {
      mode: (t.mode as 'light' | 'dark') ?? 'light',
      primary: { main: getMain(t.primary) },
      secondary: { main: getMain(t.secondary) },
      success: { main: getMain(t.background) },
      info: { main: getMain(t.text, '#1976d2') },
      // warning: { main: getMain(t.background) },
      // error: { main: getMain(t.background) },
      // divider: t.border,
      background: {
        default: typeof t.background === 'string' ? t.background : t.background?.base,
        paper: t.paper,
      },
      text: {
        primary: typeof t.text === 'string' ? t.text : t.text?.primary,
        secondary: typeof t.text === 'string' ? t.primary : t.text?.secondary,
      },
    },
    typography: {
      fontSize: 18, // base font size (default is 14)
      fontFamily: bodyFont,
      h1: { fontSize: '5rem', fontWeight: 'normal', fontFamily: headingFont },
      h2: { fontSize: '4rem', fontWeight: 'normal', fontFamily: headingFont },
      h3: { fontSize: '3rem', fontWeight: 'normal', fontFamily: headingFont },
      h4: { fontSize: '2.5rem', fontWeight: 'normal', fontFamily: headingFont },
      h5: { fontSize: '2rem', fontWeight: 'normal', fontFamily: headingFont },
      h6: { fontSize: '1.5rem', fontWeight: 'normal', fontFamily: headingFont },
      body1: { fontSize: '1.15rem', fontFamily: bodyFont },
      body2: { fontSize: '1rem', fontFamily: bodyFont },
      subtitle1: { fontSize: '1.1rem', color: getMain(t.primary), fontFamily: headingFont },
      subtitle2: { fontSize: '1rem', color: getMain(t.primary), fontFamily: headingFont },
      button: { fontSize: '1rem', fontFamily: bodyFont },
      caption: { fontSize: '0.95rem', fontFamily: bodyFont },
      overline: { fontSize: '0.95rem', fontFamily: bodyFont },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: 'none',
          },
          containedPrimary: {
            fontWeight: 'bold',
            boxShadow: 'none',
          },
        },
      },
      MuiTypography: {
        styleOverrides: {
          h1: { fontWeight: "normal" },
          h2: { fontWeight: "normal" },
          h3: { fontWeight: "normal" },
          h4: { fontWeight: "normal" },
          h5: { fontWeight: "normal" },
          h6: { fontWeight: "normal" },
          subtitle1: { color: t.primary },
          subtitle2: { color: t.primary },
        },
      },
      MuiFormLabel: {
        styleOverrides: {
          root: { color: t.primary },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: { color: t.primary },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          notchedOutline: { borderColor: t.primary },
        },
      },
      MuiFormHelperText: {
        styleOverrides: {
          root: { color: t.primary },
        },
      },
    },
  });
}
