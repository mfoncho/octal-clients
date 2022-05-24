import { Record, List } from "immutable";
import { Unique, Id } from "@octal/client";
import { CardRecord } from "./card";

export class LabelRecord
    extends Record({
        id: "" as Id,
        icon: "",
        name: "",
        color: "",
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

export class Filter extends Record({
    term: "",
    labels: List<string>(),
    users: List<string>(),
}) {
    get valid() {
        return (
            this.term.length > 0 || this.labels.size > 0 || this.users.size > 0
        );
    }
    test(card: CardRecord) {
        if (this.term.length > 0 && card.name.includes(this.term)) return true;
        if (this.users.find((user) => card.users.includes(user))) return true;

        if (this.labels.find((label) => card.labels.includes(label)))
            return true;

        return false;
    }
}

export class BoardRecord
    extends Record({
        id: "" as Id,
        icon: "",
        name: "",
        space_id: "",
        loaded: List<string>([]),
        labels: List<LabelRecord>(),
        filter: new Filter(),
        is_archived: false,
        archived_at: null as string | null,
    })
    implements Unique
{
    constructor(data: any) {
        super(BoardRecord.objectFromJS(data));
    }

    patch(data: any) {
        return this.merge(BoardRecord.objectFromJS(data));
    }

    addLoaded(collection: string) {
        return this.loaded.includes(collection)
            ? this
            : this.update("loaded", (loaded) => loaded.push(collection));
    }

    updateFilter(filter: string, value: string | string[] | List<string>) {
        if ((filter == "users" || filter == "labels") && Array.isArray(value)) {
            value = List(value);
        }
        return this.updateIn(["filter", filter], (_old) => value);
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
