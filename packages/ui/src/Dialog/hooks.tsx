import { useState, useMemo } from "react";

export function useDialog(name: string = "") {
    const [opened, setOpened] = useState<string | null>(name);
    return useMemo(() => {
        const dialog = {
            opened: opened,
            open: setOpened,
            close: (e: any, _reason?: string) => {
                if (e && typeof e === "object") {
                    if ("preventDefault" in e) {
                        e.preventDefault();
                    }
                    if ("stopPropagation" in e) {
                        e.stopPropagation();
                    }
                }
                setOpened(() => null);
            },
            opener: (name: string) => () => setOpened(name),
        };
        return new Proxy(dialog as typeof dialog & { [key: string]: boolean }, {
            get: (_state, dname) => {
                if (dname in dialog)
                    return dialog[dname as keyof typeof dialog];
                return dname == opened;
            },
        });
    }, [opened]);
}
