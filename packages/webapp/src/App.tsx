import React, { useMemo } from "react";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import { Screen } from "@octal/ui";
import breakpoints from "./breakpoints";
import store from "@octal/store";
import history from "./history";
import Judge from "./judge";
import { useMediaQuery } from "src/hooks";

function useScreen() {
    const mobile = useMediaQuery(breakpoints.down("sm"));
    const tablet = useMediaQuery(breakpoints.only("md"));
    const desktop = useMediaQuery(breakpoints.up("lg"));

    return useMemo(() => {
        return { mobile, tablet, desktop };
    }, [mobile, tablet, desktop]);
}

const Main = React.memo(() => {
    const screen = useScreen();
    if (screen.tablet || screen.desktop || screen.mobile) {
        return (
            <Screen.Context.Provider value={screen}>
                <Judge />
            </Screen.Context.Provider>
        );
    }
    return <div />;
});

export default function App() {
    return (
        <Provider store={store}>
            <Router history={history}>
                <Main />
            </Router>
        </Provider>
    );
}
