import React from "react";
import { createRoot } from 'react-dom/client';
import ReactDOM from "react-dom";
import client from "@octal/client";
import * as theme from "./theme";
import reportWebVitals from "./reportWebVitals";
import * as interceptor from "./interceptors";
import "./tailwind.css";
import "react-perfect-scrollbar/dist/css/styles.css";
import "emoji-mart/css/emoji-mart.css";
import "./index.css";
import "./presence.css";
import App from "./App";

const interceptors = {
    request: interceptor.auth,
    response: { success: interceptor.success, error: interceptor.error },
};

client.intercept(interceptors);

window.api = client;
window.theme = theme;

function init(cmp: any, node: any) {
    const root = createRoot(node);
    root.render(React.createElement(cmp))
}

const root = document.getElementById("root");

theme.apply("primary", theme.colors.indigo);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA

init(App, root);

reportWebVitals();
