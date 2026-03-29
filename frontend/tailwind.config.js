import tailwindcssAnimate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			background: '#09090B',
  			foreground: '#FAFAFA',
  			sidebar: '#000000',
        brand: {
          blue: '#3B82F6',
          darkBlue: '#1D4ED8',
          text: '#FAFAFA',
          muted: '#A1A1AA'
        },
  			card: {
  				DEFAULT: '#18181B',
  				foreground: '#FAFAFA'
  			},
  			border: '#27272A',
  			input: '#27272A',
  			ring: '#3B82F6',
  		},
  		borderRadius: {
  			'3xl': '1rem',
        '4xl': '1.5rem',
        '5xl': '2rem',
        '6xl': '2.5rem',
  			lg: '0.75rem',
  			md: '0.5rem',
  			sm: '0.25rem'
  		},
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'glow-pulse': 'glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'orbit': 'orbit 20s linear infinite',
      },
      keyframes: {
        glow: {
          '0%, 100%': { opacity: 1, filter: 'brightness(1)' },
          '50%': { opacity: 0.8, filter: 'brightness(1.5)' },
        },
        orbit: {
          from: { transform: 'rotate(0deg) translateX(100px) rotate(0deg)' },
          to: { transform: 'rotate(360deg) translateX(100px) rotate(-360deg)' },
        }
      }
  	}
  },
  plugins: [tailwindcssAnimate],
}
