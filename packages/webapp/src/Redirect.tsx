import React from "react";
import { useNavigate } from "react-router-dom";

export interface IRedirect {
    to: string;
}

export default function Redirect(props: IRedirect) {
    const navigate = useNavigate();
    React.useEffect(() => {
        navigate(props.to);
    }, []);

    return <React.Fragment />;
}
