import { List, OrderedMap, Record } from "immutable";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useMemo } from "react";

import { State } from "./index";
import { Store } from "./reducers";
import Actions from "./actions";

import selectors from "./selectors";
import {
    SpacePermissions,
    Presence,
    Calendar,
    Preference,
    RecordRecord,
    CollectionRecord,
    ThreadRecord,
    UserRecord,
    SpaceRecord,
    RecordTaskValueRecord,
    MemberRecord,
    TopicRecord,
    CatalogRecord,
    Drawer,
    DrawerRecord,
} from "./records";

const emptyarr: any = [];

const defaultCatalog = CatalogRecord.make({});

const defaultSpace = SpaceRecord.make({});

const defaultTopic = TopicRecord.make({});

const defaultRecord = RecordRecord.make({});

const defaultCollection = CollectionRecord.make({});

const defaultStringList = List<string>();

const defaultUser = new UserRecord({});

const defaultPresence = new Presence();

const defaultMembers = OrderedMap<string, MemberRecord>();

export class UserChecklist extends Record({
    id: "",
    name: "",
    created_at: "",
    record: new RecordRecord({}),
    catalog: new CatalogRecord({}),
    collection: new CollectionRecord({}),
    users: List<UserRecord>(),
    tasks: List<RecordTaskValueRecord>(),
}) { }

export function useSpaceLoaded(id: string) {
    return useSelector(
        useCallback(
            ({ spaces }: State) => {
                return (spaces.getSpace(id) ?? defaultSpace).loaded;
            },
            [id]
        )
    );
}

export function useCatalogLoaded(id: string) {
    return useSelector(
        useCallback(
            ({ catalogs }: State) => {
                return (catalogs.getCatalog(id) ?? defaultCatalog).loaded;
            },
            [id]
        )
    );
}

export function useDrawer<T = undefined>(
    id: string,
    defaultProps?: T
): Drawer<T> {
    const drawer: T extends undefined ? undefined : Drawer<T> = (
        defaultProps === undefined
            ? undefined
            : DrawerRecord.make<T>(defaultProps!)
    ) as any;
    const selector = useCallback(
        ({ drawers }: State) => {
            return drawers.getDrawer<T>(id) ?? drawer;
        },
        [id]
    );
    return useSelector(selector) ?? (drawer as any);
}

export function useCalendar(id: string) {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    let calendar = Calendar.make({
        id,
        year,
        month,
    });
    const selector = useCallback(
        ({ calendars }: State) => {
            return calendars.getCalendar(id) ?? calendar;
        },
        [id]
    );
    return useSelector(selector);
}

export function useStore(store: Store) {
    return useSelector(
        useCallback(
            (root: State) => {
                return root.get(store);
            },
            [store]
        )
    );
}

export function useTopicsStore() {
    return useSelector(selectors.topics);
}

export function useRecordsStore() {
    return useSelector(selectors.records);
}

export function useCollectionsStore() {
    return useSelector(selectors.collections);
}

export function useCatalogsStore() {
    return useSelector(selectors.catalogs);
}

export function usePreferences() {
    return useSelector(selectors.preferences);
}

export function usePreference(preference: Preference) {
    const selector = useCallback(
        ({ preferences }: State) => {
            return preferences.get(preference);
        },
        [preference]
    );
    return useSelector(selector);
}

export function useSpaceTopicsIndex(
    space_id: string,
    defaultValue = defaultStringList
) {
    const selector = useCallback(
        ({ topics }: State) => {
            return topics.spaces.get(space_id, defaultValue);
        },
        [space_id]
    );
    return useSelector(selector);
}

export function useCollectionRecordsIndex(id: string) {
    const selector = useCallback(
        ({ records }: State) => {
            return records.collections.get(id, defaultStringList);
        },
        [id]
    );
    return useSelector(selector);
}

export function useDateRecordsIndex(date: string) {
    const selector = useCallback(
        ({ records: store }: State) => {
            return store.dates.get(date, defaultStringList);
        },
        [date]
    );
    return useSelector(selector);
}

export function useUserRecordsIndex(id: string) {
    const selector = useCallback(
        ({ records }: State) => {
            return records.users.get(id, defaultStringList);
        },
        [id]
    );
    return useSelector(selector);
}

export function useCatalogRecordsIndex(id: string) {
    const selector = useCallback(
        ({ records }: State) => {
            return records.catalogs.get(id, defaultStringList);
        },
        [id]
    );
    return useSelector(selector);
}

export function useSpaceCatalogs(id: string) {
    const store = useCatalogsStore();
    return useSpaceTopicsIndex(id)
        .map((id) => store.getCatalog(id)!)
        .filter(Boolean);
}

