import React from "react";
import { IconDefinition } from "@fortawesome/fontawesome-common-types";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import SvgIcon from "@material-ui/core/SvgIcon";

library.add(fab as any, fas as any, far as any);

export function createFontAwesomeIcon({ icon }: IconDefinition) {
    const [vwidth, vheight, _sa, _snull, path] = icon;

    return React.forwardRef<SVGSVGElement, React.SVGAttributes<SVGElement>>(
        (props, ref) => {
            const {
                className = "h-5 w-5",
                viewBox = `0 0 ${vwidth} ${vheight}`,
                fill = "currentColor",
                ...rootProps
            } = props;
            return (
                <svg
                    ref={ref}
                    xmlns="http://www.w3.org/2000/svg"
                    className={className}
                    viewBox={viewBox}
                    fill={fill}
                    {...rootProps}>
                    <path d={path as any} />
                </svg>
            );
        }
    );
}
