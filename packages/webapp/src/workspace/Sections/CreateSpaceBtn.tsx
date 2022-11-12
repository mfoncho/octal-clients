import React, { useState } from "react";
import * as Icons from "@colab/icons";
import CreateSpaceDialog from "../CreateSpaceDialog";

export default React.memo(function CreateSpaceBtn() {
    const [open, setOpen] = useState(false);
    return (
        <React.Fragment>
            <button
                onClick={() => setOpen(true)}
                className="group flex flex-row items-center py-1 px-2 space-x-3 hover:bg-primary-800 w-full">
                <div className="flex flex-row justify-center my-0.5 items-center rounded-md py-0.5 px-0.5 font-semibold text-white bg-primary-500">
                    <Icons.Plus className="w-5 h-5" />
                </div>
                <div className="text-sm font-bold text-primary-200 group-hover:text-white">
                    Add Space
                </div>
            </button>
            <CreateSpaceDialog open={open} onClose={() => setOpen(false)} />
        </React.Fragment>
    );
});
