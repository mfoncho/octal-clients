import { MdCancel as CancelIcon } from "react-icons/md";

type Cancel = typeof CancelIcon & {
    Solid: typeof CancelIcon;
};

(CancelIcon as Cancel).Solid = CancelIcon;

export default CancelIcon as Cancel;
