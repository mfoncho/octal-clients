import { List, OrderedMap, Record } from "immutable";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useMemo } from "react";

import { State } from "./index";
import { Store } from "./reducers";

import selector from "./selectors";
import {
    SpacePermissions,
    Presence,
    Calendar,
    CardRecord,
    ColumnRecord,
    ThreadRecord,
    UserRecord,
    SpaceRecord,
    CardTaskValueRecord,
    MemberRecord,
    TopicRecord,
    BoardRecord,
    Drawer,
    DrawerRecord,
} from "./records";

const emptyarr: any = [];

const defaultBoard = BoardRecord.make({});

const defaultSpace = SpaceRecord.make({});

const defaultTopic = TopicRecord.make({});

const defaultCard = CardRecord.make({});

const defaultColumn = ColumnRecord.make({});

const defaultStringList = List<string>();

const defaultUser = new UserRecord({});

const defaultPresence = new Presence();

const defaultMembers = OrderedMap<string, MemberRecord>();

export class UserChecklist extends Record({
    id: "",
    name: "",
    created_at: "",
    card: new CardRecord({}),
    board: new BoardRecord({}),
    column: new ColumnRecord({}),
    users: List<UserRecord>(),
    tasks: List<CardTaskValueRecord>(),
}) {}

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

export function useBoardLoaded(id: string) {
    return useSelector(
        useCallback(
            ({ boards }: State) => {
                return (boards.getBoard(id) ?? defaultBoard).loaded;
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
    return useSelector(selector.topics);
}

export function useCardsStore() {
    return useSelector(selector.cards);
}

export function useColumnsStore() {
    return useSelector(selector.columns);
}

export function useBoardsStore() {
    return useSelector(selector.boards);
}

export function usePreferences() {
    return useSelector(selector.preferences);
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

export function useTrackers(id: string) {
    const selector = useCallback(
        ({ trackers }: State) => {
            return trackers.entities.get(id, defaultStringList);
        },
        [id]
    );
    return useSelector(selector);
}

export function useColumnCardsIndex(id: string) {
    const selector = useCallback(
        ({ cards }: State) => {
            return cards.columns.get(id, defaultStringList);
        },
        [id]
    );
    return useSelector(selector);
}

export function useDateCardsIndex(date: string) {
    const selector = useCallback(
        ({ cards: store }: State) => {
            return store.dates.get(date, defaultStringList);
        },
        [date]
    );
    return useSelector(selector);
}

export function useUserCardsIndex(id: string) {
    const selector = useCallback(
        ({ cards }: State) => {
            return cards.users.get(id, defaultStringList);
        },
        [id]
    );
    return useSelector(selector);
}

export function useBoardCardsIndex(id: string) {
    const selector = useCallback(
        ({ cards }: State) => {
            return cards.boards.get(id, defaultStringList);
        },
        [id]
    );
    return useSelector(selector);
}

export function useSpaceBoards(id: string) {
    const store = useBoardsStore();
    return useSpaceTopicsIndex(id)
        .map((id) => store.getBoard(id)!)
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
    return useSelector(selector.workspace);
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
            : selector.members,
        [id]
    );
    return useSelector(select);
}

export function useRoles() {
    return useSelector(selector.roles);
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

export function useConfig() {
    return useSelector(selector.config);
}

export function useBoardStore() {
    return useSelector(selector.boards);
}

export function useBoard(id: string, defaultValue = defaultBoard) {
    const selector = useCallback(
        ({ boards }: State) => {
            return boards.entities.get(id, defaultValue);
        },
        [id]
    );
    return useSelector(selector);
}

export function useSpaceBoardsIndex(
    id: string,
    defaultValue = defaultStringList
) {
    const selector = useCallback(
        ({ boards }: State) => {
            return boards.spaces.get(id, defaultValue);
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

export function useUsers(ids?: Array<string> | List<string>) {
    const users = useSelector(selector.users);

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
    return useSelector(selector.auth);
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
    return useSelector(selector.spaces);
}

export function useDirectSpaces() {}

export function useBoardColumns(id: string) {
    const store = useColumnsStore();
    const selector = useCallback(
        ({ columns }: State) => {
            return columns.boards.get(id, defaultStringList);
        },
        [id]
    );
    return useSelector(selector)
        .map((id) => store.getColumn(id)!)
        .filter(Boolean);
}

export function useBoardCards(id: string) {
    const store = useCardsStore();
    const selector = useCallback(
        ({ cards }: State) => {
            return cards.boards.get(id, defaultStringList);
        },
        [id]
    );
    return useSelector(selector)
        .map((id) => store.getCard(id)!)
        .filter(Boolean);
}

export function useUserCards(id: string) {
    const store = useCardsStore();
    const selector = useCallback(
        ({ cards }: State) => {
            return cards.users.get(id, defaultStringList);
        },
        [id]
    );
    return useSelector(selector)
        .map((id) => store.getCard(id)!)
        .filter(Boolean);
}

export function useColumnCards(id: string) {
    const store = useCardsStore();
    const selector = useCallback(
        ({ cards }: State) => {
            return cards.columns.get(id, defaultStringList);
        },
        [id]
    );
    return useSelector(selector)
        .map((id) => store.getCard(id)!)
        .filter(Boolean);
}

export function useColumn(id: string, defaultValue = defaultColumn) {
    const selector = useCallback(
        ({ columns }: State) => {
            return columns.entities.get(id, defaultValue);
        },
        [id]
    );
    return useSelector(selector);
}

export function useCard(id: string, defaultValue = defaultCard) {
    const selector = useCallback(
        ({ cards }: State) => {
            return cards.entities.get(id, defaultValue);
        },
        [id]
    );
    return useSelector(selector) as CardRecord | null;
}

export function useLabels(id: string) {
    const { labels } = useBoard(id)!;
    return labels;
}

export function usePermissionsSet() {
    return useSelector(selector.permissions);
}

// Naive
export function useUserChecklists(user_id: string): List<UserChecklist> {
    const selector = useCallback(
        ({ cards, boards, columns, users }: State) => {
            return cards.users
                .get(user_id, defaultStringList)
                .filter((card_id) => {
                    let card = cards.entities.get(card_id, defaultCard);
                    return !card.archived && card.assigned.includes(user_id);
                })
                .reduce((acc, card_id) => {
                    let card = cards.entities.get(card_id)!;
                    let checklists = card.fields
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
                                column: columns.entities.get(card.column_id),
                                board: boards.entities.get(
                                    card.board_id,
                                    defaultBoard
                                ),
                                card: cards.entities.get(card_id, defaultCard),
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

export function useUserAssignedCardsIndex(user_id: string) {
    const selector = useCallback(
        ({ cards }: State) => {
            return cards.users
                .get(user_id, defaultStringList)
                .filter((card_id) => {
                    let card = cards.entities.get(card_id, defaultCard);
                    return !card.archived && card.assigned.includes(user_id);
                })
                .sort()
                .join(",");
        },
        [user_id]
    );
    return useSelector(selector).split(",").filter(Boolean);
}

export function useUserInvolvedCardsIndex(id: string) {
    const selector = useCallback(
        ({ cards: store }: State) => {
            return store.users.get(id, defaultStringList);
        },
        [id]
    );
    return useSelector(selector);
}

export function useBoardFilter(id: string) {
    return useBoard(id).filter;
}

export function useCalendarLoaded() {
    return useSelector(selector.calendarLoaded);
}

export function usePermissions() {
    return useSelector(selector.permissions);
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

export function useSpacePermissions(id: string) {
    const auth = useAuth();
    const roles = useRoles();
    const space = useSpace(id);
    return useMemo(() => {
        return auth.roles
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
                        if(permission){
                            if (permission.overwrite) {
                                return role;
                            }
                            let path = ["permissions", key, "value"];
                            return role.setIn(path, value);
                        }
                        return role
                    }, role);
                }

                return role;
            })
            .reduce((permissions, role) => {
                return role.permissions
                    .toSeq()
                    .reduce((permissions, permission, key) => {
                        return permissions.set(key, permission.value);
                    }, permissions);
            }, SpacePermissions);
    }, [auth, roles, space.roles]);
}
