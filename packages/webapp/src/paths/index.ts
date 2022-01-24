import console from "@console/paths";
import sections from "./sections";
import workspace from "./workspace";

const paths = { console, workspace, sections };

export type Path = keyof typeof paths;

export default Object.freeze(paths);
