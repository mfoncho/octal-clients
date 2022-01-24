const home = "/";
const calendar = "/calendar";
const paths = {
    home,
    calendar,
};

export type Path = keyof typeof paths;

export default Object.freeze(paths);
