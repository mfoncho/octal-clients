import React from "react";
import { useDispatch } from "react-redux";
import { logout } from "@octal/store/lib/actions/app";
import { Dialog, Button } from "@octal/ui";

export default React.memo(() => {
    const dispatch = useDispatch();

    function handleLogout() {
        dispatch(logout());
    }

    return (
        <React.Fragment>
            <Dialog.Content className="overflow-y-auto"></Dialog.Content>
            <Dialog.Actions>
                <Button className="flex-1" onClick={handleLogout}>
                    Logout
                </Button>
            </Dialog.Actions>
        </React.Fragment>
    );
});
