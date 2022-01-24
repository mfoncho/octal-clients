import { Record } from "immutable";

interface IDrawer<T> {
    open: boolean;
    props: T;
}

export type Drawer<T> = IDrawer<T> & Record<IDrawer<T>>;

export class DrawerRecord<T>
    extends Record({
        open: false,
        props: null as any,
    })
    implements IDrawer<T> {
    static make<T>(props: T) {
        return new DrawerRecord<T>({ open: false, props }) as Drawer<T>;
    }
}
