import React from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStlyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        alignItems: "center",
        fontWeight: 700,
        flexDirection: "row",
        color: theme.palette.common.white,
    },
    label: {
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
        padding: (props: any) => {
            let unit = theme.spacing(1);
            let left = 1;
            let vertical = 0.2 / unit;
            let padding = theme.spacing(vertical, 0.5, vertical, left);
            return props.padded || props.padding
                ? props.padding || padding
                : padding;
        },
        borderRadius: 2,
        backgroundColor: (props: any) =>
            props.color ? props.color : theme.palette.primary["500"],
    },
    pointer: {
        borderTop: "10px solid transparent",
        borderBottom: "10px solid transparent",
        borderLeft: (props: any) => {
            return (
                "8px solid " +
                (props.color ? props.color : theme.palette.primary["500"])
            );
        },
    },
}));

export default function Label(props: any) {
    const classes = useStlyles(props);

    return (
        <div className={classes.root}>
            <div className={classes.label}>{props.children}</div>
            <div className={classes.pointer} />
        </div>
    );
}
