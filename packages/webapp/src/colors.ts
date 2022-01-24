import immutable from "immutable";
import red from "@material-ui/core/colors/red";
import blue from "@material-ui/core/colors/blue";
import grey from "@material-ui/core/colors/grey";
import pink from "@material-ui/core/colors/pink";
import teal from "@material-ui/core/colors/teal";
import brown from "@material-ui/core/colors/brown";
import green from "@material-ui/core/colors/green";
import amber from "@material-ui/core/colors/amber";
import yellow from "@material-ui/core/colors/yellow";
import orange from "@material-ui/core/colors/orange";
import purple from "@material-ui/core/colors/purple";
import indigo from "@material-ui/core/colors/indigo";
import bluegrey from "@material-ui/core/colors/blueGrey";
import deeporange from "@material-ui/core/colors/deepOrange";
import deeppurple from "@material-ui/core/colors/deepPurple";

const colors = {
    red,
    blue,
    grey,
    pink,
    teal,
    brown,
    green,
    amber,
    yellow,
    orange,
    purple,
    indigo,
    bluegrey,
    deeppurple,
    deeporange,
};

export const presence = new (class Presence extends immutable.Record({
    dnd: colors.red["A400"],
    away: colors.deeporange["A400"],
    busy: colors.orange["500"],
    online: colors.green["A700"],
    offline: colors.grey["300"],
    invisible: "transparent",
}) {})();

export default colors;
