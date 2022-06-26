import * as Icons from "@octal/icons";
import paths from "@console/paths";
import { route } from "../types";
import main from "./Main";

const name = "Spaces";
const path = paths.spaces;

export default {
    icon: Icons.Space,
    main,
    name,
    path,
    type: route.general,
};
