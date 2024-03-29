import React from "react";
import Login from "./Login";
import path from "./paths";
import ResetPassword from "./ResetPassowrd";
import { Route, Routes, Navigate } from "react-router-dom";

export default React.memo(() => {
    return (
        <Routes>
            <Route path={path.login} element={<Login />} />
            <Route path={path.reset} element={<ResetPassword />} />
            <Route path="*" element={<Navigate replace={true} to={path.login} />} />
        </Routes>
    );
});
