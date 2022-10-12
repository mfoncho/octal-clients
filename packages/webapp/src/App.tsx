import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { Screen } from "@colab/ui";
import store from "@colab/store";
import Judge from "./judge";
import { useScreen } from "@colab/ui";

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