export function useSpaceTopics(id: string) {
    const store = useTopicsStore();
    return useSpaceTopicsIndex(id)
        .map((id) => store.getTopic(id)!)
        .filter(Boolean);
}

export function useTopic(id: string, defaultValue = defaultTopic) {
    const selector = useCallback(
        ({ topics }: State) => {
            return topics.entities.get(id, defaultValue);
        },
        [id]
    );
    return useSelector(selector);
}

export function usePresence(id?: string) {
    const selector = useCallback(
        ({ presence, auth }: State) => {
            return presence.get(id ?? auth.id);
        },
        [id]
    );
    return useSelector(selector) ?? defaultPresence;
}

export function useWorkspace() {
    return useSelector(selectors.workspace);
}

export const useSite = useWorkspace;

export function useStatus(id?: string) {
    const selector = useCallback(
        ({ users, auth }: State) => {
            let user = users.entities.get(id ?? auth.id) ?? defaultUser;
            return user.status;
        },
        [id]
    );
    return useSelector(selector) ?? defaultPresence;
}

export function useMembers(id?: string) {
    const select = useCallback(
        id
            ? ({ members }: State) => {
                return members.get(id, defaultMembers);
            }
            : selectors.members,
        [id]
    );
    return useSelector(select);
}

export function useRoles() {
    return useSelector(selectors.roles);
}

export function useThreadProp<T = any>(
    id: string,
    prop: string
): T | undefined {
    const selector = useCallback(
        ({ threads }: State) => {
            if (threads.threads.has(id)) {
                return threads.threads.get(id)?.getIn([prop]);
            }
        },
        [id]
    );
    return useSelector(selector) as T | undefined;
}

export function useThread(id: string) {
    const selector = useCallback(
        ({ threads }: State) => {
            if (threads.threads.has(id)) {
                return threads.threads.get(id) as ThreadRecord;
            }
        },
        [id]
    );
    return useSelector(selector);
}

export function useThreadSearchFilter(id: string) {
    const selector = useCallback(
        ({ threads }: State) => {
            return threads.getSearchFilter(id);
        },
        [id]
    );
    return useSelector(selector);
}
export function useConfig() {
    return useSelector(selectors.config);
}

export function useCatalogStore() {
    return useSelector(selectors.catalogs);
}

export function useCatalog(id: string, defaultValue = defaultCatalog) {
    const selector = useCallback(
        ({ catalogs }: State) => {
            return catalogs.entities.get(id, defaultValue);
        },
        [id]
    );
    return useSelector(selector);
}

export function useSpaceCatalogsIndex(
    id: string,
    defaultValue = defaultStringList
) {
    const selector = useCallback(
        ({ catalogs }: State) => {
            return catalogs.spaces.get(id, defaultValue);
        },
        [id]
    );
    return useSelector(selector);
}

export function useUser(id?: string) {
    const selector = useCallback(
        ({ users, auth }: State) => {
            return users.getUser(id ?? auth.id);
        },
        [id]
    );

    return useSelector(selector) ?? defaultUser;
}

export function useProfile(id: string) {
    const user = useUser(id);
    const dispatch = useDispatch();
    if (user.roles.isEmpty()) {
        dispatch(Actions.User.loadUser(id));
    }
    return user;
}

export function useUsers(ids?: Array<string> | List<string>) {
    const users = useSelector(selectors.users);

    return useMemo(() => {
        if (ids && List.isList(ids)) {
            return ids
                .map((id) => users.getUser(id)!)
                .filter(Boolean)
                .toMap()
                .mapKeys((_index, value) => value.id);
        }
        return users.entities;
    }, [users, ids ? ids.sort().join(",") : null]);
}

export function useThreads(id?: string) {
    const selector = useCallback(
        ({ threads, route }: State) => {
            if (id) {
                return threads.threads.get(id);
            } else {
                return threads.threads.get(route.params.get("space_id"));
            }
        },
        [id]
    );
    return useSelector(selector);
}

export function useAuth() {
    return useSelector(selectors.auth);
}

export function useAuthId() {
    return useAuth().id;
}

export function useViewer() {
    const id = useAuthId();

    const user = useUser(id)!;

    const dispatch = useDispatch();

    function setStatus(sid: string) {
        dispatch({ type: "SET_STATUS", payload: sid });
    }

    function setNames(names: string) {
        dispatch({ type: "SET_NAMES", payload: names });
    }

    function setEmail(email: string) {
        dispatch({ type: "SET_EMAIL", payload: email });
    }

    function setPassword(password: string) {
        dispatch({ type: "SET_PASSWORD", payload: password });
    }

    function setDisplayName(name: string) {
        dispatch({ type: "SET_DISPLAY_NAME", payload: name });
    }

    return {
        id,
        user,
        viewer: user,
        setEmail,
        setNames,
        setStatus,
        setPassword,
        setDisplayName,
    };
}

