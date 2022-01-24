import React from "react";
import { List, OrderedMap } from "immutable";
import {
    PermissionsRecord,
    CardRecord,
    SpaceRecord,
    MemberRecord,
    ColumnRecord,
    ThreadRecord,
    SpaceRoleRecord,
} from "@octal/store/lib/records";

const Space = React.createContext(new SpaceRecord({ permissions: {} }));

export const Members = React.createContext(OrderedMap<string, MemberRecord>());

export const Threads = React.createContext(OrderedMap<string, ThreadRecord>());

export const Roles = React.createContext(OrderedMap<string, SpaceRoleRecord>());

export const Permissions = React.createContext(new PermissionsRecord());

export const Member = React.createContext(new MemberRecord());

export const Tool = React.createContext({
    name: null as string | null,
    open: (tool: any, props: any) => { },
    close: () => { },
});

export default Space;
