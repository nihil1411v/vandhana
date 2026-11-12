/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'deep-black': '#000000',
        'rich-black': '#0a0005',
        'dark-maroon': '#0f0008',
        'deep-red': '#8b0000',
        'crimson': '#c41e3a',
        'rose-glow': '#ff2244',
        'soft-white': '#fff8f8',
        'muted-rose': '#d4a0a0',
        'dark-rose': '#3a0a20',
        'midnight': '#1a0010',
      },
      fontFamily: {
        'cormorant': ['Cormorant Garamond', 'serif'],
        'cinzel': ['Cinzel', 'serif'],
      },
      animation: {
        'heartbeat': 'heartbeat 1s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 1.5s ease-in-out infinite',
        'float-up': 'float-up 3s ease-in-out infinite',
        'flicker': 'flicker 4s ease-in-out infinite',
      },
      keyframes: {
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '15%': { transform: 'scale(1.08)' },
          '30%': { transform: 'scale(1)' },
          '45%': { transform: 'scale(1.05)' },
          '60%': { transform: 'scale(1)' },
        },
        'glow-pulse': {
          '0%, 100%': { filter: 'drop-shadow(0 0 20px rgba(180,0,50,0.5))' },
          '50%': { filter: 'drop-shadow(0 0 60px rgba(220,0,80,0.9))' },
        },
        'float-up': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        flicker: {
          '0%, 100%': { opacity: '0.8' },
          '50%': { opacity: '0.4' },
          '75%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
