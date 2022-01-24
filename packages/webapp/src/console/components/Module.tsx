import React from "react";

export interface IModule {
    name: string;
    icon:
        | React.FC<React.HTMLAttributes<any>>
        | React.Component<React.HTMLAttributes<any>>
        | React.PureComponent<React.HTMLAttributes<any>>
        | any;
}

const Context = React.createContext<IModule>({
    icon: (props: React.HTMLAttributes<HTMLDivElement>) => {
        return <div {...props}></div>;
    },
    name: "",
});

export function useModule() {
    return React.useContext(Context);
}

export default Context;
