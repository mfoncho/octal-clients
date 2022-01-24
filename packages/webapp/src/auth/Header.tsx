import React from "react";
import Logo from "./components/Logo";

export default React.memo(function Header() {
    return (
        <div className="absolute flex flex-row justify-between w-full p-8">
            <Logo />
            <button className="font-bold font-lg text-primary-700 pr-8">
                Help
            </button>
        </div>
    );
});
