import React, { useState } from "react";
import CreateSpaceDialog from "../CreateSpaceDialog";
import { BiMessageSquareAdd as AddSpaceIcon } from "react-icons/bi";

export default React.memo(function CreateSpaceBtn() {
    const [open, setOpen] = useState(false);
    return (
        <React.Fragment>
            <button
                onClick={() => setOpen(true)}
                className="flex flex-row justify-center my-0.5 items-center rounded-md py-1 px-2 font-semibold text-white w-full bg-primary-500">
                <AddSpaceIcon className="w-6 h-6" />
                <span className="pl-3 pr-1 text-sm">Add Space</span>
            </button>
            <CreateSpaceDialog open={open} onClose={() => setOpen(false)} />
        </React.Fragment>
    );
});
