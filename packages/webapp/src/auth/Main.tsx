import React from "react";
import Login from "./Login";
import path from "./paths";
import ResetPassword from "./ResetPassowrd";
import { Route, Switch, Redirect } from "react-router-dom";

export default React.memo(() => {
    return (
        <Switch>
            <Route path={path.login}>
                <Login />
            </Route>
            <Route path={path.reset}>
                <ResetPassword />
            </Route>
            <Route>
                <Redirect to={path.login} />
            </Route>
        </Switch>
    );
});
