import React, { useState, useEffect } from "react";
import { Input } from "./Profile";
import { Dialog, Button } from "@colab/ui";
import { useInput } from "src/utils";
import { updatePassword } from "@colab/store/lib/actions/user";
import { useDispatch } from "react-redux";
import { UserRecord } from "@colab/store/lib/records";

interface IPassword {
    user: UserRecord;
    setView: (view: string) => void;
}

const validate = (pwd: string) => pwd.trim().length >= 6;

export default React.memo<IPassword>(({ setView }) => {
    const dispatch = useDispatch();

    const password = useInput("", validate);

    const newPassword = useInput("", validate);

    const [loading, setLoading] = useState(false);

    let valid =
        password.valid &&
        newPassword.valid &&
        password.value.trim() != newPassword.value.trim();

    function handleSave() {
        const payload: any = {
            password: password.value.trim(),
            new_password: newPassword.value.trim(),
        };
        const action = updatePassword(payload);
        dispatch(action)
            .then(() => setView("profile"))
            .catch(() => setLoading(false));
        setLoading(true);
    }

    return (
        <React.Fragment>
            <Dialog.Content>
                <div className="flex flex-col">
                    <Input
                        label="Current password"
                        type="password"
                        disabled={loading}
                        {...password.props}
                    />
                    <Input
                        label="New password"
                        type="password"
                        placeholder="************"
                        disabled={loading}
                        {...newPassword.props}
                    />
                </div>
            </Dialog.Content>
            <Dialog.Actions>
                <Button
                    className="mx-4"
                    disabled={loading}
                    onClick={() => setView("profile")}>
                    Back
                </Button>
                <Button
                    color="primary"
                    onClick={handleSave}
                    disabled={!valid || loading}>
                    Save
                </Button>
            </Dialog.Actions>
        </React.Fragment>
    );
});
