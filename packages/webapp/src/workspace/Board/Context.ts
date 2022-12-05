import { Map, OrderedMap } from "immutable";
import React from "react";
import { BoardRecord, CardRecord } from "@colab/store";
import { CollectionRecord } from "@colab/store";
import { DragStart } from "react-beautiful-dnd";

export const Cards = React.createContext(
    Map<string, OrderedMap<string, CardRecord>>()
);

export const Collections = React.createContext(OrderedMap<string, CollectionRecord>());

export const Dragged = React.createContext<DragStart | null>(null);

export default React.createContext<BoardRecord>(new BoardRecord({}));
