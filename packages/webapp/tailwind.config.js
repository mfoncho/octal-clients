const plugin = require("tailwindcss/plugin");
const colors = require("tailwindcss/colors");

function color(name, shade) {
    const prefix = `var(--color-${name}-${shade}`;
    const r = `${prefix}-r)`;
    const g = `${prefix}-g)`;
    const b = `${prefix}-b)`;
    return `rgb(${r}, ${g}, ${b})`;
}

function palette(name) {
    return [50, 100, 200, 300, 400, 500, 600, 700, 800, 900].reduce(
        (shades, shade) => {
            shades[shade] = color(name, shade);
            return shades;
        },
        {}
    );
}

module.exports = {
    mode: "jit",
    content: ["./src/**/*.{js,jsx,ts,tsx}", "../ui/lib/**/*.{js,jsx,ts,tsx}"],
    darkMode: "class", // or 'media' or 'class'
    theme: {
        extend: {
            colors: {
                primary: palette("primary"),
                secondary: colors.red,
            },
        },
        fontFamily: false,
    },
    variants: {
        extend: {
            backgroundColor: ["checked"],
            borderColor: ["checked"],
            visibility: ["hover", "group-hover", "focus"],
        },
    },
    plugins: [
        require("@tailwindcss/forms")({
            strategy: "class",
        }),
        require("@tailwindcss/line-clamp"),
        require("@tailwindcss/aspect-ratio"),
        plugin(({ addVariant, e }) => {
            addVariant("first-child", ({ modifySelectors, separator }) => {
                modifySelectors(({ className }) => {
                    return `.${e(
                        `first-child${separator}${className}`
                    )} >*:first-child`;
                });
            });
        }),

        plugin(({ addVariant, e }) => {
            addVariant("last-child", ({ modifySelectors, separator }) => {
                modifySelectors(({ className }) => {
                    return `.${e(
                        `last-child${separator}${className}`
                    )} >*:last-child`;
                });
            });
        }),
    ],
};
