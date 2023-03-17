import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
    useLocation,
    useParams,
    Route,
    Routes,
    Navigate,
} from "react-router-dom";
import Mention from "../Mention";
import Suggestion from "../Suggestion";
import Home from "../Home";
import Claim from "../ClaimDialog";
import Calendar from "../Calendar";
import Workspace from "../Workspace";
import paths from "src/paths";
import { Elements } from "@colab/ui";
import { route } from "@colab/store/lib/actions/app";
import Console from "src/console";
import Sidebar from "@workspace/Sidebar";
import { useAuth } from "@colab/store";
import { useNavigatorDrawer } from "src/hooks";

const elements = {
    Suggestion,
    Mention,
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
    const auth = useAuth();
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
            <main className="flex-grow flex overflow-hidden flex-row dark:bg-slate-700">
                <Routes>
                    <Route
                        path="auth/*"
                        element={
                            <Navigate to={paths.sections.home} replace={true} />
                        }
                    />
                    <Route
                        path={paths.workspace.chat}
                        element={<Workspace.Main />}
                    />
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
                <Claim open={!auth.claimed} onClose={() => ({})} />
            </main>
            <RouteListener />
        </Elements.Provider>
    );
});
