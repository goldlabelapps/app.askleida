import { createTheme } from '@mui/material';
import { T_Theme } from '../../types';

export function useMUITheme(t: T_Theme) {
  
  if (!t) return;
 
  const getMain = (val: any, fallback: string = '#1976d2') => {
    if (typeof val === 'string') return val;
    if (val && typeof val.main === 'string') return val.main;
    return fallback;
  };

  
  
  const headingFont = t?.typography?.heading?.join(', ') || 'Cormorant Garamond, Fraunces, serif';
  const bodyFont = t?.typography?.body?.join(', ') || 'Inter, sans-serif';
  // Increase all font sizes by 25%
  const scale = 1.25;
  function scaleSize(size: string | number): string | number {
    if (typeof size === 'string' && size.endsWith('rem')) {
      const num = parseFloat(size);
      return (num * scale) + 'rem';
    }
    if (typeof size === 'number') {
      return size * scale;
    }
    return size;
  }
  return createTheme({
    palette: {
      mode: (t.mode as 'light' | 'dark') ?? 'light',
      primary: { main: getMain(t.primary) },
      secondary: { main: getMain(t.secondary) },
      background: {
        default: typeof t.background === 'string' ? t.background : t.background?.base,
        paper: t.paper,
      },
      text: {
        primary: typeof t.text === 'string' ? t.text : t.text?.primary,
        secondary:
          typeof t.text === 'string'
            ? (typeof t.primary === 'string' ? t.primary : t.primary?.main)
            : t.text?.secondary,
      },
    },
    typography: {
      fontSize: scaleSize(20) as number,
      fontFamily: bodyFont,
      h1: { fontSize: scaleSize('5rem'), fontWeight: 'normal', fontFamily: headingFont },
      h2: { fontSize: scaleSize('4rem'), fontWeight: 'normal', fontFamily: headingFont },
      h3: { fontSize: scaleSize('3rem'), fontWeight: 'normal', fontFamily: headingFont },
      h4: { fontSize: scaleSize('2.5rem'), fontWeight: 'normal', fontFamily: headingFont },
      h5: { fontSize: scaleSize('2rem'), fontWeight: 'normal', fontFamily: headingFont },
      h6: { fontSize: scaleSize('1.5rem'), fontWeight: 'normal', fontFamily: headingFont },
      body1: { fontSize: scaleSize('1.15rem'), fontFamily: bodyFont },
      body2: { fontSize: scaleSize('1rem'), fontFamily: bodyFont },
      subtitle1: { fontSize: scaleSize('1.1rem'), color: getMain(t.primary), fontFamily: headingFont },
      subtitle2: { fontSize: scaleSize('1rem'), color: getMain(t.primary), fontFamily: headingFont },
      button: { fontSize: scaleSize('1rem'), fontFamily: bodyFont },
      caption: { fontSize: scaleSize('0.95rem'), fontFamily: bodyFont },
      overline: { fontSize: scaleSize('0.95rem'), fontFamily: bodyFont },
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
          subtitle1: { color: typeof t.primary === 'string' ? t.primary : t.primary?.main },
          subtitle2: { color: typeof t.primary === 'string' ? t.primary : t.primary?.main },
        },
      },
      MuiFormLabel: {
        styleOverrides: {
          root: { color: typeof t.primary === 'string' ? t.primary : t.primary?.main },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: { color: typeof t.primary === 'string' ? t.primary : t.primary?.main },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          notchedOutline: { borderColor: typeof t.primary === 'string' ? t.primary : t.primary?.main },
        },
      },
      MuiFormHelperText: {
        styleOverrides: {
          root: { color: typeof t.primary === 'string' ? t.primary : t.primary?.main },
        },
      },
    },
  });
}
