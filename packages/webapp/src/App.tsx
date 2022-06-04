import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { Screen } from "@octal/ui";
import store from "@octal/store";
import Judge from "./judge";
import { useScreen } from "@octal/ui";

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
            <BrowserRouter>
                <Main />
            </BrowserRouter>
        </Provider>
    );
}
