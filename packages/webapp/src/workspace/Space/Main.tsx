import React, { useState, useEffect } from "react";
import Space from "./Space";

interface ITool {
    name: string | null;
    open: (name: string, props: any) => void;
    close: () => void;
}

interface ISidebar {
    props: any;
    tool: ITool;
}

/**
const Toolbar = React.memo<ISidebar>((props) => {
    return (
        <div>
            <Hidden smDown>
                <Tools
                    variant="permanent"
                    ToolProps={props.props}
                    selected={props.tool.name}
                    open={Boolean(props.tool.name)}
                />
            </Hidden>

            <Hidden mdUp>
                <Tools
                    variant="temporary"
                    ToolProps={props.props}
                    selected={props.tool.name}
                    open={Boolean(props.tool.name)}
                />
            </Hidden>
        </div>
    );
});
 **/

export default React.memo(() => {
    const [sidebar, setSidebar] = useState<ISidebar>({
        props: null,
        tool: {
            name: null,
            open: () => {},
            close: () => {
                console.log("closeing");
            },
        },
    });

    function closeTool() {
        const bar = {
            props: null,
            tool: {
                ...sidebar.tool,
                name: null,
            },
        };
        setSidebar(bar);
    }

    function openTool(name: string, props: any) {
        const bar = {
            props: props,
            tool: {
                ...sidebar.tool,
                name: name,
            },
        };
        setSidebar(bar);
    }

    useEffect(() => {
        setSidebar(() => ({
            props: sidebar.props,
            tool: {
                open: openTool,
                close: closeTool,
                name: sidebar.tool.name,
            },
        }));
    }, [sidebar.props, sidebar.tool.name]);

    return (
        <>
            <Space />
            {/**
            <Tool.Provider value={sidebar.tool}>
                <Toolbar {...sidebar} />
            </Tool.Provider>
            **/}
        </>
    );
});
