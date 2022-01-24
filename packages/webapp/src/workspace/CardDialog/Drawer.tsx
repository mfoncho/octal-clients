import React from "react";
import View from "@workspace/View";
import Thread from "@workspace/Thread";
import MuiDrawer from "@material-ui/core/Drawer";
import { useDrawer, IDrawer } from "./hooks";

interface ISidenav {
    open: boolean;
    drawer: IDrawer;
    onClose: () => void;
}

const Drawer = React.memo<IDrawer>((props) => {
    let component = <></>;
    switch (props.type) {
        case "thread":
            if (props.thread_id) {
                component = <Thread id={props.thread_id} />;
            }
            break;
        default:
            break;
    }

    return <React.Fragment>{component}</React.Fragment>;
});

const Sidebar = React.memo<ISidenav>((props) => {
    return (
        <React.Fragment>
            {/** lg and xl **/}
            <View size="md|xl|lg">
                <div className="flex flex-1 flex-col p-1">
                    <Drawer {...props.drawer} />
                </div>
            </View>

            {/** xs or phones **/}
            <View size="xs|sm">
                <MuiDrawer
                    open={props.open}
                    anchor="right"
                    onClose={props.onClose}
                    variant="temporary">
                    <div className="w-[320px] min-w-[320px] max-w-[320px] flex-1 flex flex-row bg-gray-100 overflow-hidden">
                        <Drawer {...props.drawer} />
                    </div>
                </MuiDrawer>
            </View>
        </React.Fragment>
    );
});

export default React.memo<{ id: string }>(({ id }) => {
    const [drawer, drawerActions] = useDrawer(id);
    return (
        <Sidebar
            open={drawer.open}
            drawer={drawer.props}
            onClose={() => drawerActions.close({ id: id, type: "" })}
        />
    );
});
