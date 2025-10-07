import type { Config } from 'tailwindcss'; // これも通常は自動で追加されているはず

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'noto-sans-jp': ['var(--font-noto-sans-jp)', 'Noto Sans JP', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        'main': ['var(--font-noto-sans-jp)', 'Noto Sans JP', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'slide-infinite': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        // HeroSection で使っている animate-scroll-bounce も追加するならここに
        'scroll-bounce': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(8px)' },
        },
      },
      animation: {
        'slide-infinite': 'slide-infinite 20s linear infinite',
        'scroll-bounce': 'scroll-bounce 1.5s infinite',
      },
    },
  },
  plugins: [],
};

export default config; // export default でエクスポート