import * as Icons from "@colab/icons";
import paths from "@console/paths";
import { route } from "../types";
import main from "./Main";

const name = "Roles";
const path = paths.roles;

export default {
    icon: Icons.Role,
    main,
    name,
    path,
    type: route.general,
};
