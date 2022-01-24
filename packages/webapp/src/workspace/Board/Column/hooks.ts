import React from "react";
import { Actions, Column, Cards } from "./Context";

export function useActions() {
    return React.useContext(Actions);
}

export function useColumn() {
    return React.useContext(Column);
}

export function useCards() {
    return React.useContext(Cards);
}
