import React from "react";
import { Route, Routes } from "react-router-dom";
import paths from "src/paths";
import Layout from "@workspace/Layout";

function Lost() {
    return <div>Wait where am i?</div>;
}

const constilation: string[] = Object.values(paths)
    .map((sector) => Object.values(sector))
    .reduce((acc, paths) => {
        return acc.concat(paths);
    }, [])
    .sort((a, b) => {
        const la = a.split("/").length;
        const lb = b.split("/").length;
        if (la > lb) return 1;
        if (la < lb) return -1;
        return 0;
    });

export default function Main() {
    return <Layout />;
}
