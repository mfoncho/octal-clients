import paths from "@console/paths";
import * as Icons from "@colab/icons";
import { route } from "../types";
import main from "./Main";

const name = "Role";
const path = paths.role;

export default {
    icon: Icons.Role,
    main,
    name,
    path,
    type: route.general,
};
