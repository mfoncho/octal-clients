import React from "react";
import { useWorkspace } from "@colab/store";

export default React.memo(() => {
    const workspace = useWorkspace();
    return (
        <img
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg"
            alt={workspace.get("name")}
            src={workspace.get("icon")}
        />
    );
});
