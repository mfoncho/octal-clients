import React, { useEffect } from "react";
import { useAuthId } from "@octal/store";
import { useDispatch } from "react-redux";
import { Actions } from "@octal/store";
import Auth from "../auth";
import App from "../workspace";

export default React.memo(() => {
    const id = useAuthId();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(Actions.App.loadConfig());
        dispatch(Actions.App.loadWorkspace());
    }, []);

    useEffect(() => {
        if (Boolean(id)) {
            dispatch(Actions.App.loadAuth());
        }
    }, [id]);

    if (Boolean(id)) {
        return <App />;
    }

    return <Auth />;
});
