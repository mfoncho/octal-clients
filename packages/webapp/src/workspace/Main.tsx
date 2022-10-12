import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import Routes from "@workspace/Routes";
import { INIT } from "@colab/store";
import { usePreference } from "@colab/store";
import * as theme from "src/theme";

export default React.memo(() => {
    const dispatch = useDispatch();
    const color = usePreference("webapp.theme.color");
    React.useEffect(() => {
        //@ts-ignore
        let palette = theme.colors[color as any];
        if (palette) {
            theme.apply("primary", palette);
        }
    }, [color]);
    useEffect(() => {
        dispatch({ type: INIT });
        return () => {
            theme.apply("primary", theme.colors.indigo);
        };
    }, []);
    return <Routes />;
});
