/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{html,ts}"
    ],
    theme: {
        extend: {},
        colors: {
            primary: "#15B7FF",
            light: "#15B7FF",
            dark: "#252755",
            white: "#FAFAFA",
            black: "#0F1029",
        },
    },
    plugins: [
        require('daisyui'),
    ],
    daisyui: {
        themes: false,
    },
}
