import React from "react";
import { Actions, Collection, Records } from "./Context";

export function useActions() {
    return React.useContext(Actions);
}

export function useCollection() {
    return React.useContext(Collection);
}

export function useRecords() {
    return React.useContext(Records);
}
