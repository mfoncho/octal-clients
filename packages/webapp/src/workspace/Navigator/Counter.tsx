import React from "react";

export default React.memo<{ value: number }>(({ value }) => {
    if (value == 0) return <span />;
    return (
        <span className="w-4 h-4 text-white rounded-md bg-red-500 flex items-center justify-center">
            {value}
        </span>
    );
});