export function useSpaceMembers() {
    return emptyarr;
}

export function useName(id: string) {
    const selector = useCallback(
        ({ names }: State) => {
            return names.entities.get(id);
        },
        [id]
    );
    return useSelector(selector);
}

export function useMessage(id: string) {
    const selector = useCallback(
        ({ threads }: State) => {
            return threads.getMessage(id);
        },
        [id]
    );
    return useSelector(selector);
}

export function useSpace(id: string, defaultValue = defaultSpace) {
    const select = useCallback(
        ({ spaces }: State) => {
            return spaces.entities.get(id, defaultValue);
        },
        [id]
    );
    return useSelector(select);
}

export function useSpaces() {
    return useSelector(selectors.spaces);
}

export function useDirectSpaces() { }

export function useCatalogCollections(id: string) {
    const store = useCollectionsStore();
    const selector = useCallback(
        ({ collections }: State) => {
            return collections.catalogs.get(id, defaultStringList);
        },
        [id]
    );
    return useSelector(selector)
        .map((id) => store.getCollection(id)!)
        .filter(Boolean);
}

export function useCatalogRecords(id: string) {
    const store = useRecordsStore();
    const selector = useCallback(
        ({ records }: State) => {
            return records.catalogs.get(id, defaultStringList);
        },
        [id]
    );
    return useSelector(selector)
        .map((id) => store.getRecord(id)!)
        .filter(Boolean);
}

export function useUserRecords(id: string) {
    const store = useRecordsStore();
    const selector = useCallback(
        ({ records }: State) => {
            return records.users.get(id, defaultStringList);
        },
        [id]
    );
    return useSelector(selector)
        .map((id) => store.getRecord(id)!)
        .filter(Boolean);
}

export function useCollectionRecords(id: string) {
    const store = useRecordsStore();
    const selector = useCallback(
        ({ records }: State) => {
            return records.collections.get(id, defaultStringList);
        },
        [id]
    );
    return useSelector(selector)
        .map((id) => store.getRecord(id)!)
        .filter(Boolean);
}

export function useCollection(id: string, defaultValue = defaultCollection) {
    const selector = useCallback(
        ({ collections }: State) => {
            return collections.entities.get(id, defaultValue);
        },
        [id]
    );
    return useSelector(selector);
}

export function useRecord(id: string, defaultValue = defaultRecord) {
    const selector = useCallback(
        ({ records }: State) => {
            return records.entities.get(id, defaultValue);
        },
        [id]
    );
    return useSelector(selector) as RecordRecord | null;
}

export function useLabels(id: string) {
    const { labels } = useCatalog(id)!;
    return labels;
}

// Naive
export function useUserChecklists(user_id: string): List<UserChecklist> {
    const selector = useCallback(
        ({ records, catalogs, collections, users }: State) => {
            return records.users
                .get(user_id, defaultStringList)
                .filter((record_id) => {
                    let record = records.entities.get(record_id, defaultRecord);
                    return !record.archived && record.assigned.includes(user_id);
                })
                .reduce((acc, record_id) => {
                    let record = records.entities.get(record_id)!;
                    let checklists = record.fields
                        .filter(
                            (field) =>
                                field.type === "checklist" &&
                                field.users.includes(user_id)
                        )
                        .map((checklist) => {
                            let payload = {
                                id: checklist.id,
                                name: checklist.name,
                                users: checklist.users.map(
                                    (id) => users.getUser(id)!
                                ),
                                tasks: checklist.values,
                                collection: collections.entities.get(record.collection_id),
                                catalog: catalogs.entities.get(
                                    record.catalog_id,
                                    defaultCatalog
                                ),
                                record: records.entities.get(record_id, defaultRecord),
                                created_at: checklist.created_at,
                            };
                            return new UserChecklist(payload as any);
                        });
                    return acc.concat(checklists);
                }, List<UserChecklist>());
        },
        [user_id]
    );
    return useSelector(selector);
}

export function useUserAssignedRecordsIndex(user_id: string) {
    const selector = useCallback(
        ({ records }: State) => {
            return records.users
                .get(user_id, defaultStringList)
                .filter((record_id) => {
                    let record = records.entities.get(record_id, defaultRecord);
                    return !record.archived && record.assigned.includes(user_id);
                })
                .sort()
                .join(",");
        },
        [user_id]
    );
    return useSelector(selector).split(",").filter(Boolean);
}

