import React from "react";
import { OrderedMap } from "immutable";
import {
    SpacePermissions,
    SpaceRecord,
    MemberRecord,
    ThreadRecord,
    SpaceRoleRecord,
} from "@colab/store";

const Space = React.createContext(new SpaceRecord({}));

export const Members = React.createContext(OrderedMap<string, MemberRecord>());

export const Threads = React.createContext(OrderedMap<string, ThreadRecord>());

export const Roles = React.createContext(OrderedMap<string, SpaceRoleRecord>());

export const Permissions = React.createContext(SpacePermissions);

export const Member = React.createContext(new MemberRecord());

export const Tool = React.createContext({
    name: null as string | null,
    open: (tool: any, props: any) => {},
    close: () => {},
});

export default Space;
