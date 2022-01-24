import React, { useState, useEffect } from "react";

interface IModule {
    default: string;
}

export interface IImage
    extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src"> {
    src: string | Promise<IModule>;
    alt: string;
    lazy?: React.ReactElement;
    style?: object;
    draggable?: "true";
    className?: string;
}

export default React.forwardRef<HTMLImageElement, IImage>(
    ({ src, alt = "", lazy, ...spread }, ref) => {
        const [url, setUrl] = useState<string>("");

        const [mounted, setMounted] = useState<boolean>(false);

        useEffect(() => {
            setMounted(true);
            return () => {
                setMounted(false);
            };
        }, []);

        if (typeof src === "string") {
            return <img alt={alt} src={src} {...spread} />;
        }

        src.then((mod) => {
            if (mounted) {
                setUrl(mod.default);
            }
        });

        if (url) {
            return <img alt={alt} src={url} {...spread} />;
        } else if (lazy) {
            return lazy;
        } else {
            return (
                <img
                    {...spread}
                    ref={ref}
                    alt="loading"
                    src="/loading/image/right/here.png"
                />
            );
        }
    }
);
