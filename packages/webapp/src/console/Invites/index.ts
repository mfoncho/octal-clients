import { IoMdPersonAdd as Icon } from "react-icons/io";
import paths from "@console/paths";
import main from "./Main";
import { route } from "../types";

const name = "Invites";
const path = paths.invitations;

export default {
    icon: Icon,
    main,
    name,
    path,
    type: route.general,
};
