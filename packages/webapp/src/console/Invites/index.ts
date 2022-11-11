import * as Icons from "@colab/icons";
import paths from "@console/paths";
import main from "./Main";
import { route } from "../types";

const name = "Invites";
const path = paths.invitations;

export default {
    icon: Icons.AddUser,
    main,
    name,
    path,
    type: route.general,
};
