import { nativeWindTheme } from '@hausy/design-tokens';

export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', '../../packages/ui/src/**/*.{ts,tsx}'],
  theme: {
    extend: nativeWindTheme,
  },
};
