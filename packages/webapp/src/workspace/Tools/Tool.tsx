import React from "react";
import {
    makeStyles,
    Typography,
    Paper,
    IconButton,
    ListItemText,
} from "@material-ui/core";
import * as Icons from "@octal/icons";
import { useTool, useSpace } from "../Space/hooks";

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        overflow: "hidden",
        flexDirection: "column",
    },
    icon: {
        paddingRight: theme.spacing(1),
    },
    header: {
        flexGrow: 1,
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
    },
    appbar: {
        ...theme.mixins.toolbar,
        display: "flex",
        padding: theme.spacing(0, 1),
        alignItems: "center",
        borderRadius: 0,
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor:
            theme.palette.type === "light"
                ? `${theme.palette.primary["A400"]}10`
                : undefined,
    },
}));

export interface ITool {
    icon?: JSX.Element;
    header?: any;
    title?: string | JSX.Element;
    children?: any;
}

export default React.memo<ITool>((props) => {
    const tool = useTool();
    const classes = useStyles();
    const space = useSpace();
    return (
        <div className={classes.root}>
            <Paper className={classes.appbar}>
                <div className={classes.header}>
                    {props.header ? (
                        props.header
                    ) : (
                        <>
                            {props.icon ? (
                                <div className={classes.icon}>{props.icon}</div>
                            ) : null}
                            <ListItemText
                                primary={
                                    <Typography variant="subtitle2">
                                        {props.title}
                                    </Typography>
                                }
                                secondary={space.name}
                            />
                        </>
                    )}
                </div>
                <IconButton onClick={tool.close} size="small">
                    <Icons.Close />
                </IconButton>
            </Paper>
            {props.children}
        </div>
    );
});
