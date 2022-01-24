import React, { useEffect, useState } from "react";
import clx from "classnames";
import Drawer from "@material-ui/core/Drawer";
import { makeStyles } from "@material-ui/core/styles";
import tools from "./tools";
import { Context } from "../Space";
import { useTool } from "../Space/hooks";
import { useParams } from "react-router-dom";

interface ISideapp {
    component: any;
    Props: any;
}

const drawerWidthWithApp = 400;

const drawerWidthWithoutApp = 0;

const drawerLargeWidthWithApp = 500;

const drawerSmallWidthWithApp = 360;

const useStyles = makeStyles((theme) => ({
    root: {
        flexShrink: 0,
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    open: {
        width: drawerWidthWithApp,
    },
    normal: {
        width: drawerWidthWithApp,
    },
    large: {
        [theme.breakpoints.down("sm")]: {
            width: 380,
        },
        [theme.breakpoints.up("md")]: {
            width: drawerLargeWidthWithApp,
        },
    },
    small: {
        width: drawerSmallWidthWithApp,
    },
    closed: {
        width: drawerWidthWithoutApp,
    },
    icon: {
        display: "flex",
        flexGrow: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        color:
            theme.palette.type === "light"
                ? theme.palette.primary["A700"]
                : undefined,
    },
    app: {
        flexGrow: 1,
        display: "flex",
        overflow: "hidden",
        flexDirection: "column",
        borderRight: "1px solid rgba(0, 0, 0, 0.12)",
    },
    container: {
        flexGrow: 1,
        display: "flex",
        overflow: "hidden",
    },
    listItem: {
        marginTop: theme.spacing(0.5),
        marginBottom: theme.spacing(0.5),
        display: "flex",
        paddingLeft: theme.spacing(0.5),
        flexDirection: "row",
    },
    highlighBar: {
        width: theme.spacing(0.5),
        borderTopLeftRadius: theme.spacing(0.25),
        borderBottomLeftRadius: theme.spacing(0.25),
    },
    selectedBar: {
        backgroundColor: theme.palette.secondary["A400"],
    },
    selectedApp: {},
    drawerPaper: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end",
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    appname: {
        fontSize: 18,
    },
    closeIcon: {},
}));

const Sideapp = React.memo<ISideapp>((props) => {
    const classes = useStyles();
    const params = useParams<{ space_id: string }>();
    const [[App, Props, id], setAppProps] = useState<[any, any, string]>([
        props.component,
        props.Props,
        params.space_id,
    ]);

    useEffect(() => {
        setAppProps([props.component, props.Props, params.space_id]);
    }, [props.component, props.Props]);

    return (
        <div className={classes.app}>
            <Context id={id}>
                <App {...Props} />
            </Context>
        </div>
    );
});

export default function ToolsDrawer(props: any) {
    const tool = useTool();

    const classes = useStyles();

    const [Tool, setTool] = useState<any>(null);

    useEffect(() => {
        setTool(() => {
            return tools.find((t) => t.name == tool.name)?.default;
        });
    }, [tool.name]);

    const widthClass = props.open ? classes.open : classes.closed;

    return (
        <div
            className={
                props.variant === "permanent"
                    ? clx(classes.root, widthClass)
                    : ""
            }>
            <Drawer
                open={props.variant === "permanent" ? true : props.open}
                anchor="right"
                variant={props.variant}
                onClose={tool.close}
                classes={{ paper: clx(classes.drawerPaper, widthClass) }}>
                {Tool && <Sideapp component={Tool} Props={props.ToolProps} />}
            </Drawer>
        </div>
    );
}