export function useUserInvolvedRecordsIndex(id: string) {
    const selector = useCallback(
        ({ records: store }: State) => {
            return store.users.get(id, defaultStringList);
        },
        [id]
    );
    return useSelector(selector);
}

export function useCatalogFilter(id: string) {
    return useCatalog(id).filter;
}

export function useCalendarLoaded() {
    return useSelector(selectors.calendarLoaded);
}

export function useUnreadCount(id: string) {
    const selector = useCallback(
        ({ threads: store }: State) => {
            return store.getThread(id)?.unread_count ?? 0;
        },
        [id]
    );
    return useSelector(selector);
}

export function useBookmark(id: string) {
    const selector = useCallback(
        ({ bookmarks: store }: State) => {
            return store.entities.get(id);
        },
        [id]
    );
    return useSelector(selector);
}

export function useEntityBookmark(id: string) {
    const selector = useCallback(
        ({ bookmarks: store }: State) => {
            return store.getEntityBookmark(id);
        },
        [id]
    );
    return useSelector(selector);
}

export function useBookmarked(id: string) {
    const selector = useCallback(
        ({ bookmarks: store }: State) => {
            return store.isBookmarked(id);
        },
        [id]
    );
    return useSelector(selector);
}

export function useTracker(id: string) {
    const selector = useCallback(
        ({ trackers: store }: State) => {
            return store.trackers.get(id);
        },
        [id]
    );
    return useSelector(selector);
}

export function useTrackers(id: string) {
    const selector = useCallback(
        ({ trackers: store }: State) => {
            return store.entities.get(id, defaultStringList);
        },
        [id]
    );

    const store = useSelector(selectors.trackers);

    const targets = useSelector(selector);

    return useMemo(() => {
        return targets
            .map((id) => {
                return store.trackers.get(id)!;
            })
            .filter(Boolean);
    }, [targets, store]);
}

export function useActionTrackers(id: string) {
    const trackers = useTrackers(id);

    return useMemo(() => {
        return trackers
            .toMap()
            .mapKeys((_key, tracker) => {
                return `${tracker.target}:${tracker.event}`;
            })
            .map((tracker) => {
                return tracker.id;
            });
    }, [trackers]);
}

export function usePermissions() {
    const user = useUser();
    const roles = useRoles();
    return useMemo(() => {
        return user.roles
            .map((id) => roles.get(id)!)
            .filter(Boolean)
            .reduce((permissions, role) => {
                return role.permissions
                    .toSeq()
                    .reduce((permissions, permission, key) => {
                        switch (typeof permission.value) {
                            case "number": {
                                let value = permissions.get(
                                    key,
                                    permission.value
                                );
                                return permissions.set(
                                    key,
                                    Math.max(permission.value, value as number)
                                );
                            }
                            case "boolean": {
                                let value = permissions.get(
                                    key,
                                    permission.value
                                );
                                return permissions.set(
                                    key,
                                    permission.value || value
                                );
                            }

                            default:
                                return permissions.set(key, permission.value);
                        }
                    }, permissions);
            }, SpacePermissions);
    }, [roles]);
}

export function useSpacePermissions(id: string) {
    const user = useUser();
    const auth = useAuth();
    const roles = useRoles();
    const space = useSpace(id);
    return useMemo(() => {
        if (!auth.claimed) return SpacePermissions;

        return user.roles
            .map((id) => roles.get(id)!)
            .filter(Boolean)
            .filter((role) => {
                if (space.is_direct) {
                    return role.is_default;
                }
                return true;
            })
            .map((role) => {
                const permissions = space.roles.get(role.id)?.permissions;
                if (permissions) {
                    return permissions.toSeq().reduce((role, value, key) => {
                        let permission = role.permissions.get(key);
                        if (permission) {
                            if (permission.overwrite) {
                                return role;
                            }
                            let path = ["permissions", key, "value"];
                            return role.setIn(path, value);
                        }
                        return role;
                    }, role);
                }

                return role;
            })
            .reduce((permissions, role) => {
                return role.permissions
                    .toSeq()
                    .reduce((permissions, permission, key) => {
                        switch (typeof permission.value) {
                            case "number": {
                                let value = permissions.get(
                                    key,
                                    permission.value
                                );
                                return permissions.set(
                                    key,
                                    Math.max(permission.value, value as number)
                                );
                            }
                            case "boolean": {
                                let value = permissions.get(
                                    key,
                                    permission.value
                                );
                                return permissions.set(
                                    key,
                                    permission.value || value
                                );
                            }

                            default:
                                return permissions.set(key, permission.value);
                        }
                    }, permissions);
            }, SpacePermissions);
    }, [auth, roles, user.roles, space.roles]);
}
