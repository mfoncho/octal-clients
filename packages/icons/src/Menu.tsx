import { CgMenuHotdog as Bugger } from "react-icons/cg";

type Menu = typeof Bugger & {
    Bugger: typeof Bugger;
};

(Bugger as Menu).Bugger = Bugger;

export default Bugger as Menu;
