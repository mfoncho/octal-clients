import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, useLocation, useParams, Route } from "react-router-dom";
import Mention, { Mentioned } from "../Mention";
import Home from "../Home";
import Calendar from "../Calendar";
import Workspace from "../Workspace";
import paths from "src/paths";
import { Elements } from "@octal/ui";
import { route } from "@octal/store/lib/actions/app";
import Console from "src/console";
import { RouterParams, RouteLocation } from "src/types";
import Sidebar from "@workspace/Sidebar";
import { useNavigatorDrawer } from "src/hooks";

const elements = {
    Mention,
    Mentioned,
};

const workspacePaths = Object.values(paths.workspace).concat(
    Object.values(paths.sections)
);

const RouteListener = React.memo(() => {
    const params = useParams<RouterParams>();

    const [navbar, navbarActions] = useNavigatorDrawer();

    const dispatch = useDispatch();

    const location = useLocation<RouteLocation>();

    useEffect(() => {
        let action = route({ ...location, params });
        dispatch(action);
        if (navbar.open) {
            navbarActions.close({});
        }
    }, [location.pathname]);

    return <></>;
});

export default React.memo(function Layout() {
    return (
        <Elements.Provider value={elements}>
            <Sidebar>
                <Switch>
                    <Route
                        exact={true}
                        path={Console.paths}
                        component={Console.Navigator}
                    />
                    <Route
                        exact={true}
                        path={workspacePaths}
                        component={Workspace.Navigator}
                    />
                </Switch>
            </Sidebar>
            <main className="flex-grow flex overflow-hidden flex-row">
                <Switch>
                    <Route
                        exact={true}
                        path={paths.sections.home}
                        component={Home}
                    />
                    <Route
                        exact={true}
                        path={paths.sections.calendar}
                        component={Calendar}
                    />
                    <Route
                        exact={true}
                        path={workspacePaths}
                        component={Workspace.Main}
                    />
                    <Route
                        exact={true}
                        path={Console.paths}
                        component={Console.Main}
                    />
                </Switch>
            </main>
            <RouteListener />
        </Elements.Provider>
    );
});
