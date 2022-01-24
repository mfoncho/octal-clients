const login = "/auth/login";
const reset = "/auth/reset";

const paths = {
    login,
    reset,
};

export type Path = keyof typeof paths;

export default Object.freeze(paths);
