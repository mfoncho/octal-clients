import React from "react";
import View from "@workspace/View";
import CardsArchive from "./CardsArchive";
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
        case "archive":
            if (props.board_id) {
                component = <CardsArchive board={{ id: props.board_id }} />;
            }
            break;
        default:
            break;
    }

    return (
        <div className="w-[320px] min-w-[320px] max-w-[320px] flex-1 flex flex-row bg-gray-100 overflow-hidden">
            {component}
        </div>
    );
});

const Sidebar = React.memo<ISidenav>((props) => {
    return (
        <React.Fragment>
            {/** lg and xl **/}
            {props.open && (
                <View size="md|xl|lg">
                    <Drawer {...props.drawer} />
                </View>
            )}

            {/** xs or phones **/}
            <View size="xs|sm">
                <MuiDrawer
                    open={props.open}
                    anchor="right"
                    onClose={props.onClose}
                    variant="temporary">
                    <Drawer {...props.drawer} />
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
            onClose={() => drawerActions.close({ type: "" })}
        />
    );
});
