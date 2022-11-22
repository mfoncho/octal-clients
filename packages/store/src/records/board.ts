import type { Channel } from "@colab/endpoint";
import { Unique, Id } from "@colab/client";
import { Record, List } from "immutable";
import { CardRecord } from "./card";

export class CardFieldTemplateRecord extends Record({
    name: "",
    type: "",
}) {
    static make(payload: any) {
        if (Record.isRecord(payload)) {
            return payload as any as CardFieldTemplateRecord;
        }
        return new CardFieldTemplateRecord(payload);
    }
}

export class CardTemplateRecord
    extends Record({
        id: "" as Id,
        name: "",
        description: "",
        fields: List<CardFieldTemplateRecord>(),
        board_id: "" as Id,
    })
    implements Unique
{
    constructor(data: any) {
        super(CardTemplateRecord.objectFromJS(data));
    }
    static make(payload: any) {
        if (Record.isRecord(payload)) {
            return payload as any as CardTemplateRecord;
        }
        return new CardTemplateRecord(payload);
    }
    static objectFromJS(data: any) {
        if (data.fields) {
            let fields = List(
                data.fields.map((field: any) =>
                    CardFieldTemplateRecord.make(field)
                )
            );
            data = { ...data, fields };
        }
        return data;
    }
}

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

export class BoardFilter extends Record({
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
        channel: null as null | Channel,
        loaded: List<string>([]),
        templates: List<CardTemplateRecord>(),
        labels: List<LabelRecord>(),
        filter: new BoardFilter(),
        is_archived: false,
        created_at: "",
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

    putTemplate(payload: any) {
        const index = this.templates.findIndex(
            (template) => payload.id === template.id
        );
        if (index === -1) {
            return this.update("templates", (templates) =>
                templates.push(CardTemplateRecord.make(payload))
            );
        }
        return this;
    }

    removeTemplate(payload: any) {
        const index = this.templates.findIndex(
            (template) => payload.id === template.id
        );
        if (index >= 0) {
            return this.deleteIn(["templates", index]);
        }
        return this;
    }

    putLabel(payload: any) {
        const index = this.labels.findIndex((label) => payload.id === label.id);
        if (index === -1) {
            return this.update("labels", (labels) =>
                labels.push(LabelRecord.make(payload))
            );
        }
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

    setChannel(channel: Channel) {
        return this.set("channel", channel);
    }

    static create(payload: any) {
        const data = BoardRecord.objectFromJS(payload);
        return new BoardRecord(data);
    }

    static objectFromJS(data: any) {
        if (Array.isArray(data.labels)) {
            let labels = List(
                data.labels.map((label: any) => new LabelRecord(label))
            );
            data = { ...data, labels };
        }
        if (Array.isArray(data.templates)) {
            let templates = List(
                data.templates.map((template: any) =>
                    CardTemplateRecord.make(template)
                )
            );
            data = { ...data, templates };
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
