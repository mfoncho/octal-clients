import { MdDashboard as icon } from "react-icons/md";
import paths from "@console/paths";
import { route } from "../types";
import main from "./Main";

const name = "Dashboard";
const path = paths.dashboard;

export default {
    icon,
    main,
    name,
    path,
    type: route.general,
};
