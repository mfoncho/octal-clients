import React from "react";
import { Actions, Card } from "./Context";

export function useActions() {
    return React.useContext(Actions);
}

export function useCard() {
    return React.useContext(Card);
}
