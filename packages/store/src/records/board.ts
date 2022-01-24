import { Record, List } from "immutable";
import { Unique, Id } from "@octal/client";

export class LabelRecord
    extends Record({
        id: "0" as Id,
        name: "label",
        color: "blue",
        board_id: "" as Id,
    })
    implements Unique
{
    static make(payload: any) {
        if (Record.isRecord(payload)) {
            return payload as any as LabelRecord;
        }
        return new LabelRecord(payload);
    }
}

export class BoardRecord
    extends Record({
        id: "0" as Id,
        icon: "",
        name: "",
        space_id: "",
        labels: List<LabelRecord>(),
    })
    implements Unique
{
    constructor(data: any) {
        super(BoardRecord.objectFromJS(data));
    }

    patch(data: any) {
        return this.merge(BoardRecord.objectFromJS(data));
    }

    putLabel(payload: any) {
        const index = this.labels.findIndex((label) => payload.id === label.id);
        if (index === -1)
            return this.update("labels", (labels) =>
                labels.push(LabelRecord.make(payload))
            );
        return this.updateIn(["labels", index], (label: any) =>
            label.merge(payload)
        );
    }

    patchLabel(payload: any) {
        const index = this.labels.findIndex((label) => payload.id === label.id);
        if (index === -1) return this;

        return this.updateIn(["labels", index], (label: any) =>
            label.merge(payload)
        );
    }

    removeLabel(id: string) {
        const index = this.labels.findIndex((label) => id === label.id);
        if (index === -1) return this;
        return this.update("labels", (labels) =>
            labels.filter((label) => label.id !== id)
        );
    }

    static create(payload: any) {
        const data = BoardRecord.objectFromJS(payload);
        return new BoardRecord(data);
    }

    static objectFromJS(data: any) {
        if (data.labels) {
            let labels = List(
                data.labels.map((label: any) => new LabelRecord(label))
            );
            data = { ...data, labels };
        }
        return data;
    }

    static make(payload: any) {
        if (Record.isRecord(payload)) {
            return payload as any as BoardRecord;
        }
        return new BoardRecord(payload);
    }
}
