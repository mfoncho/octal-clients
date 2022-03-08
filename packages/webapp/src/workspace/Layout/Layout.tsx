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

const workspacePaths = Object.values(paths.workspace);

const sectionsPaths = Object.values(paths.sections);

const RouteListener = React.memo(() => {
    const params = useParams<any>();

    const [navbar, navbarActions] = useNavigatorDrawer();

    const dispatch = useDispatch();

    const location = useLocation();

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
                    {Console.paths.map((path) => (
                        <Route key={path} path={path}>
                            <Console.Navigator />
                        </Route>
                    ))}
                    {workspacePaths.concat(sectionsPaths).map((path) => (
                        <Route key={path} path={path}>
                            <Workspace.Navigator />
                        </Route>
                    ))}
                </Switch>
            </Sidebar>
            <main className="flex-grow flex overflow-hidden flex-row">
                <Switch>
                    {workspacePaths.map((path) => (
                        <Route key={path} path={path}>
                            <Workspace.Main />
                        </Route>
                    ))}
                    {Console.paths.map((path) => (
                        <Route key={path} path={path}>
                            <Console.Main />
                        </Route>
                    ))}
                    <Route path={paths.sections.calendar}>
                        <Calendar />
                    </Route>
                    <Route path={paths.sections.home}>
                        <Home />
                    </Route>
                </Switch>
            </main>
            <RouteListener />
        </Elements.Provider>
    );
});
