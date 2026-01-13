/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Compassion Palette
                'compassion-purple': '#4B0082', // Deep Indigo/Purple
                'compassion-dark': '#1A1A1A',
                'compassion-gray': '#F5F5F5',

                // Legacy support (keeping to avoid breaking other components)
                gold: '#D4AF37',
                'lightGold': '#F4E4A6',
                bordeaux: '#722F37',
                'bordeaux-dark': '#5A2430',
                'deep-gray': '#1A1A1A',
                white: '#FFFFFF',
            },
            fontFamily: {
                sans: ['Manrope', 'sans-serif'], // Default sans to Manrope
                manrope: ['Manrope', 'sans-serif'],
            },
            animation: {
                'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
                'fade-in': 'fadeIn 0.5s ease-in-out',
            },
            keyframes: {
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
            },
        },
    },
    plugins: [],
}
