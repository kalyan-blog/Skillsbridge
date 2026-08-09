import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#7c3aed', // Violet
        secondary: '#3b82f6', // Blue
        accent: '#ec4899', // Pink
        indigo: '#4f46e5',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #3b82f6 0%, #7c3aed 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)',
        'gradient-accent': 'linear-gradient(135deg, #3b82f6 0%, #ec4899 100%)',
      }
    },
  },
  plugins: [],
} satisfies Config
