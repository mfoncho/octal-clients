import React from "react";
import { Link } from "react-router-dom";
import { BiArrowBack as BackArrowIcon } from "react-icons/bi";
import Client from "@octal/client";
import { Input, Button } from "@octal/ui";
import { useInput } from "src/utils";
import * as patterns from "@octal/patterns";
import path from "../paths";

function validateEmail(email: string) {
    return new RegExp(patterns.email).test(email);
}

export default React.memo(() => {
    const email = useInput("", validateEmail);
    const [sent, setSent] = React.useState<boolean>(false);
    const [reseting, setResting] = React.useState<boolean>(false);
    function handleResetPassword() {
        if (email.valid && !sent && !reseting) {
            Client.resetPassword({ email: email.value })
                .then(() => setSent(true))
                .catch(() => setSent(false))
                .finally(() => setResting(false));
            setResting(true);
        }
    }

    return (
        <div className="flex flex-col sm:max-w-[500px] space-y-8">
            <div className="flex flex-row">
                <Link
                    className="flex flex-row items-center text-sm font-semibold text-primary-700"
                    to={path.login}>
                    <BackArrowIcon className="h-5 w-5" />
                    <span className="px-4">Back</span>
                </Link>
            </div>
            <div className="sm:py-8 sm:px-8 rounded-lg flex flex-col sm:shadow-lg sm:border border-gray-200">
                {sent ? (
                    <div className="flex flex-col pb-4 pt-1">
                        <div>
                            <span className="text-xl font-black pb-4">
                                Password Reset
                            </span>
                        </div>
                        <div className="inline-flex text-base font-medium">
                            <span>Reset link sent to </span>
                            <span className="text-primary-700 font-semibold px-1">
                                {email.value}
                            </span>
                            <span> Please check your</span>
                        </div>
                    </div>
                ) : (
                    <React.Fragment>
                        <div className="flex flex-col pb-4 pt-1">
                            <span className="text-xl font-black pb-4">
                                Forgot your password?
                            </span>
                            <span className="text-base font-medium">
                                Please enter the email address associated with
                                your account and an email with a reset link will
                                be sent to you
                            </span>
                        </div>
                        <div className="py-4">
                            <Input.Labeled
                                {...email.props}
                                type="email"
                                disabled={reseting}
                                label="E-mail"
                                description="Enter e-mail associated with your account"
                                placeholder="@mail.com"
                            />
                        </div>
                        <Button
                            color="primary"
                            disabled={!email.valid || reseting}
                            onClick={handleResetPassword}>
                            Reset
                        </Button>
                    </React.Fragment>
                )}
            </div>
        </div>
    );
});
