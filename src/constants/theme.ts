export const COLORS = {
  // Primary Palette
  bgDark: '#0b0d19',
  bgCard: 'rgba(20, 24, 45, 0.75)',
  bgCardHover: 'rgba(28, 34, 64, 0.85)',
  bgModal: '#121629',
  
  // Accents
  primary: '#00f2fe',      // Cyber Cyan
  secondary: '#7f00ff',    // Neon Purple
  accent: '#00f5d4',       // Emerald Green
  warning: '#ffb703',      // Amber Warning
  danger: '#ff0055',       // Crimson Lock / Restricted
  info: '#4cc9f0',         // Sky Blue
  
  // Text Colors
  textPrimary: '#ffffff',
  textSecondary: '#a0aec0',
  textMuted: '#64748b',
  textActive: '#00f2fe',
  
  // Status Colors
  statusAllowed: '#00f5d4',
  statusRestricted: '#ff0055',
  statusWarning: '#ffb703',
  statusInactive: '#475569',
  
  // Borders & Dividers
  borderSubtle: 'rgba(255, 255, 255, 0.1)',
  borderGlow: 'rgba(0, 242, 254, 0.3)',
  borderActive: '#00f2fe',
  
  // Gradients (Array format for LinearGradient or styled rendering)
  gradientPrimary: ['#00f2fe', '#4facfe'],
  gradientSecondary: ['#7f00ff', '#e100ff'],
  gradientDanger: ['#ff0055', '#ff5050'],
  gradientSuccess: ['#00f5d4', '#00bbf9'],
  gradientCard: ['rgba(255, 255, 255, 0.07)', 'rgba(255, 255, 255, 0.02)'],
  gradientDark: ['#0b0d19', '#14182d'],
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const RADIUS = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 24,
  full: 9999,
};

export const SHADOWS = {
  glowPrimary: {
    shadowColor: '#00f2fe',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  glowDanger: {
    shadowColor: '#ff0055',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  glassCard: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 6,
  },
};

export const FONTS = {
  size: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 18,
    xl: 22,
    xxl: 28,
    display: 36,
  },
  weight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
};
