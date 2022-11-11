import { ImCheckboxUnchecked as TaskIcon } from "react-icons/im";
import { MdOutlineCheckBox as DoneOutline } from "react-icons/md";
import { MdCheckBox as DoneSolid } from "react-icons/md";
import { MdOutlineCheckBoxOutlineBlank as Undone } from "react-icons/md";
import { MdOutlineAddBox as Add } from "react-icons/md";
import { MdAddBox as AddSolid } from "react-icons/md";

type Task = typeof TaskIcon & {
    DoneSolid: typeof DoneSolid;
    DoneOutline: typeof DoneOutline;
    Undone: typeof Undone;
    Add: typeof Add;
    AddSolid: typeof AddSolid;
};

(TaskIcon as Task).DoneSolid = DoneSolid;
(TaskIcon as Task).DoneOutline = DoneOutline;
(TaskIcon as Task).Add = Add;
(TaskIcon as Task).Undone = Undone;
(TaskIcon as Task).AddSolid = AddSolid;

export default TaskIcon as Task;
