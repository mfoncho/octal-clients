import React from "react";
import Menu from "./Menu";
import { Colab } from "@colab/icons";
import Viewer from "@workspace/Viewer";
import { Link } from "react-router-dom";
import { useWorkspace } from "@colab/store";

interface ILogo {
    alt: string;
    src: string;
}

const Logo = React.memo<ILogo>((props) => {
    return (
        <Link to="/spaces">
            <img
                src={props.src}
                alt={props.alt}
                className="w-10 h-10 rounded-lg"
            />
        </Link>
    );
});
export default React.memo(function Header() {
    const workspace = useWorkspace();
    const logo = workspace.get("logo");
    const name = workspace.get("name", "")!;
    return (
        <div className="flex flex-row items-center overflow-hidden p-4">
            {logo ? (
                <Logo src={logo} alt={name} />
            ) : (
                <Colab className="w-10 h-10 text-white" />
            )}
            <div className="flex-1 flex flex-col px-2">
                <Link
                    to="/spaces"
                    className="text-lg font-bold text-primary-200">
                    {name}
                </Link>
                <Viewer />
            </div>
            <Menu />
        </div>
    );
});
