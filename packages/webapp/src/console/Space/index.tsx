import * as Icons from "@colab/icons";
import paths from "@console/paths";
import { route } from "../types";
import main from "./Main";

const name = "Space";
const path = paths.space;

export default {
    icon: Icons.Space,
    main,
    name,
    path,
    type: route.general,
};
