import breakpoints from "./breakpoints";
import useMediaQuery from "@material-ui/core/useMediaQuery";

export function useScreen() {
    const desktop = useMediaQuery(breakpoints.up("lg"));
    const mobile = useMediaQuery(breakpoints.down("sm"));
    const tablet = useMediaQuery(breakpoints.only("md"));
    return { mobile, tablet, desktop };
}
