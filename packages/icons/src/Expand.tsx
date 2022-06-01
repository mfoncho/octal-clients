import {
    MdExpandLess as ExpandUp,
    MdExpandMore as ExpandDown,
} from "react-icons/md";
import { BsChevronExpand as Expand } from "react-icons/bs";

export type ExpandType = typeof Expand & {
    Up: typeof ExpandUp;
    Down: typeof ExpandDown;
};

(Expand as ExpandType).Up = ExpandUp;

(Expand as ExpandType).Down = ExpandDown;

export default Expand as ExpandType;
