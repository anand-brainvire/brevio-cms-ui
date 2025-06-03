/** @type {import('tailwindcss').Config} */
module.exports = {
  future: {
    purgeLayersByDefault: true,
    applyComplexClasses: true
  },
  experimental: {
    // to make space-x-6 and other complicated classes
    // available when using with @apply
    applyComplexClasses: true
  },
  purge: {
    layers: ['base', 'utilities', '30', '40'],
    content: [
      './src/layout/**/*.{js,ts,jsx,tsx}',
      './src/components/**/*.{js,ts,jsx,tsx}',
      './src/views/**/*.{js,ts,jsx,tsx}',
    ],
    options: {
      whitelist: ['zoom-open'],
      safelist: {
        standard: ['outline-none']
      }
    }
  },
  theme: {
    extend: {
      minWidth: {
        'wide-1': '3.125rem',
        'wide-2': '11.25rem',
        'wide-3': '12.5rem',
        'wide-4': '31.25rem',
        'wide-5': '52.5rem',
      },
      maxWidth: {
        'wide-1': '12.5rem',
        'wide-2': '31.25rem',
        'wide-3': '33.75rem',
        'wide-4': '49.75rem',
        'table-wide-1': 'calc(100vw - 1.813rem)',
        'table-wide-2': 'cal(100vw-4.188rem)',
        'table-wide-3': 'calc(100vw - 15.625rem)',
        'table-wide-4': 'cal(100vw-16.688rem)',
      },
      maxHeight: {
        'rise-1': '31.25rem',
      },
      fontFamily: {
        primary: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji', 'sans-serif']
      },
      colors: {
        primary: '#bb3f42',
        secondary: '#d9d51c',
        warning: '#ffc107',
        default: '#c8ced3',
        info: '#28d3cd',
        error: '#e0141e',
        'success': '#4dbd74',
        'danger': '#f86c6b',
        'base-font-1': '#73818f',
        'base-font-2': '#23282c',
        'base-font-3': '#6c757d',
        'base-font-4': '#5c6873',
        'base-font-5': '#ffa200',
        'bg-1': '#efefef',
        'bg-2': '#d8eaff',
        'bg-3': '#e4e5e6',
        'bg-4': '#2f353a',
        'bg-5': '#f8faff',
        'bg-6': '#aaaaaa',
        'bg-7': '#999999',
        'bg-8': '#262a2e',
        'bg-9': '#24282c',
        'b-color-1': '#e4e7ea',
        'b-color-2': '#b8b8b8',
        'b-color-3': '#767676',
        'b-color-4': '#c8ced3',
      },
      width: {
        'wide-1': '1.125rem',
        'wide-2': '1.875rem',
        'wide-3': '3.125rem',
        'wide-4': '4.75rem',
        'wide-5': '6.25rem',
        'wide-6': '9.375rem',
        'wide-7': '9.75rem',
        'wide-8': '12.5rem',
        'wide-9': '15.625rem',
        'wide-10': '50rem',
        'wide-11': 'calc(100% + 0.625rem)',
        'wide-12': 'calc(100% - 0.375rem)',
        'wide-13': '4vw',
      },
      height: {
        'rise-1': '1.125rem',
        'rise-2': '1.375rem',
        'rise-3': '1.875rem',
        'rise-4': '3.125rem',
        'rise-5': '6.25rem',
        'rise-6': '9.375rem',
        'rise-7': '12.5rem',
        'rise-8': 'calc(100% - 3.438rem)',
      },
      lineHeight: {
        '0': '0',
        'sm': '0.875rem',
        'md': '2.75rem',
        'lg': '3rem',
        'xl': '3.25rem',
      },
      fontSize: {
        'span-sm': '0.625rem',
        'h1': '2.625rem',
        'h2': '2.125rem',
        'h3': '1.375rem',
      },
      spacing: {
        'sidebar-space': '12.5rem',
        'l-1': '3.125rem',

      },
      borderWidth: {
        'thick-1': '0.313rem',
      },
      boxShadow: {
        'shadow-1': '0 0 0.188rem 0.063rem #bb3f42',
      },
      zIndex: {
        'level-1': '111',
      },
      margin: {
        '1px': '0.0625rem'
      },
      keyframes: {
        'fade-in': {
          '0%': {
            transform: 'translateY(-50%)'
          },

          '100%': {
            transform: 'translateY(0%)'
          }
        },
        'fade-out': {
          '0%': {
            transform: 'translateY(0%)'
          },

          '100%': {
            transform: 'translateY(-50%)'
          }
        }


      },
      animation: {
        'fade-in': 'fade-in 1s',
        'fade-out': 'fade-out 1s'
      }

    },
  },
  plugins: [],
}
