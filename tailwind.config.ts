import { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './src/app/**/*.{js,ts,jsx,tsx}', // Ajoutez ce chemin
        './src/pages/**/*.{js,ts,jsx,tsx}',
        './src/components/**/*.{js,ts,jsx,tsx}',
        './src/module/**/*.{js,ts,jsx,tsx}',
    ],
    safelist: [
        'text-red-500',
        'text-slate-300',

        'bg-red-500',
        'bg-orange-800',
        'bg-blue-800',
        'bg-purple-800',
        'bg-red-600',
        'bg-blue-600',
        'bg-orange-500',
        'bg-gray-600',
        'bg-gray-500',
        'bg-primary',

        'from-orange-800',
        'from-blue-800',
        'from-purple-800',
        'from-red-600',
        'from-blue-600',
        'from-orange-500',
        'from-gray-600',
        'from-gray-500',
        'from-primary',

        'to-orange-800',
        'to-blue-800',
        'to-purple-800',
        'to-red-600',
        'to-blue-600',
        'to-orange-500',
        'to-gray-600',
        'to-gray-500',
        'to-primary',
    ],
    theme: {

        extend: {
            colors: {
                'primary': '#228b22',        // Vert jungle principal, riche et intense
                'primary-dark': '#145214',   // Une version plus sombre, parfaite pour les contrastes
                'primary-lightDark': '#1e6e1e', // Une teinte intermédiaire, subtilement adoucie
                'primary-light': '#6abf6a',  // Une version plus claire, douce et lumineuse
            },
        },
    },
    plugins: [],
};

export default config;
