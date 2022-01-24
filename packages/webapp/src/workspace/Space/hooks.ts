import { useContext, useMemo, useEffect, useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { List } from "immutable";
import Space, { Permissions, Tool, Members, Member } from "./Context";
import { postMessage, threadActivity } from "@octal/store/lib/actions/thread";
import * as RoleActions from "@octal/store/lib/actions/role";
import {
    createTopic as createSpaceTopic,
    CreateTopicPayload,
} from "@octal/store/lib/actions/topic";
import { createBoard as createSpaceBoard } from "@octal/store/lib/actions/board";
import {
    useThread,
    usePermissionsSet,
    PermissionsRecord,
    SpaceRecord,
    UserRecord,
    useUsers,
    useSpaceTopicsIndex,
    TopicRecord,
    useStore,
} from "@octal/store";
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
    return useSpaceTopicsIndex(params.space_id).map((id) => store.getTopic(id));
}

export function useUserMentionable() {
    const users = useSpaceUsers();

    return useMemo(() => {
        const filter = ({ user }: IMentionUser, name: string) => {
            return user.name.includes(name) || user.username.includes(name);
        };
        const mentions: IMentionUser[] = users
            .map((user) => ({ value: "@" + user.id, user: user }))
            .toList()
            .toArray();
        return {
            filter,
            mentions,
        };
    }, [users]);
}

export function useTopicMentionable() {
    const topics = useTopics() ?? List<TopicRecord>();
    return useMemo(() => {
        const filter = ({ topic }: IMentionTopic, name: string) => {
            return topic.name.includes(name);
        };
        const mentions: IMentionTopic[] = topics
            .map((topic) => ({ value: "#" + topic.id, topic: topic }))
            .toList()
            .toArray();
        return {
            filter,
            mentions,
        };
    }, [topics]);
}

export function useMentionable() {
    const users = useUserMentionable();
    const topics = useTopicMentionable();
    return useMemo(() => {
        return { "@": users, "#": topics };
    }, [users, topics]);
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

export function usePermissionsCombo(
    { roles }: SpaceRecord = new SpaceRecord({})
) {
    const set = usePermissionsSet();
    return useMemo(() => {
        return set.reduce((record, value, key) => {
            let permissions = record ?? value;
            let role = roles.get(key);
            if (role) {
                return role.permissions.reduce(
                    (permissions: any, perm: any) => {
                        return permissions.mergeIn([perm.name], perm);
                    },
                    permissions
                );
            } else if (permissions == record) {
                return permissions;
            } else {
                return permissions.toSeq().reduce((record, item) => {
                    if (record.has(item.name)) {
                        return record.update(item.name as any, (perm) => {
                            const type = typeof perm.value;

                            if (type == "boolean") {
                                return perm.set(
                                    "value",
                                    (item.value as any) || perm.value
                                );
                            } else if (type == "string") {
                                return perm;
                            }
                        });
                    } else {
                        return record;
                    }
                }, permissions);
            }
        }, (null as any) as PermissionsRecord);
    }, [roles, set]);
}

export function usePermissions() {
    return useContext(Permissions);
}

export function useSettings() {
    const permissions = usePermissions();
    return permissions.manage_space;
}

export function usePostInput(id: string) {
    const thread = useThread(id);

    const dispatch = useDispatch();

    const permissions = usePermissions();

    const [upload, setUpload] = useState<{ max: number; accept: string }>();

    useEffect(() => {
        setUpload({
            max: permissions.upload_limit.value,
            accept: permissions.upload_types.value,
        });
    }, [permissions.upload_limit.value, permissions.upload_types.value]);

    const onChange = useCallback(() => {
        const action = threadActivity({
            type: "typing",
            thread_id: thread!.id,
            space_id: thread!.space_id,
        });
        dispatch(action);
    }, [thread?.id]);

    const onSubmit = useCallback(
        (payload: any) => {
            const params = {
                thread_id: thread?.id,
                markdown: permissions.use_markdown.value,
                space_id: thread?.space_id,
                content: payload.text,
                attachment: payload.file,
            };
            dispatch(postMessage(params));
        },
        [thread?.id]
    );

    return {
        onChange,
        onSubmit,
        upload,
        multiline: permissions.use_markdown.value,
        disabled: !permissions.post_message.value,
    };
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

    const createBoard = useCallback(
        (params: { name: string }) => {
            const action = createSpaceBoard({
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

    const setPermissions = useCallback(
        (
            id: string,
            permissions: {
                [key: string]: string | number | string[] | number[];
            }
        ) => {
            const action = RoleActions.setSpacePermissions({
                space_id: space.id,
                role_id: id,
                params: permissions,
            });
            return dispatch(action);
        },
        [space.id]
    );

    return { createRole, createBoard, deleteRole, setPermissions, createTopic };
}
