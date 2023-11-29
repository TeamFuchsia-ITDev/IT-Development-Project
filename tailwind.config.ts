import type { Config } from 'tailwindcss'

const defaultTheme = require('tailwindcss/defaultTheme')

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      fontFamily: {
        sans: ['Inter var', 'sans-serif'],
      },
      Screens: {
        'xsm' : '280px',

        ...defaultTheme.screens,
      }
    },
  },
  plugins: [
	require("@tailwindcss/forms"),

  ],
  variants: {
    extend: {
      // ...
      translate: ['hover'], // Enable translate variant for hover
    },
  },
}
export default config
