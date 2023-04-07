import React, { useState } from "react";
import * as Icons from "@colab/icons";
import CreateSpaceDialog from "../CreateSpaceDialog";

export default React.memo(function CreateSpaceBtn() {
    const [open, setOpen] = useState(false);
    return (
        <React.Fragment>
            <button
                onClick={() => setOpen(true)}
                className="group flex flex-row items-center mx-3 p-2 rounded-lg hover:bg-slate-200 border border-transparent hover:border-slate-200 hover:shadow-md">
                <div className="flex flex-row justify-center items-center px-3 group-hover:text-gray-600 dark:text-gray-200">
                    <Icons.Plus className="w-6 h-6" />
                </div>
                <div className="text-sm font-semibold text-black dark:text-gray-200 group-hover:text-gray-600">
                    Add Space
                </div>
            </button>
            <CreateSpaceDialog open={open} onClose={() => setOpen(false)} />
        </React.Fragment>
    );
});
