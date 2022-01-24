import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import BaseTooltip, { TooltipProps } from "@material-ui/core/Tooltip";

const useStyles = makeStyles((theme) => ({
    arrow: {
        color: theme.palette.common.black,
    },
    tooltip: {
        backgroundColor: theme.palette.common.black,
    },
}));

export type ITooltipProps = TooltipProps;

export default function Tooltip({
    children,
    placement = "top",
    ...props
}: ITooltipProps) {
    const classes = useStyles();
    return (
        <BaseTooltip
            classes={classes}
            placement={placement}
            {...props}
            arrow={true}>
            {typeof children == "string" ? (
                <Typography variant="subtitle2">{children}</Typography>
            ) : (
                children
            )}
        </BaseTooltip>
    );
}
