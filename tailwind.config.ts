import type { Config } from 'tailwindcss'
import TailwindThemer from 'tailwindcss-themer'

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { default: flattenColorPalette } = require('tailwindcss/lib/util/flattenColorPalette')

const { colors, keyframes, animation } = {
  colors: {
    darkGrey: '#333333',
    'text-neutral': '#999999',
  },
  keyframes: {
    loading: {
      '0%': {
        'background-position': '200% 0'
      },
      '50%': {
        'background-position': '0% 0'
      },
      '100%': {
        'background-position': '-200% 0'
      }
    },
    spinY: {
      '0%': {
        transform: 'rotateY(0deg)'
      },
      '100%': {
        transform: 'rotateY(360deg)'
      }
    },
    aurora: {
      from: {
        backgroundPosition: "50% 50%, 50% 50%",
      },
      to: {
        backgroundPosition: "350% 50%, 350% 50%",
      },
    },
  },
  animation: {
    'spin-slow': 'spin 2s linear infinite',
    loading: 'loading 5s ease-in-out infinite',
    'spin-y': 'spinY 5s ease-in-out infinite',
    aurora: "aurora 60s linear infinite",
  }
} satisfies Config['theme']


// This plugin adds each Tailwind color as a global CSS variable, e.g. var(--gray-200).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const addVariablesForColors = ({ addBase, theme }: any) => {
  const allColors = flattenColorPalette(theme('colors'))
  const newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ":root": newVars,
  });
}

export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}'
  ],
  darkMode: 'class',
  important: true,
  future: { hoverOnlyWhenSupported: true },
  theme: {
    transparent: 'transparent',
    current: 'currentColor',
    extend: {
      colors,
      animation,
      keyframes
    }
  },
  plugins: [
    TailwindThemer({
      themes: [
        {
          name: 'light',
          extend: {
            colors: {
              text: '#000000',
              neutral: '#ffffff',
              grey: '#E4E4E7',
              navItem: '#b4b4b4'
            }
          }
        },
        {
          name: 'dark',
          extend: {
            colors: {
              text: '#ffffff',
              neutral: '#333333',
              grey: '#71717A',
              navItem: '#94a3b822'
            }
          }
        }
      ]
    }),
    addVariablesForColors
  ]
} satisfies Config