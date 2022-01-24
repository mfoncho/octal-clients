import React, { useEffect, useState } from "react";
import { useAuthId } from "@octal/store";
import { useDispatch } from "react-redux";
import {
    loadConfig,
    loadAuth,
    loadWorkspace,
} from "@octal/store/lib/actions/app";
import client from "@octal/client";
import Auth from "../auth";
import App from "../workspace";

export default React.memo(() => {
    const id = useAuthId();
    const dispatch = useDispatch();
    const [authenticated, setAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        dispatch(loadConfig());
        dispatch(loadWorkspace());
    }, []);

    useEffect(() => {
        if (authenticated === null && !Boolean(id)) {
            dispatch(loadAuth()).then((auth) => {
                if (auth.token && auth.user && auth.roles) {
                    setAuthenticated(true);
                } else {
                    setAuthenticated(false);
                }
            });
        } else {
            if (Boolean(id) && !authenticated) {
                setAuthenticated(true);
            } else if (authenticated) {
                setAuthenticated(false);
            }
        }
    }, [id]);

    useEffect(() => {
        if (!Boolean(authenticated)) {
            client.shutdown();
        }
    }, [authenticated]);

    if (authenticated === null) {
        return <div />;
    }

    if (authenticated) {
        return <App />;
    }

    return <Auth />;
});
