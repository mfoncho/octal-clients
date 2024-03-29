import React from "react";
import SvgIcon, { SvgIconProps } from "@material-ui/core/SvgIcon";

export default React.memo<SvgIconProps>((props) => (
    <SvgIcon {...props} viewBox="0 0 256 239">
        <path
            d="M52.069 90.871L0 49.172 75.307.001l52.692 43.984-75.93 46.887L128 137.758l-52.692 43.986L0 132.573 52.07 90.87zM128 137.758l52.695 43.986 75.304-49.171-52.07-41.702L128 137.758zm128-88.586L180.695 0l-52.694 43.984 75.93 46.887L256 49.17zM128.154 147.22l-52.847 43.854-22.612-14.764v16.554l75.46 45.255 75.461-45.255V176.31l-22.61 14.764-52.852-43.854z"
            fill="#007EE5"
        />
    </SvgIcon>
));
