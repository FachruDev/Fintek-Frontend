export const Routes = {
  onboarding: '/onboarding',
  login: '/(auth)/login',
  register: '/(auth)/register',
  verifyOtp: '/(auth)/verify-otp',
  home: '/(tabs)/summary',
} as const;

export type AppRoute = (typeof Routes)[keyof typeof Routes];

