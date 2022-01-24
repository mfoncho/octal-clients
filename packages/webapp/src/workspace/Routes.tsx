import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import paths from "src/paths";
import Layout from "./Layout";

function Lost() {
    return <Redirect to="/spaces">Wait where am i?</Redirect>;
}

const constilation = Object.values(paths)
    .map((sector) => Object.values(sector))
    .reduce((acc, paths) => {
        return acc.concat(paths);
    }, [])
    .sort((a, b) => {
        const la = a.split("/").length;
        const lb = b.split("/").length;
        if (la > lb) return 1;
        if (la < lb) return -1;
        return 0;
    });

export default function Routes() {
    return (
        <Switch>
            <Route exact={true} path={constilation} component={Layout} />
            <Route component={Lost} />
        </Switch>
    );
}
