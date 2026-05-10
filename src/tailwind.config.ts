import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'sans-serif'] },
      colors: {
        brand: {
          DEFAULT: '#10a37f',
          dark:    '#0d8f6f',
          light:   '#ecfdf5',
        },
      },
    },
  },
  plugins: [],
}
export default config
