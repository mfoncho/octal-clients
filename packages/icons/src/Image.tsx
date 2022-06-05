import { MdImage as Solid } from "react-icons/md";
import { FiImage as Outline } from "react-icons/fi";
import { BiImageAdd as Add } from "react-icons/bi";

type Image = typeof Solid & {
    Outline: typeof Outline;
    Add: typeof Add;
    Solid: typeof Solid;
};

(Solid as Image).Add = Add;
(Solid as Image).Solid = Solid;
(Solid as Image).Outline = Outline;

export default Solid as Image;
