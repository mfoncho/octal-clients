import { Record, Map } from "immutable";
import { Unique, Positioned, Id, BelongsToBoard } from "@octal/client";

export class ColumnRecord
    extends Record({
        id: "" as Id,
        type: "" as "stack" | "queue",
        name: "",
        origin: false,
        position: 0,
        capacity: 0,
        board_id: "" as Id,
        archived_at: null as string | null,
    })
    implements Unique, Positioned, BelongsToBoard
{
    patch(data: any) {
        return this.merge(ColumnRecord.objectFromJS(data));
    }

    getStorePath(): [Id, Id] {
        return [this.board_id, this.id];
    }

    static mapFromJS(data: any) {
        return Map(ColumnRecord.objectFromJS(data));
    }

    static objectFromJS(data: any) {
        if (!Boolean(data.archived_at)) {
            data.archived_at = null;
        }
        return { ...data };
    }

    static make(payload: any) {
        if (Record.isRecord(payload)) {
            return payload as any as ColumnRecord;
        }
        return new ColumnRecord(payload);
    }
}
