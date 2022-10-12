import * as Icons from "@colab/icons";
import paths from "@console/paths";
import main from "./Main";
import { route } from "../types";

const name = "User";
const path = paths.user;

export default {
    icon: Icons.User,
    main,
    name,
    path,
    type: route.general,
};
