import React from "react";
import Image from "../Image";

export default React.forwardRef<
    HTMLImageElement,
    React.ComponentProps<typeof Image>
>(({ className, ...props }, ref) => {
    return (
        <Image
            ref={ref}
            {...props}
            className={`${className} inline-block rounded-full w-10 h-10`}
        />
    );
});
