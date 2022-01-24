import colors from "./colors";

export const hexToRgba = (hex: any, opacity = 0.0) => {
    let chex = hex.charAt(0) === "#" ? hex.substring(1, 7) : hex;
    let R = parseInt(chex.substring(0, 2), 16);
    let G = parseInt(chex.substring(2, 4), 16);
    let B = parseInt(chex.substring(4, 6), 16);
    return `rgba(${R},${G},${B},${opacity})`;
};

export const background = {
    light: {
        paper: "#ffffff",
        default: "#fafafa",
    },
    dark: {
        paper: "#15191E",
        default: "#20262B",
    },
};

export const root = {
    background,

    palette: {
        ...colors,
        primary: colors.indigo,
        secondary: colors.red,
    },

    utils: {
        hexToRgba,
    },

    typography: {
        useNextVariants: true,
        fontFamily: [
            `"Lato"`,
            "Roboto",
            '"Helvetica Neue"',
            "sans-serif",
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(","),

        subtitle2: {
            fontWeight: 700,
            fontSize: "0.884rem",
        },
    },

    shape: {
        borderRadius: 10,
    },
};

export const base = {
    ...root,
    palette: {
        ...root.palette,
        background: background.light,
    },
};
