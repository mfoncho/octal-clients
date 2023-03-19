import React from "react";
import { CardRecord } from "@colab/store";
import { DragStart } from "react-beautiful-dnd";

export const Card = React.createContext(new CardRecord({}));
export const Dragged = React.createContext<DragStart | null>(null);
