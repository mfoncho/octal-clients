import type { Channel } from "@colab/endpoint";
import { Unique, Id } from "@colab/client";
import { Record, List } from "immutable";
import { RecordRecord } from "./record";

export class RecordFieldTemplateRecord extends Record({
    name: "",
    type: "",
}) {
    static make(payload: any) {
        if (Record.isRecord(payload)) {
            return payload as any as RecordFieldTemplateRecord;
        }
        return new RecordFieldTemplateRecord(payload);
    }
}

export class RecordTemplateRecord
    extends Record({
        id: "" as Id,
        name: "",
        description: "",
        fields: List<RecordFieldTemplateRecord>(),
        catalog_id: "" as Id,
    })
    implements Unique {
    constructor(data: any) {
        super(RecordTemplateRecord.objectFromJS(data));
    }
    static make(payload: any) {
        if (Record.isRecord(payload)) {
            return payload as any as RecordTemplateRecord;
        }
        return new RecordTemplateRecord(payload);
    }
    static objectFromJS(data: any) {
        if (data.fields) {
            let fields = List(
                data.fields.map((field: any) =>
                    RecordFieldTemplateRecord.make(field)
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
        catalog_id: "" as Id,
    })
    implements Unique {
    static make(payload: any) {
        if (Record.isRecord(payload)) {
            return payload as any as LabelRecord;
        }
        return new LabelRecord(payload);
    }
}

export class CatalogFilter extends Record({
    term: "",
    labels: List<string>(),
    users: List<string>(),
}) {
    get valid() {
        return (
            this.term.length > 0 || this.labels.size > 0 || this.users.size > 0
        );
    }
    test(record: RecordRecord) {
        if (this.term.length > 0 && record.name.includes(this.term)) return true;
        if (this.users.find((user) => record.users.includes(user))) return true;

        if (this.labels.find((label) => record.labels.includes(label)))
            return true;

        return false;
    }
}

export class CatalogRecord
    extends Record({
        id: "" as Id,
        icon: "",
        name: "",
        space_id: "",
        channel: null as null | Channel,
        loaded: List<string>([]),
        templates: List<RecordTemplateRecord>(),
        labels: List<LabelRecord>(),
        filter: new CatalogFilter(),
        is_archived: false,
        created_at: "",
        archived_at: null as string | null,
    })
    implements Unique {
    constructor(data: any) {
        super(CatalogRecord.objectFromJS(data));
    }

    patch(data: any) {
        return this.merge(CatalogRecord.objectFromJS(data));
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
                templates.push(RecordTemplateRecord.make(payload))
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
        const data = CatalogRecord.objectFromJS(payload);
        return new CatalogRecord(data);
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
                    RecordTemplateRecord.make(template)
                )
            );
            data = { ...data, templates };
        }
        return data;
    }

    static make(payload: any) {
        if (Record.isRecord(payload)) {
            return payload as any as CatalogRecord;
        }
        return new CatalogRecord(payload);
    }
}
