import React from "react";
import { Link } from "react-router-dom";
import { BiArrowBack as BackArrowIcon } from "react-icons/bi";
import { Input, Button } from "@octal/ui";
import { useInput } from "src/utils";
import * as patterns from "@octal/patterns";
import path from "../paths";

function validateEmail(email: string) {
    return new RegExp(patterns.email).test(email);
}

export default React.memo(() => {
    const email = useInput("", validateEmail);
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
                <div className="flex flex-col pb-4 pt-1">
                    <span className="text-xl font-black pb-4">
                        Forgot your password?
                    </span>
                    <span className="text-base font-medium">
                        Please enter the email address associated with your
                        account and an email with a reset link will be sent to
                        you
                    </span>
                </div>
                <div className="py-4">
                    <Input.Labeled
                        {...email.props}
                        type="email"
                        label="E-mail"
                        description="Enter e-mail associated with your account"
                        placeholder="@mail.com"
                    />
                </div>
                <Button color="primary" disabled={!email.valid}>
                    Reset
                </Button>
            </div>
        </div>
    );
});
