import * as Icons from "@octal/icons";
import paths from "@console/paths";
import main from "./Main";
import { route } from "../types";

const name = "Workspace";
const path = paths.workspace;

export default {
    icon: Icons.Workspace,
    main,
    name,
    path,
    type: route.workspace,
};
