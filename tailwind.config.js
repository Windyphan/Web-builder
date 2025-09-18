/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class', // Enable class-based dark mode
    theme: {
        extend: {
            colors: {
                // Deep sophisticated primary colors
                primary: {
                    50: '#f0f9ff',
                    100: '#e0f2fe',
                    200: '#bae6fd',
                    300: '#7dd3fc',
                    400: '#38bdf8',
                    500: '#0ea5e9',
                    600: '#0284c7',
                    700: '#0369a1',
                    800: '#075985',
                    900: '#0c4a6e',
                },
                // Deep navy/charcoal for premium feel
                navy: {
                    50: '#f8fafc',
                    100: '#f1f5f9',
                    200: '#e2e8f0',
                    300: '#cbd5e1',
                    400: '#94a3b8',
                    500: '#64748b',
                    600: '#475569',
                    700: '#334155',
                    800: '#1e293b',
                    900: '#0f172a',
                    950: '#020617',
                },
                // Vibrant electric orange accent
                accent: {
                    50: '#fff7ed',
                    100: '#ffedd5',
                    200: '#fed7aa',
                    300: '#fdba74',
                    400: '#fb923c',
                    500: '#f97316',
                    600: '#ea580c',
                    700: '#c2410c',
                    800: '#9a3412',
                    900: '#7c2d12',
                    950: '#431407',
                },
                // Enhanced grays for better contrast
                gray: {
                    50: '#f9fafb',
                    100: '#f3f4f6',
                    200: '#e5e7eb',
                    300: '#d1d5db',
                    400: '#9ca3af',
                    500: '#6b7280',
                    600: '#4b5563',
                    700: '#374151',
                    800: '#1f2937',
                    900: '#111827',
                    950: '#030712',
                },
            },
            // Strategic gradients
            backgroundImage: {
                'gradient-primary': 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                'gradient-navy': 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                'gradient-accent': 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                'gradient-hero': 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
                'gradient-card': 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
                'gradient-card-dark': 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)',
                'gradient-subtle': 'linear-gradient(180deg, transparent 0%, rgba(15, 23, 42, 0.05) 100%)',
                'gradient-subtle-dark': 'linear-gradient(180deg, transparent 0%, rgba(248, 250, 252, 0.05) 100%)',
            },
            // Enhanced typography with personality
            fontFamily: {
                'display': ['Poppins', 'Inter', 'system-ui', 'sans-serif'], // Headlines with personality
                'sans': ['Inter', 'system-ui', 'sans-serif'], // Clean body text
                'body': ['Inter', 'system-ui', 'sans-serif'], // Explicit body font
                'heading': ['Poppins', 'Inter', 'system-ui', 'sans-serif'], // Alternative heading font
            },
            // Sophisticated font sizes with stronger hierarchy
            fontSize: {
                'xs': ['0.75rem', { lineHeight: '1rem' }],
                'sm': ['0.875rem', { lineHeight: '1.25rem' }],
                'base': ['1rem', { lineHeight: '1.5rem' }],
                'lg': ['1.125rem', { lineHeight: '1.75rem' }],
                'xl': ['1.25rem', { lineHeight: '1.75rem' }],
                '2xl': ['1.5rem', { lineHeight: '2rem' }],
                '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
                '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
                '5xl': ['3rem', { lineHeight: '1.1' }],
                '6xl': ['3.75rem', { lineHeight: '1.1' }],
                '7xl': ['4.5rem', { lineHeight: '1.1' }],
                '8xl': ['6rem', { lineHeight: '1.1' }],
                '9xl': ['8rem', { lineHeight: '1.1' }],
                // Custom display sizes for hero sections
                'hero': ['5rem', { lineHeight: '1.1', fontWeight: '800' }],
                'hero-lg': ['6rem', { lineHeight: '1.05', fontWeight: '800' }],
                'hero-xl': ['7rem', { lineHeight: '1.05', fontWeight: '900' }],
                // Custom sizes for different contexts
                'display-sm': ['2.5rem', { lineHeight: '2.75rem', fontWeight: '700' }],
                'display-md': ['3.5rem', { lineHeight: '3.75rem', fontWeight: '700' }],
                'display-lg': ['4.5rem', { lineHeight: '4.75rem', fontWeight: '800' }],
            },
            // Enhanced font weights
            fontWeight: {
                'thin': '100',
                'extralight': '200',
                'light': '300',
                'normal': '400',
                'medium': '500',
                'semibold': '600',
                'bold': '700',
                'extrabold': '800',
                'black': '900',
            },
            // Letter spacing for headlines
            letterSpacing: {
                'tighter': '-0.05em',
                'tight': '-0.025em',
                'normal': '0em',
                'wide': '0.025em',
                'wider': '0.05em',
                'widest': '0.1em',
                'headline': '-0.02em', // Custom for headlines
            },
            // Enhanced shadows for depth
            boxShadow: {
                'glow': '0 0 20px rgba(249, 115, 22, 0.3)',
                'glow-blue': '0 0 20px rgba(14, 165, 233, 0.3)',
                'premium': '0 20px 40px rgba(15, 23, 42, 0.1)',
                'premium-dark': '0 20px 40px rgba(0, 0, 0, 0.3)',
                'text-glow': '0 0 10px rgba(249, 115, 22, 0.5)',
            },
            // Animation for smooth transitions
            animation: {
                'fade-in': 'fadeIn 0.5s ease-in-out',
                'slide-up': 'slideUp 0.6s ease-out',
                'glow-pulse': 'glowPulse 2s ease-in-out infinite alternate',
                'text-shimmer': 'textShimmer 3s ease-in-out infinite',
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
                glowPulse: {
                    '0%': { boxShadow: '0 0 20px rgba(249, 115, 22, 0.3)' },
                    '100%': { boxShadow: '0 0 30px rgba(249, 115, 22, 0.6)' },
                },
                textShimmer: {
                    '0%, 100%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                },
            },
        },
    },
    plugins: [],
}