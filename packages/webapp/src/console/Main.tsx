import React from "react";
import paths from "./paths";
import routes from "@console/routes";
import Module from "@console/components/Module";
import { Routes, Route, Navigate } from "react-router-dom";

export default React.memo(() => {
    return (
        <Routes>
            {routes.map((route) => {
                const Main = route.main;
                return (
                    <Route
                        key={route.path}
                        path={route.path.replace("/console", "")}
                        element={
                            <Module.Provider value={route}>
                                <Main />
                            </Module.Provider>
                        }
                    />
                );
            })}
            <Route
                path="/"
                element={<Navigate to={paths.dashboard} replace={true} />}
            />
        </Routes>
    );
});
