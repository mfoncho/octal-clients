import { OrderedMap } from "immutable";
import { State } from "./index";
import { MemberRecord } from "./records";

const defaultMembers = OrderedMap<string, MemberRecord>();

export function config({ app: config }: State) {
    return config;
}

export function auth({ auth }: State) {
    return auth;
}

export function users({ users }: State) {
    return users;
}

export function preferences({ preferences }: State) {
    return preferences;
}

export function catalogs({ catalogs }: State) {
    return catalogs;
}

export function records({ records }: State) {
    return records;
}

export function collections({ collections }: State) {
    return collections;
}

export function topics({ topics }: State) {
    return topics;
}

export function roles({ roles }: State) {
    return roles;
}

export function workspace({ workspace }: State) {
    return workspace;
}

export function members({
    members,
    route,
}: State): OrderedMap<string, MemberRecord> {
    return members.get(route.params.get("space_id"), defaultMembers);
}

export function space({ spaces, route }: State) {
    let space_id = route.params.get("space_id");
    if (space_id) {
        return spaces.getSpace(space_id);
    }
}

export function spaces({ spaces }: State) {
    return spaces.entities;
}

export function trackers({ trackers }: State) {
    return trackers;
}

export function threads({ threads, route }: State) {
    return threads.threads.get(route.params.get("space_id"));
}

export function calendarLoaded({ calendars }: State) {
    return calendars.loaded;
}

export default {
    auth,
    trackers,
    users,
    space,
    roles,
    records,
    config,
    spaces,
    catalogs,
    topics,
    threads,
    collections,
    members,
    calendarLoaded,
    workspace,
    preferences,
};
