/**
 * Design Tokens for Liimra E-commerce
 * Centralized design system values for consistent UI/UX
 */

export const designTokens = {
  // Color Palette - Healthcare Clean Aesthetic
  colors: {
    primary: {
      forest: 'hsl(152 45% 25%)',
      forestLight: 'hsl(152 35% 35%)',
    },
    neutral: {
      cream: 'hsl(45 30% 97%)',
      creamDark: 'hsl(45 25% 92%)',
      sage: 'hsl(150 20% 75%)',
      sageLight: 'hsl(150 15% 90%)',
    },
    accent: {
      terracotta: 'hsl(25 65% 55%)',
      terracottaLight: 'hsl(25 55% 70%)',
      gold: 'hsl(42 75% 55%)',
    },
  },

  // Typography Scale
  typography: {
    fontFamily: {
      display: "'Cormorant Garamond', serif",
      body: "'DM Sans', sans-serif",
    },
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem',    // 48px
      '6xl': '3.75rem', // 60px
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75',
    },
  },

  // Spacing - Generous "Breathing Room"
  spacing: {
    xs: '0.5rem',    // 8px
    sm: '1rem',      // 16px
    md: '1.5rem',    // 24px
    lg: '2rem',      // 32px
    xl: '3rem',      // 48px
    '2xl': '4rem',   // 64px
    '3xl': '6rem',   // 96px
    '4xl': '8rem',   // 128px
  },

  // Border Radius - Soft, Approachable
  borderRadius: {
    sm: '0.5rem',    // 8px
    md: '0.75rem',   // 12px
    lg: '1rem',      // 16px
    xl: '1.5rem',    // 24px
    '2xl': '2rem',   // 32px
    full: '9999px',
  },

  // Shadows - Subtle Depth
  shadows: {
    soft: '0 4px 20px -4px hsl(150 25% 15% / 0.08)',
    medium: '0 8px 30px -8px hsl(150 25% 15% / 0.12)',
    glow: '0 0 40px hsl(152 45% 25% / 0.15)',
  },

  // Animation Timing
  animation: {
    duration: {
      fast: '200ms',
      normal: '400ms',
      slow: '600ms',
      slower: '1000ms',
    },
    easing: {
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    },
  },

  // Z-Index Layers
  zIndex: {
    base: 0,
    dropdown: 10,
    sticky: 20,
    overlay: 30,
    modal: 40,
    tooltip: 50,
    toast: 60,
  },

  // Breakpoints (matches Tailwind defaults)
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // 3D Specific Settings
  threeDimensions: {
    fov: 45, // Field of view for camera
    near: 0.1,
    far: 1000,
    cameraPosition: {
      x: 0,
      y: 0,
      z: 5,
    },
    lightIntensity: {
      ambient: 0.6,
      directional: 0.8,
      spotlight: 1.2,
    },
  },
} as const;

export type DesignTokens = typeof designTokens;
