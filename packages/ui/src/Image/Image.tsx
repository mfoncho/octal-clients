import React, { useState, useEffect } from "react";
import clx from "classnames";

export interface IImage extends React.ImgHTMLAttributes<HTMLImageElement> {
    /*
     * Image source url
     */
    src: string;

    /*
     * Update image loading state
     * on src onchange default true
     */
    reactive?: boolean;

    /*
     * Chilren will be displayed as placehodler
     * while image is being loaded
     */
    children?: React.ReactNode | string;
}

export default React.forwardRef<HTMLImageElement, IImage>(
    ({ src, children, reactive = true, alt = "", ...spread }, ref) => {
        const [loaded, setLoaded] = useState(false);
        useEffect(() => {
            if (src) {
                if (reactive) {
                    setLoaded(false);
                }
                const image = new Image();
                image.src = src;
                let imgloadedcb = () => setLoaded(true);
                image.addEventListener("load", imgloadedcb);
                return () => {
                    image.removeEventListener("load", imgloadedcb);
                };
            } else {
                setLoaded(false);
            }
        }, [src]);

        if (loaded) {
            return <img alt={alt} src={src} {...spread} ref={ref} />;
        }

        if (children) {
            return <React.Fragment> {children} </React.Fragment>;
        }
        return (
            <div
                className={clx(
                    "animate-pulse overflow-hidden",
                    spread.className
                )}
                style={spread.style}>
                <div
                    className="bg-slate-300 w-full h-full shadow-sm"
                    style={spread.style}
                />
            </div>
        );
    }
);
