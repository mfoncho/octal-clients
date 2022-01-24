import { createBrowserHistory } from "history";
import store from "@octal/store";

const history = createBrowserHistory();

history.listen((location: any, action: string) => {
    store.dispatch({ type: `NAVIGATION_${action}`, payload: location });
});

export default history;
