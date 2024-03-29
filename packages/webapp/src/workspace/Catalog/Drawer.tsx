import React from "react";
import View from "@workspace/View";
import RecordsArchive from "./RecordsArchive";
import MuiDrawer from "@mui/material/Drawer";
import { useCatalog } from "@colab/store";
import { useDrawer, IDrawer } from "./hooks";

interface ISidenav {
    open: boolean;
    drawer: IDrawer;
    onClose: () => void;
}

const Drawer = React.memo<IDrawer>((props) => {
    let component = <></>;
    const catalog = useCatalog(props.catalog_id!)!;
    switch (props.type) {
        case "archive":
            if (props.catalog_id) {
                component = <RecordsArchive catalog={catalog} />;
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
                <View size="lg|xl">
                    <Drawer {...props.drawer} />
                </View>
            )}

            {/** xs or phones **/}
            <View size="xs|sm|md">
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
