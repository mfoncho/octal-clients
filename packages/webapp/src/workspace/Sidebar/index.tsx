import React from "react";
import View from "../View";
import Header from "./Header";
import { useScreen, useNavigatorDrawer } from "src/hooks";
import Drawer from "@material-ui/core/Drawer";

interface IMenu {
    className?: string;
    children: React.ReactNode | React.ReactNode[];
}

interface ISidenav {
    children: React.ReactNode | React.ReactNode[];
}

const Menu = React.memo<IMenu>((props) => {
    const screen = useScreen();
    if (screen.mobile) {
        return (
            <div className="flex-1 flex flex-col w-72 border-r border-slate-200 bg-gray-100 dark:bg-slate-800 dark:border-slate-700">
                <Header />
                <div className="flex flex-grow flex-col">{props.children}</div>
            </div>
        );
    }
    return (
        <div className="flex-zeros-auto flex-col w-72 border-r border-slate-200 bg-gray-100 dark:bg-slate-800 dark:border-slate-700">
            <Header />
            <div className="flex flex-grow flex-col">{props.children}</div>
        </div>
    );
});

export default React.memo<ISidenav>((props) => {
    const [drawer, navbar] = useNavigatorDrawer();

    return (
        <React.Fragment>
            {/** lg and xl **/}
            <View size="md|xl|lg">
                <Menu>{props.children}</Menu>
            </View>

            {/** xs or phones **/}
            <View size="xs|sm">
                <Drawer
                    open={drawer.open}
                    anchor="left"
                    className="flex flex-row"
                    onClose={() => navbar.close({})}
                    variant="temporary">
                    <Menu>{props.children}</Menu>
                </Drawer>
            </View>
        </React.Fragment>
    );
});
