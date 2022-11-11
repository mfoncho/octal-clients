import React, { useState } from "react";
import * as Icons from "@colab/icons";
import CreateSpaceDialog from "../CreateSpaceDialog";

export default React.memo(function CreateSpaceBtn() {
    const [open, setOpen] = useState(false);
    return (
        <div className="px-2">
            <button
                onClick={() => setOpen(true)}
                className="flex flex-row justify-center my-0.5 items-center rounded-md py-1 px-2 font-semibold text-white w-full bg-primary-500">
                <Icons.Plus className="w-6 h-6" />
            </button>
            <CreateSpaceDialog open={open} onClose={() => setOpen(false)} />
        </div>
    );
});
