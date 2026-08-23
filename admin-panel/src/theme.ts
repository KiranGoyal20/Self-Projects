import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react'

const config = defineConfig({
  theme: {
    tokens: {
      fonts: {
        heading: { value: '"DM Sans", "Segoe UI", sans-serif' },
        body: { value: '"DM Sans", "Segoe UI", sans-serif' },
      },
      colors: {
        brand: {
          50: { value: '#eef6f5' },
          100: { value: '#d5ebe8' },
          200: { value: '#a9d6d0' },
          300: { value: '#74bab2' },
          400: { value: '#3f9a90' },
          500: { value: '#0d9488' },
          600: { value: '#0a7a70' },
          700: { value: '#086058' },
          800: { value: '#064740' },
          900: { value: '#042e2a' },
        },
        navy: {
          700: { value: '#1e3a5f' },
          800: { value: '#172f4d' },
          900: { value: '#13253f' },
        },
      },
    },
  },
})

export const system = createSystem(defaultConfig, config)

export const DRAWER_WIDTH = '260px'
