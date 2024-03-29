import { useContext, useMemo, useEffect, useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { List } from "immutable";
import Space, { Permissions, Tool, Members, Member } from "./Context";
import * as RoleActions from "@colab/store/lib/actions/role";
import {
    createTopic as createSpaceTopic,
    CreateTopicPayload,
} from "@colab/store/lib/actions/topic";
import { createCatalog as createSpaceCatalog } from "@colab/store/lib/actions/catalog";
import emoji from "@colab/emoji";
import {
    SpaceRecord,
    SpaceRoleRecord,
    UserRecord,
    useUsers,
    useSpaceTopicsIndex,
    TopicRecord,
    useStore,
} from "@colab/store";
import { useParams } from "react-router-dom";

export interface IMentionUser {
    value: string;
    user: UserRecord;
}

export interface IMentionTopic {
    value: string;
    topic: TopicRecord;
}

export function useSpaceUsers() {
    const members = useMembers();
    const [ids, setIds] = useState<string[]>([]);
    useEffect(() => {
        setIds(
            members
                .map((member) => member.user_id)
                .toList()
                .toJS() as string[]
        );
    }, [members]);
    return useUsers(ids);
}

export function useTopics(): List<TopicRecord> {
    const params = useParams<{ space_id: string }>();
    const store = useStore("topics") as any;
    return useSpaceTopicsIndex(params.space_id!).map((id) =>
        store.getTopic(id)
    );
}

export function useUserSuggestable() {
    const users = useSpaceUsers();

    return useMemo(() => {
        let suggest = (name: string) => {
            name = name.substring(1);
            return new Promise((resolve) => {
                let values = users
                    .toList()
                    .filter((user) => {
                        return (
                            user.name.includes(name) ||
                            user.username.includes(name)
                        );
                    })
                    .toList()
                    .map((user) => {
                        let value = `<user:${user.id}>`;
                        return { value, user };
                    })
                    .toJS();
                resolve(values);
            });
        };
        return { suggest, pattern: "@\\w+", type: "mention" };
    }, [users]);
}

export function useTopicSuggestable() {
    const topics = useTopics() ?? List<TopicRecord>();
    return useMemo(() => {
        let suggest = (name: string) => {
            name = name.substring(1);
            return new Promise((resolve) => {
                let values = topics
                    .filter((topic) => {
                        return topic.name.includes(name);
                    })
                    .map((topic) => {
                        let value = `<topic:${topic.id}>`;
                        return { value, topic };
                    })
                    .toJS();
                resolve(values);
            });
        };
        return { suggest, pattern: "#\\w+", type: "mention" };
    }, [topics]);
}

export function useSuggestable() {
    const user = useUserSuggestable();
    const topic = useTopicSuggestable();
    return useMemo(() => {
        return {
            user,
            topic,
            emoji: emoji.suggestable,
        };
    }, [user, topic]);
}

export function useTool() {
    return useContext(Tool);
}

export function useMembers() {
    return useContext(Members);
}

export function useMember() {
    return useContext(Member);
}

export function useSpace() {
    return useContext(Space);
}

export function usePermissions() {
    return useContext(Permissions);
}

export function useSettings() {
    const permissions = usePermissions();
    return permissions.get("space.manage") as boolean;
}

export function useActions(space: SpaceRecord) {
    const dispatch = useDispatch();

    const createTopic = useCallback(
        (params: Omit<CreateTopicPayload, "space_id">) => {
            const action = createSpaceTopic({
                ...params,
                space_id: space.id,
            });
            return dispatch(action);
        },
        [space.id]
    );

    const createCatalog = useCallback(
        (params: { name: string }) => {
            const action = createSpaceCatalog({
                params,
                space_id: space.id,
            });
            return dispatch(action);
        },
        [space.id]
    );

    const createRole = useCallback(
        (id: string) => {
            const action = RoleActions.createSpaceRole({
                space_id: space.id,
                role_id: id,
            });
            return dispatch(action);
        },
        [space.id]
    );

    const deleteRole = useCallback(
        (id: string) => {
            const action = RoleActions.deleteSpaceRole({
                space_id: space.id,
                role_id: id,
            });
            return dispatch(action);
        },
        [space.id]
    );

    return {
        createRole,
        deleteRole,
        createCatalog,
        createTopic,
    };
}

export function useRoleActions(role: SpaceRoleRecord) {
    const dispatch = useDispatch();
    const deleteRole = useCallback(() => {
        const action = RoleActions.deleteSpaceRole({
            space_id: role.space_id,
            role_id: role.role_id,
        });
        return dispatch(action);
    }, [role.role_id]);

    const setPermission = useCallback(
        (name: string, value: string | boolean | number) => {
            const action = RoleActions.setSpacePermission({
                space_id: role.space_id,
                role_id: role.role_id,
                params: {
                    value: value,
                    name: name,
                },
            });
            return dispatch(action);
        },
        [role.role_id]
    );

    const unsetPermission = useCallback(
        (name: string) => {
            const action = RoleActions.unsetSpacePermission({
                role_id: role.role_id,
                space_id: role.space_id,
                params: {
                    name,
                },
            });
            return dispatch(action);
        },
        [role.role_id]
    );
    return { deleteRole, setPermission, unsetPermission };
}
