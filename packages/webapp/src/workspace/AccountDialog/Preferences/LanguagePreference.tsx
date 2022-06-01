import React from "react";
import { IPreference } from "./hooks";

export default React.memo<IPreference>((props) => {
    function handleSetLocale(event: React.ChangeEvent<{ value: unknown }>) {
        event.stopPropagation();
        event.preventDefault();
        props.setPreference("locale", event.target.value as string);
    }
    return (
        <div className="flex flex-col py-6">
            <div className="mt-1 relative flex flex-col">
                <select
                    onChange={handleSetLocale}
                    className="block appearance-none border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                    <option value="en">English</option>
                    <option value="fr">French</option>
                </select>
                <div className="absolute h-full flex inset-y-0 items-center px-3 right-0 text-gray-700 bg-primary-300 rounded-r pointer-events-none">
                    <svg
                        className="fill-current h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"></path>
                    </svg>
                </div>
            </div>
        </div>
    );
});
