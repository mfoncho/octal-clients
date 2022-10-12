import * as Icons from "@colab/icons";
import paths from "@console/paths";
import { route } from "../types";
import main from "./Main";

const name = "Users";
const path = paths.users;

export default {
    icon: Icons.Users,
    main,
    name,
    path,
    type: route.general,
};
