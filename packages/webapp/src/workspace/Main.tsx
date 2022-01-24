import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import Routes from "@workspace/Routes";
import { INIT } from "@octal/store";

export default React.memo(() => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch({ type: INIT });
    }, []);
    return <Routes />;
});
