import React, { useState } from "react";
import { Button, Input } from "@octal/ui";
import { useInput } from "src/utils";
import path from "../paths";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "@octal/store/lib/actions/app";

export default React.memo(() => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [remember, setRemember] = useState(true);

    const email = useInput("");
    const password = useInput("");

    function handleLogin() {
        let remember_me = remember ? remember : undefined;
        dispatch(
            login({
                email: email.value,
                password: password.value,
                remember_me,
            })
        ).catch(() => setLoading(false));
        setLoading(true);
    }

    function handleRememberInput(event: React.ChangeEvent<HTMLInputElement>) {
        setRemember(event.target.checked);
    }

    return (
        <div className="flex flex-col">
            <div className="pb-3">
                <Input.Labeled
                    {...email.props}
                    type="email"
                    label="E-mail"
                    disabled={loading}
                    placeholder="@mail.com"
                />
            </div>
            <div className="py-3">
                <Input.Labeled
                    {...password.props}
                    type="password"
                    label="Password"
                    disabled={loading}
                    description="Must be atlease 8 characters"
                    placeholder="●●●●●●"
                />
            </div>
            <div className="flex flex-row justify-between items-center py-3">
                <div className="flex flex-row relative items-center">
                    <input
                        type="checkbox"
                        onChange={handleRememberInput}
                        className="focus:ring-transparent focus:outline-none form-checkbox h-4 w-4 text-primary-500 rounded"
                    />
                    <span className="px-4 text-sm font-semibold text-gray-800">
                        Remember me
                    </span>
                </div>
                <Link
                    to={path.reset}
                    className="text-sm font-semibold text-primary-700">
                    Forgot password?
                </Link>
            </div>
            <div className="flex flex-col py-4">
                <Button
                    color="primary"
                    disabled={loading}
                    onClick={handleLogin}>
                    login
                </Button>
            </div>
        </div>
    );
});
