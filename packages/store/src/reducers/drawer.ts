import { Record, Map } from "immutable";
import { DrawerRecord, Drawer } from "../records";
import * as Actions from "../actions/types";
import * as DrawerActions from "../actions/drawer";

export class DrawerStore extends Record({
    drawers: Map<string, DrawerRecord<any>>(),
}) {
    getDrawer<T>(id: string): Drawer<T> | undefined {
        return this.drawers.get(id) as any;
    }
    openDrawer<T = unknown>(id: string, props: T) {
        const drawer = this.drawers.get(id, new DrawerRecord(props));
        return this.setIn(
            ["drawers", id],
            drawer.merge({ open: true, props } as any)
        );
    }

    closeDrawer<T = unknown>(id: string, props: T) {
        const drawer = this.drawers.get(id, new DrawerRecord(props));
        return this.setIn(
            ["drawers", id],
            drawer.merge({ open: false, props } as any)
        );
    }

    toggleDrawer<T = unknown>(id: string, props: T) {
        const drawer = this.drawers.get(id, new DrawerRecord(props));
        return this.setIn(
            ["drawers", id],
            drawer.merge({ open: !drawer.open, props } as any)
        );
    }
}

export const state = new DrawerStore();

export const reducers = {
    [Actions.LOGOUT](_store: any, _action: any) {
        return state;
    },
    [Actions.DRAWER_OPENED](
        store: DrawerStore,
        { payload }: DrawerActions.DrawerOpenedAction<unknown>
    ) {
        return store.openDrawer(payload.id, payload.params);
    },

    [Actions.DRAWER_CLOSED](
        store: DrawerStore,
        { payload }: DrawerActions.DrawerClosedAction<unknown>
    ) {
        return store.closeDrawer(payload.id, payload.params);
    },

    [Actions.DRAWER_TOGGLED](
        store: DrawerStore,
        { payload }: DrawerActions.DrawerToggledAction<unknown>
    ) {
        return store.toggleDrawer(payload.id, payload.params);
    },
};

export default { state, reducers };
