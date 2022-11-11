import React, { lazy, useEffect, useState, Suspense } from "react";
import { useAuthId } from "@colab/store";
import { useDispatch } from "react-redux";
import { Actions } from "@colab/store";
import Auth from "../auth";
//import Workspace from "../workspace";

const Workspace = lazy(() => import("../workspace"));

const Loading = () => <div>loading...</div>;

export default React.memo(() => {
    const id = useAuthId();
    const dispatch = useDispatch();
    const [authenticated, setAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        dispatch(Actions.App.loadConfig());
        dispatch(Actions.App.loadWorkspace());
    }, []);

    useEffect(() => {
        if (authenticated === null && !Boolean(id)) {
            dispatch(Actions.App.loadAuth()).then((auth) => {
                if (auth.token && auth.user) {
                    setAuthenticated(true);
                } else {
                    setAuthenticated(false);
                }
            });
        } else {
            if (Boolean(id) && !authenticated) {
                setAuthenticated(true);
            } else if (!Boolean(id.trim()) && authenticated) {
                setAuthenticated(false);
            }
        }
    }, [id]);

    if (authenticated === null) {
        return <div />;
    }

    if (authenticated) {
        return (
            <Suspense fallback={<Loading />}>
                <Workspace />
            </Suspense>
        );
    }

    return <Auth />;
});
