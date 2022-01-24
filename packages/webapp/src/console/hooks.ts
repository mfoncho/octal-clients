import { useCallback, useState, useRef } from "react";
import { useHistory, generatePath } from "react-router-dom";
import paths from "./paths";

export function useNavigator() {
    const history = useHistory();

    const openRoles = useCallback(() => {
        history.push(paths.roles, {});
    }, []);

    const openUsers = useCallback(() => {
        history.push(paths.users, {});
    }, []);

    const openSpaces = useCallback(() => {
        history.push(paths.spaces, {});
    }, []);

    const openWorkspace = useCallback(() => {
        history.push(paths.workspace, {});
    }, []);

    const openSpace = useCallback((params: { id: string }) => {
        const path = generatePath(paths.space, {
            space_id: params.id,
        });
        history.push(path, params);
    }, []);

    const openUser = useCallback((params: { id: string }) => {
        const path = generatePath(paths.user, {
            user_id: params.id,
        });
        history.push(path, params);
    }, []);

    const openRole = useCallback((params: { id: string }) => {
        const path = generatePath(paths.role, {
            role_id: params.id,
        });
        history.push(path, params);
    }, []);

    return {
        openUser,
        openRole,
        openSpace,
        openRoles,
        openUsers,
        openSpaces,
        openWorkspace,
    };
}

export function usePopover() {
    const ref = useRef<HTMLElement>(null);
    const [open, setOpen] = useState(false);
    const props = {
        popover: {
            open: open,
            anchorEl: ref.current,
            onClose: () => setOpen(false),
        },
        trigger: {
            onClick: (e: React.MouseEvent) => {
                e.stopPropagation();
                e.preventDefault();
                setOpen(true);
            },
        },
    };
    return { open, ref, setOpen, props };
}
