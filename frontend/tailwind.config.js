/** @type {import('tailwindcss').Config} */

function withOpacity(variableName) {
  return ({ opacityValue }) => {
    if (opacityValue !== undefined) {
      return `rgb(var(${variableName}) / ${opacityValue})`;
    }
    return `rgb(var(${variableName}))`;
  };
}

export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas:          withOpacity('--canvas-rgb'),
        surface:         withOpacity('--surface-rgb'),
        'surface-2':     withOpacity('--surface-2-rgb'),
        hairline:        withOpacity('--hairline-rgb'),
        accent:          withOpacity('--accent-rgb'),
        'accent-strong': withOpacity('--accent-strong-rgb'),
        danger:          '#EF4444',
        warning:         '#F59E0B',
        info:            '#3B82F6',
        'text-primary':   withOpacity('--text-primary-rgb'),
        'text-secondary': withOpacity('--text-secondary-rgb'),
        'text-tertiary':  withOpacity('--text-tertiary-rgb'),
      },
      fontFamily: {
        sans:  ['"Plus Jakarta Sans"', '"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Outfit"', '"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'in-out-quart': 'cubic-bezier(0.76, 0, 0.24, 1)',
      },
      animation: {
        'fade-in': 'fadeIn 280ms cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-up': 'slideUp 280ms cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
}
