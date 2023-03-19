import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import Space, { Permissions, Members, Member } from "./Context";
import Main from "./Main";
import { useParams } from "react-router-dom";
import {
    MemberRecord,
    useSpacePermissions,
    useSpace,
    useMembers,
    Actions,
} from "@colab/store";
export * from "./hooks";

const defaultMember = new MemberRecord({});

export const Context = React.memo<{ id: string; children?: any }>((props) => {
    const dispatch = useDispatch();

    const space = useSpace(props.id);

    const members = useMembers(props.id);

    const permissions = useSpacePermissions(space.id);

    useEffect(() => {
        if (space.id && members.size == 0) {
            const params = { space_id: props.id };
            dispatch(Actions.Member.loadMembers(params));
        }
    }, [space.id ? space.id : null]);

    if (space.id.length == 0) return <React.Fragment />;

    return (
        <Space.Provider value={space}>
            <Permissions.Provider value={permissions}>
                <Members.Provider value={members}>
                    <Member.Provider
                        value={members.get(space.member_id, defaultMember)}>
                        {props.children}
                    </Member.Provider>
                </Members.Provider>
            </Permissions.Provider>
        </Space.Provider>
    );
});

export default React.memo<any>(() => {
    const params = useParams<{ space_id: string }>();

    return (
        <Context id={params.space_id!} key={params.space_id}>
            <Main />
        </Context>
    );
});
