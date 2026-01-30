/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'neon': {
          cyan: '#00f5ff',
          magenta: '#ff00ff',
          yellow: '#ffff00',
          green: '#39ff14',
          orange: '#ff6b35',
          pink: '#ff1493',
          purple: '#bf00ff',
        },
        'arena': {
          dark: '#0a0a0f',
          darker: '#050508',
          card: '#12121a',
          border: '#1e1e2e',
        }
      },
      fontFamily: {
        'display': ['Orbitron', 'sans-serif'],
        'body': ['Rajdhani', 'sans-serif'],
      },
      animation: {
        'pulse-neon': 'pulse-neon 2s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
        'shake': 'shake 0.5s ease-in-out',
        'slide-up': 'slide-up 0.5s ease-out',
        'countdown': 'countdown 1s ease-out',
        'score-pop': 'score-pop 0.4s ease-out',
        'correct': 'correct 0.6s ease-out',
        'wrong': 'wrong 0.6s ease-out',
        'gradient-x': 'gradient-x 3s ease infinite',
      },
      keyframes: {
        'pulse-neon': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
        'glow': {
          '0%': { boxShadow: '0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor' },
          '100%': { boxShadow: '0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor, 0 0 40px currentColor' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '75%': { transform: 'translateX(5px)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        'countdown': {
          '0%': { transform: 'scale(1.5)', opacity: 0 },
          '50%': { transform: 'scale(1)', opacity: 1 },
          '100%': { transform: 'scale(0.8)', opacity: 0 },
        },
        'score-pop': {
          '0%': { transform: 'scale(0)', opacity: 0 },
          '50%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
        'correct': {
          '0%': { backgroundColor: 'transparent' },
          '50%': { backgroundColor: 'rgba(57, 255, 20, 0.3)' },
          '100%': { backgroundColor: 'rgba(57, 255, 20, 0.1)' },
        },
        'wrong': {
          '0%': { backgroundColor: 'transparent' },
          '50%': { backgroundColor: 'rgba(255, 0, 100, 0.3)' },
          '100%': { backgroundColor: 'rgba(255, 0, 100, 0.1)' },
        },
        'gradient-x': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'grid-pattern': 'linear-gradient(rgba(0,245,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,0.03) 1px, transparent 1px)',
      },
    },
  },
  plugins: [],
}
