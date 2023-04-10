import { all, fork } from "redux-saga/effects";

const watch = ({ effect, type, handler }: any) =>
    function* watcher() {
        yield effect(type, handler);
    };

const watchers = [
    ...require("./auth").tasks,
    ...require("./init").tasks,
    ...require("./app").tasks,
    ...require("./label").tasks,
    ...require("./role").tasks,
    ...require("./ping").tasks,
    ...require("./tool").tasks,
    ...require("./user").tasks,
    ...require("./record").tasks,
    ...require("./catalog").tasks,
    ...require("./topic").tasks,
    ...require("./thread").tasks,
    ...require("./tracker").tasks,
    ...require("./calendar").tasks,
    ...require("./status").tasks,
    ...require("./dialog").tasks,
    ...require("./router").tasks,
    ...require("./collection").tasks,
    ...require("./space").tasks,
    ...require("./member").tasks,
    ...require("./message").tasks,
    ...require("./bookmark").tasks,
    ...require("./recordfield").tasks,
    ...require("./workspace").tasks,
    ...require("./notification").tasks,
    ...require("./subscription").tasks,
    ...require("./conversation").tasks,
].map(watch);

const sagas = [...watchers].map(fork);

function* main() {
    yield all(sagas);
}

export default main;
