import React from "react";
import { Link } from "react-router-dom";
import { BiArrowBack as BackArrowIcon } from "react-icons/bi";
import Client from "@octal/client";
import { Input, Button, Flow, Text } from "@octal/ui";
import { useInput } from "src/utils";
import * as patterns from "@octal/patterns";
import path from "../paths";

function validateEmail(email: string) {
    return new RegExp(patterns.email).test(email);
}

function validateCode(code: string) {
    const length = code.trim().length;
    return length > 4 && length < 10;
}

function validatePassword(code: string) {
    const length = code.trim().length;
    return length >= 6 && length <= 128;
}

export default React.memo(() => {
    const token = useInput("");
    const request = useInput("");
    const email = useInput("", validateEmail);
    const code = useInput("", validateCode);
    const password = useInput("", validatePassword);
    const [state, setState] = React.useState<string>("reset");
    const [loading, setLoading] = React.useState<boolean>(false);
    function handleRequestCode() {
        if (email.valid && !loading) {
            Client.requestPasswordReset({ email: email.value })
                .then(({ id }) => {
                    request.setValue(id);
                    setState("code");
                })
                .catch(() => setState("reset"))
                .finally(() => setLoading(false));
            setLoading(true);
        }
    }

    function handleSubmitCode() {
        if (code.valid && !loading) {
            const params = { code: code.value };
            Client.confirmResetCode({ request_id: request.value, params })
                .then((data) => {
                    token.setValue(data.token);
                    setState("password");
                })
                .catch(() => setState("code"))
                .finally(() => setLoading(false));
            setLoading(true);
        }
    }

    function handleResetPassword() {
        if (request.valid && password.valid && !loading) {
            Client.resetPassword({
                token: token.value,
                password: password.value,
            })
                .then(() => {
                    setState("done");
                    token.setValue("");
                    request.setValue("");
                })
                .catch(() => setState("password"))
                .finally(() => setLoading(false));
            setLoading(true);
        }
    }
    return (
        <div className="flex flex-col sm:w-[500px] space-y-8">
            <div className="flex flex-row">
                <Link
                    className="flex flex-row items-center text-sm font-semibold text-primary-700"
                    to={path.login}>
                    <BackArrowIcon className="h-5 w-5" />
                    <span className="px-4">Login</span>
                </Link>
            </div>
            <div className="sm:py-8 sm:px-8 rounded-lg flex flex-col sm:shadow-lg sm:border border-gray-200">
                <Flow.Switch value={state}>
                    <Flow.Case value="reset">
                        <div className="flex flex-col pb-4 pt-1">
                            <span className="text-xl font-black pb-4">
                                Forgot your password?
                            </span>
                            <span className="text-base font-medium">
                                Please enter the email address associated with
                                your account and a reset code will be sent to
                                you
                            </span>
                        </div>
                        <div className="py-4">
                            <Input.Labeled
                                {...email.props}
                                type="email"
                                disabled={loading}
                                label="E-mail"
                                description="Enter e-mail associated with your account"
                                placeholder="@mail.com"
                            />
                        </div>
                        <Button
                            color="primary"
                            disabled={!email.valid || loading}
                            onClick={handleRequestCode}>
                            Send
                        </Button>
                    </Flow.Case>
                    <Flow.Case value="code">
                        <div className="flex flex-col pb-4 pt-1">
                            <div>
                                <span className="text-xl font-black pb-4">
                                    Reset Code
                                </span>
                            </div>
                            <div className="py-4">
                                <Input.Labeled
                                    {...code.props}
                                    disabled={loading}
                                    label=""
                                    placeholder="00000"
                                />
                            </div>
                        </div>
                        <Button
                            color="primary"
                            disabled={!code.valid || loading}
                            onClick={handleSubmitCode}>
                            Confim
                        </Button>
                    </Flow.Case>
                    <Flow.Case value="password">
                        <div className="flex flex-col pb-4 pt-1">
                            <span className="text-xl font-black pb-4">
                                NEW PASSWORD
                            </span>
                            <span className="text-base font-medium">
                                Enter new password
                            </span>
                        </div>
                        <div className="py-4">
                            <Input.Labeled
                                {...password.props}
                                type="password"
                                disabled={loading}
                                label="New Password"
                                description="Enter new password"
                                placeholder="●●●●●●"
                            />
                        </div>
                        <Button
                            color="primary"
                            disabled={!password.valid || loading}
                            onClick={handleResetPassword}>
                            Reset
                        </Button>
                    </Flow.Case>
                    <Flow.Case value="done">
                        <div className="flex flex-col pb-4 pt-1 items-center">
                            <span className="text-xl font-black pb-4">
                                <Text>🎊Password Updated 🎊</Text>
                            </span>
                        </div>
                        <Link to={path.login} className="flex flex-col">
                            <Button color="primary">login</Button>
                        </Link>
                    </Flow.Case>
                </Flow.Switch>
            </div>
        </div>
    );
});
