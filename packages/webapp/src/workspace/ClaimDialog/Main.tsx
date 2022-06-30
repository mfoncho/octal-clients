import React from "react";
import clx from "classnames";
import { useDispatch } from "react-redux";
import * as patterns from "@octal/patterns";
import { Dialog, Button } from "@octal/ui";
import { useInput } from "src/utils";
import { useAuth } from "@octal/store";
import { Actions } from "@octal/store";

interface IDialog {}

function validateEmail(email: string) {
    return new RegExp(patterns.email).test(email);
}

function validatePassword(password: string) {
    let pwdl = password.trim().length;
    return pwdl >= 6 && pwdl <= 128;
}

export default Dialog.create<IDialog>((props) => {
    const auth = useAuth();
    const dispatch = useDispatch();
    const email = useInput("", validateEmail);

    const loading = useInput(false);

    const password = useInput("", validatePassword);

    const emailCliamed = (auth.email ?? "").trim().length > 0;

    React.useEffect(() => {
        if (auth.claimed) {
            props.onClose({});
        }
    }, [auth.claimed]);

    React.useEffect(() => {
        if (emailCliamed) {
            email.setValue(auth.email as any);
        }
    }, [email.value]);

    let formVaid = email.valid && password.valid;

    function claimAccount() {
        if (formVaid) {
            const action = Actions.User.claimAccount({
                email: email.value,
                password: password.value,
            });
            loading.setValue(true);
            dispatch(action).catch(() => loading.setValue(false));
        }
    }

    return (
        <Dialog open={props.open} title="Claim Account" maxWidth="xs">
            <Dialog.Content className="flex flex-col overflow-hidden space-y-5 pb-10">
                <label className="flex flex-col">
                    <span className="text-gray-600 font-black text-xs uppercase">
                        email
                    </span>
                    <input
                        type="email"
                        name="email"
                        required={true}
                        disabled={emailCliamed}
                        className={clx(
                            "form-input rounded px-3 py-2 focus:border-primary-300 focus:ring focus:ring-pimary-300 font-semibold text-gray-600",
                            emailCliamed && "bg-slate-200"
                        )}
                        {...email.props}
                    />
                </label>
                <label className="flex flex-col">
                    <span className="text-gray-600 font-black text-xs uppercase">
                        password
                    </span>
                    <input
                        required={true}
                        type="password"
                        name="password"
                        className="form-input rounded px-3 py-2 focus:border-primary-300 focus:ring focus:ring-pimary-300"
                        {...password.props}
                    />
                </label>
            </Dialog.Content>
            <Dialog.Actions className="rounded-b-lg">
                <Button
                    onClick={claimAccount}
                    disabled={!formVaid || loading.value}
                    color="primary">
                    Claim
                </Button>
            </Dialog.Actions>
        </Dialog>
    );
});
