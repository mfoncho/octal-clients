import { GiSecurityGate as icon } from "react-icons/gi";
import paths from "@console/paths";
import { route } from "../types";
import main from "./Main";

const name = "Role";
const path = paths.role;

export default {
    icon,
    main,
    name,
    path,
    type: route.general,
};
