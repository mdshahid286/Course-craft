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
  			background: '#FCF9F2',
  			foreground: '#2C2B29',
  			sidebar: '#F2EDE4',
        brand: {
          blue: '#1681D0',
          darkBlue: '#05537B',
          peach: '#FEE5D4',
          tan: '#EFEAE1',
          orange: '#FF8A65',
          yellow: '#FFCA28',
          text: '#1B1B1B',
          muted: '#8A8883'
        },
  			card: {
  				DEFAULT: '#FFFFFF',
  				foreground: '#1B1B1B'
  			},
  			border: '#E8E4DB',
  			input: '#E8E4DB',
  			ring: '#1681D0',
  		},
  		borderRadius: {
  			'3xl': '1.5rem',
        '4xl': '2rem',
        '5xl': '2.5rem',
        '6xl': '3rem',
  			lg: '1rem',
  			md: '0.75rem',
  			sm: '0.5rem'
  		},
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      }
  	}
  },
  plugins: [tailwindcssAnimate],
}
