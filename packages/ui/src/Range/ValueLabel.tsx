import * as React from "react";
import clsx from "classnames";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    thumb: {
        "&$open": {
            "& $offset": {
                transform: "scale(1) translateY(-10px)",
            },
        },
    },
    open: {},
    offset: {
        zIndex: 1,
        transition: theme.transitions.create(["transform"], {
            duration: theme.transitions.duration.shortest,
        }),
        top: -34,
        transformOrigin: "bottom center",
        transform: "scale(0)",
        position: "absolute",
        left: "calc(-50% + 4px)",
    },
}));

export default function ValueLabel(props: any) {
    const classes = useStyles();
    const { children, open, value, valueLabelDisplay } = props;

    if (valueLabelDisplay === "off") {
        return children;
    }

    return React.cloneElement(
        children,
        {
            className: clsx(
                children.props.className,
                {
                    [classes.open]: open || valueLabelDisplay === "on",
                },
                classes.thumb
            ),
        },
        <span className={classes.offset}>
            <span className="flex bg-primary-500 items-center justify-center w-8 h-8 rounded-tl-full rounded-tr-full rounded-br-full bg-current -rotate-45">
                <span className="text-white rotate-45">{value}</span>
            </span>
        </span>
    );
}
