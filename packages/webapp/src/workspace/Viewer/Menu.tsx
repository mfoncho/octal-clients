import React from "react";
import { Popper } from "@octal/ui";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { logout } from "@octal/store/lib/actions/app";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";

interface IOption {
    name: string;
    secondary?: React.ReactNode;
}

interface IMenu {
    options: IOption[];
    onSelect: (cmp: string) => void;
}

export default Popper.create<HTMLDivElement, IMenu>((props) => {
    const dispatch = useDispatch();

    function handleLogout() {
        dispatch(logout());
    }

    function hanleSelect(dialog: string) {
        return (event: React.MouseEvent): void => {
            event.stopPropagation();
            event.preventDefault();
            props.onSelect(dialog);
        };
    }

    return (
        <Popper
            as="div"
            open={props.open}
            placement="right-end"
            skidding={-18}
            distance={5}
            className="flex z-10 flex-col min-w-[220px] shadow rounded-md border-2 border-gray-200 bg-white p-2"
            anchorEl={props.anchorEl}
            onHoverAway={props.onHoverAway}
            onClickAway={props.onClickAway}>
            {props.options.map((option) => (
                <div
                    className="rounded-md px-4 py-2 text-base text-gray-700 hover:bg-gray-100 flex flex-row items-center justify-between"
                    key={option.name}
                    onClick={hanleSelect(option.name)}>
                    <span className="font-semibold text-sm">{option.name}</span>
                    {option.secondary}
                </div>
            ))}

            <Link
                to="/console"
                className="rounded-md px-4 py-2 text-base text-gray-700 hover:bg-gray-100 flex flex-row items-center justify-between">
                <span className="font-semibold text-sm">Console</span>
            </Link>

            <div
                className="rounded-md px-4 py-2 mt-4 text-gray-800 bg-gray-100 flex flex-row items-center justify-between"
                onClick={handleLogout}>
                <span className="font-semibold text-sm">Logout</span>
                <FontAwesomeIcon icon="sign-out-alt" />
            </div>
        </Popper>
    );
});
