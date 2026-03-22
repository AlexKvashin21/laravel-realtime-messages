import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.vue',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['"Plus Jakarta Sans"', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                brand: {
                    50: '#f0f4ff',
                    100: '#e0e9ff',
                    200: '#c7d6fe',
                    300: '#a4b8fc',
                    400: '#7e91f8',
                    500: '#5f6bef',
                    600: '#4a46e4',
                    700: '#3d38ca',
                    800: '#3430a3',
                    900: '#312f81',
                },
            },
            boxShadow: {
                soft: '0 2px 15px -3px rgb(15 23 42 / 8%), 0 10px 25px -5px rgb(15 23 42 / 6%)',
                card: '0 1px 2px rgb(15 23 42 / 5%), 0 12px 40px -12px rgb(79 70 229 / 12%)',
            },
            backgroundImage: {
                'grid-slate': `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2394a3b8' fill-opacity='0.08'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            },
            screens: {
                'xxl': '1800px'
            }
        },
    },

    plugins: [forms],
};
