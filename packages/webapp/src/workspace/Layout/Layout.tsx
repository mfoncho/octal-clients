import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useParams, Route, Routes } from "react-router-dom";
import Mention, { Mentioned } from "../Mention";
import Home from "../Home";
import Calendar from "../Calendar";
import Workspace from "../Workspace";
import paths from "src/paths";
import { Elements } from "@octal/ui";
import { route } from "@octal/store/lib/actions/app";
import Console from "src/console";
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
                <Routes>
                    {Console.paths.map((path) => (
                        <Route
                            key={path}
                            path={`${path}`}
                            element={<Console.Navigator />}
                        />
                    ))}
                    {workspacePaths.concat(sectionsPaths).map((path) => (
                        <Route
                            key={path}
                            path={`${path}`}
                            element={<Workspace.Navigator />}
                        />
                    ))}
                </Routes>
            </Sidebar>
            <main className="flex-grow flex overflow-hidden flex-row">
                <Routes>
                    <Route
                        path="spaces/:space_id/*"
                        element={<Workspace.Main />}
                    />
                    <Route path="console/*" element={<Console.Main />} />
                    <Route
                        path={paths.sections.calendar}
                        element={<Calendar />}
                    />

                    <Route path="/spaces" element={<Home />} />
                    <Route path={paths.sections.home} element={<Home />} />
                </Routes>
            </main>
            <RouteListener />
        </Elements.Provider>
    );
});
