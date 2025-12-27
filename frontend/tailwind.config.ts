import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0080FF',
          light: '#3D9EFF',
          dark: '#0066CC',
        },
        secondary: {
          DEFAULT: '#00FFFF',
          light: '#66FFFF',
          dark: '#00CCCC',
        },
        accent: {
          DEFAULT: '#FF1493',
          light: '#FF66B2',
          dark: '#CC1076',
        },
        success: '#05FFA1',
        warning: '#FFB800',
        error: '#FF3B5C',
        background: '#F8FAFC',
        surface: '#FFFFFF',
        glass: {
          light: 'rgba(255, 255, 255, 0.1)',
          DEFAULT: 'rgba(255, 255, 255, 0.15)',
          dark: 'rgba(255, 255, 255, 0.05)',
        },
        text: {
          primary: '#0F172A',
          secondary: '#475569',
          muted: '#64748B',
        },
        border: {
          DEFAULT: '#E2E8F0',
          light: '#F1F5F9',
          dark: '#CBD5E1',
          glass: 'rgba(255, 255, 255, 0.2)',
        },
      },
      fontFamily: {
        heading: ['Lexend', 'Poppins', 'sans-serif'],
        body: ['Inter', 'Source Sans 3', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-aurora': 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%)',
        'gradient-premium': 'linear-gradient(135deg, #0080FF 0%, #00FFFF 50%, #FF1493 100%)',
        'gradient-crypto': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        'premium': '0 20px 60px -15px rgba(0, 128, 255, 0.3)',
        'glow': '0 0 20px rgba(0, 128, 255, 0.5)',
        'glow-accent': '0 0 20px rgba(255, 20, 147, 0.5)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': {
            boxShadow: '0 0 20px rgba(0, 128, 255, 0.4)',
          },
          '50%': {
            boxShadow: '0 0 40px rgba(0, 128, 255, 0.8)',
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
