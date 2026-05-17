import { createTheme } from '@mui/material';
import { T_Theme } from '../../types';

export function useMUITheme(t: T_Theme) {
  
  if (!t) return;
 
  // Helper to get color string from string or { main: string }
  const getColor = (val: any, fallback: string = '#1976d2') => {
    if (typeof val === 'string') return val;
    if (val && typeof val.main === 'string') return val.main;
    if (val && typeof val.base === 'string') return val.base;
    if (val && typeof val.primary === 'string') return val.primary;
    return fallback;
  };
  
  const headingFont = t?.typography?.heading?.join(', ') || 'Cormorant Garamond, Fraunces, serif';
  const bodyFont = t?.typography?.body?.join(', ') || 'Cormorant Garamond, Fraunces, serif';
  // Increase all font sizes by 15%
  const scale = 1.15;
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
      primary: { main: getColor(t.primary) },
      secondary: { main: getColor(t.secondary) },
      background: {
        default: getColor(t.background),
        paper: getColor(t.paper, '#FFF'),
      },
      text: {
        primary: getColor(t.text, '#000'),
        secondary: getColor(t.secondary ?? t.primary),
      },
      // border is not a standard palette property; use only in component overrides
    },
    typography: {
      fontSize: scaleSize(20) as number,
      fontFamily: bodyFont,
      h1: { fontSize: scaleSize('5rem'), fontWeight: 600, fontFamily: headingFont },
      h2: { fontSize: scaleSize('4rem'), fontWeight: 600, fontFamily: headingFont },
      h3: { fontSize: scaleSize('3rem'), fontWeight: 600, fontFamily: headingFont },
      h4: { fontSize: scaleSize('2.5rem'), fontWeight: 600, fontFamily: headingFont },
      h5: { fontSize: scaleSize('2rem'), fontWeight: 600, fontFamily: headingFont },
      h6: { fontSize: scaleSize('1.5rem'), fontWeight: 600, fontFamily: headingFont },
      body1: { fontSize: scaleSize('1.15rem'), fontFamily: bodyFont, fontWeight: 500 },
      body2: { fontSize: scaleSize('1rem'), fontFamily: bodyFont, fontWeight: 500 },
      subtitle1: { fontSize: scaleSize('1.1rem'), color: getColor(t.primary), fontFamily: headingFont, fontWeight: 500 },
      subtitle2: { fontSize: scaleSize('1rem'), color: getColor(t.primary), fontFamily: headingFont, fontWeight: 500 },
      button: { fontSize: scaleSize('1rem'), fontFamily: bodyFont, fontWeight: 600 },
      caption: { fontSize: scaleSize('0.95rem'), fontFamily: bodyFont, fontWeight: 500 },
      overline: { fontSize: scaleSize('0.95rem'), fontFamily: bodyFont, fontWeight: 500 },
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
          h1: { fontWeight: 600 },
          h2: { fontWeight: 600 },
          h3: { fontWeight: 600 },
          h4: { fontWeight: 600 },
          h5: { fontWeight: 600 },
          h6: { fontWeight: 600 },
          subtitle1: { color: getColor(t.primary), fontWeight: 500 },
          subtitle2: { color: getColor(t.primary), fontWeight: 500 },
        },
      },
      MuiFormLabel: {
        styleOverrides: {
          root: { color: getColor(t.primary) },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: { color: getColor(t.primary) },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          notchedOutline: { borderColor: getColor(t.border, getColor(t.primary)) },
        },
      },
      MuiFormHelperText: {
        styleOverrides: {
          root: { color: getColor(t.primary) },
        },
      },
    },
  });
}
