import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import paths from "src/paths";
import Home from "../Home";
import Layout from "@workspace/Layout";

function Lost() {
    return <Redirect to="/spaces">Wait where am i?</Redirect>;
}

const constilation: string[] = Object.values(paths)
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
            {/*
            <Route path="/">
                <Home />
            </Route>
            */}
            {constilation.map((path) => (
                <Route key={path} path={path}>
                    <Layout />
                </Route>
            ))}
            <Route>
                <Lost />
            </Route>
        </Switch>
    );
}
