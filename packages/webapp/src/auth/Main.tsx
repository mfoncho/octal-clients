import React from "react";
import Login from "./Login";
import path from "./paths";
import ResetPassword from "./ResetPassowrd";
import { Route, Switch, Redirect } from "react-router-dom";

export default React.memo(() => {
    return (
        <Switch>
            <Route exact={true} path={path.login} component={Login} />
            <Route exact={true} path={path.reset} component={ResetPassword} />
            <Route>
                <Redirect to={path.login} />
            </Route>
        </Switch>
    );
});
