export const COLORS = {
  primary: '#000666',
  primaryContainer: '#1a237e',
  primaryLight: '#e0e0ff',
  primaryFaint: 'rgba(0,6,102,0.05)',
  secondary: '#9f4200',
  secondaryLight: '#ffdbcb',
  onSurface: '#1a1c1c',
  onSurfaceVariant: '#454652',
  outline: '#767683',
  outlineVariant: '#c6c5d4',
  surface: '#f9f9f9',
  surfaceContainer: '#f3f3f3',
  surfaceContainerHigh: '#eeeeee',
  surfaceContainerHighest: '#e2e2e2',
  white: '#ffffff',
  success: '#22c55e',
  error: '#dc2626',
  warning: '#d97706',
  info: '#1a237e',
  gradient: 'linear-gradient(135deg, #000666, #1a237e)',
  gradientOrange: '#fd6c00',
} as const;

export const API_PATHS = {
  locations: '/locations',
  users: '/users',
  bookings: '/bookings',
  payouts: '/payouts',
  claims: '/claims',
  errorLogs: '/error-logs',
  financials: '/financials',
  reviews: '/reviews',
  staff: '/staff',
} as const;

export const PAGE_SIZE = {
  users: 10,
  transactions: 15,
  claims: 20,
  errors: 25,
  bookings: 200,
  stores: 50,
} as const;
