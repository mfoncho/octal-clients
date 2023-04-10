import { Map, OrderedMap } from "immutable";
import React from "react";
import { CatalogRecord, RecordRecord } from "@colab/store";
import { CollectionRecord } from "@colab/store";
import { DragStart } from "react-beautiful-dnd";

export const Records = React.createContext(
    Map<string, OrderedMap<string, RecordRecord>>()
);

export const Collections = React.createContext(OrderedMap<string, CollectionRecord>());

export const Dragged = React.createContext<DragStart | null>(null);

export default React.createContext<CatalogRecord>(new CatalogRecord({}));
