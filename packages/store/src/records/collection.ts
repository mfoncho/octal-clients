import { Record, Map } from "immutable";
import { Unique, Positioned, Id, BelongsToSpace } from "@colab/client";

export class CollectionRecord
    extends Record({
        id: "" as Id,
        type: "" as "stack" | "queue",
        name: "",
        origin: false,
        index: 0,
        capacity: 0,
        space_id: "" as Id,
        archived_at: null as string | null,
    })
    implements Unique, Positioned, BelongsToSpace
{
    patch(data: any) {
        return this.merge(CollectionRecord.objectFromJS(data));
    }

    getStorePath(): [Id, Id] {
        return [this.space_id, this.id];
    }

    static mapFromJS(data: any) {
        return Map(CollectionRecord.objectFromJS(data));
    }

    static objectFromJS(data: any) {
        if (!Boolean(data.archived_at)) {
            data.archived_at = null;
        }
        return { ...data };
    }

    static make(payload: any) {
        if (Record.isRecord(payload)) {
            return payload as any as CollectionRecord;
        }
        return new CollectionRecord(payload);
    }
}
