import React from "react";
import { Actions, Collection, Cards } from "./Context";

export function useActions() {
    return React.useContext(Actions);
}

export function useCollection() {
    return React.useContext(Collection);
}

export function useCards() {
    return React.useContext(Cards);
}
