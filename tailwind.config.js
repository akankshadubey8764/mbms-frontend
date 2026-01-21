/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#e6f2ff',
                    100: '#cce5ff',
                    200: '#99ccff',
                    300: '#66b2ff',
                    400: '#3399ff',
                    500: '#007bff',
                    600: '#0062cc',
                    700: '#004a99',
                    800: '#003166',
                    900: '#001933',
                },
            },
            fontFamily: {
                sans: ['Inter', 'Roboto', 'sans-serif'],
                condensed: ['Roboto Condensed', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
