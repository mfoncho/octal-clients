import { useState, useMemo, useEffect } from "react";
import breakpoints from "./breakpoints";

export function useMediaQuery(query: string) {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        const media = window.matchMedia(query.replace(/^@media( ?)/m, ""));
        if (media.matches !== matches) {
            setMatches(media.matches);
        }
        const listener = () => setMatches(media.matches);
        window.addEventListener("resize", listener);
        return () => window.removeEventListener("resize", listener);
    }, [matches, query]);

    return matches;
}

export function useScreen() {
    const desktop = useMediaQuery(breakpoints.up("lg"));
    const tablet = useMediaQuery(breakpoints.only("md"));
    const mobile = useMediaQuery(breakpoints.down("sm"));
    return useMemo(() => {
        return { mobile, tablet, desktop };
    }, [mobile, tablet, desktop]);
}
