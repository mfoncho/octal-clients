import { applyMiddleware, compose, createStore } from "redux";
import createSagaMiddleware from "redux-saga";
import sagas from "./sagas";
import reducers, { RootState } from "./reducers";
export type State = typeof RootState;
export * from "./actions/types";
export * from "./hooks";
export * from "./records";
export { default as Actions } from "./actions";
export type { Store } from "./reducers";

const sagaMiddleware = createSagaMiddleware();

const devTools = (window as any).__REDUX_DEVTOOLS_EXTENSION__
    ? (window as any).__REDUX_DEVTOOLS_EXTENSION__({ trace: true })
    : (c: any) => c;

const middlewares = applyMiddleware(sagaMiddleware);

const enhancers = compose(middlewares, devTools);

const store = createStore(reducers, RootState, enhancers);

sagaMiddleware.run(sagas);

export type RootStore = typeof store;

export const dispatch = store.dispatch;

export default store;
