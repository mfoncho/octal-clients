import { useCallback, useState, useRef } from "react";
import { useNavigate, generatePath } from "react-router-dom";
import paths from "./paths";

export function useNavigator() {
    const navigate = useNavigate();

    const openRoles = useCallback(() => {
        navigate(paths.roles);
    }, []);

    const openUsers = useCallback(() => {
        navigate(paths.users);
    }, []);

    const openSpaces = useCallback(() => {
        navigate(paths.spaces);
    }, []);

    const openWorkspace = useCallback(() => {
        navigate(paths.workspace);
    }, []);

    const openSpace = useCallback((params: { id: string }) => {
        const path = generatePath(paths.space, {
            space_id: params.id,
        });
        navigate(path);
    }, []);

    const openUser = useCallback((params: { id: string }) => {
        const path = generatePath(paths.user, {
            user_id: params.id,
        });
        navigate(path);
    }, []);

    const openRole = useCallback((params: { id: string }) => {
        const path = generatePath(paths.role, {
            role_id: params.id,
        });
        navigate(path);
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
