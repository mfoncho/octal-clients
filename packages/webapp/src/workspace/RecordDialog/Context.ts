import React from "react";
import { DragStart } from "react-beautiful-dnd";
export const Dragged = React.createContext<DragStart | null>(null);
