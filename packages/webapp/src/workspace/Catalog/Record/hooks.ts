import React from "react";
import { Actions, Record } from "./Context";

export function useActions() {
    return React.useContext(Actions);
}

export function useRecord() {
    return React.useContext(Record);
}
