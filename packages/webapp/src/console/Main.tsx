import React from "react";
import routes from "@console/routes";
import paths from "@console/paths";
import Module from "@console/components/Module";
import { Switch, Route, Redirect } from "react-router-dom";

export default React.memo(() => {
    return (
        <Switch>
            {routes.map((route) => {
                const Main = route.main;
                return (
                    <Route exact key={route.path} path={route.path}>
                        <Module.Provider value={route}>
                            <Main />
                        </Module.Provider>
                    </Route>
                );
            })}
            <Route>
                <Redirect to={paths.dashboard} />
            </Route>
        </Switch>
    );
});
