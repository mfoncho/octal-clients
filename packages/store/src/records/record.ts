import { Record, List, fromJS, Map } from "immutable";
import { Unique, Positioned, BelongsToCatalog } from "@colab/client";
import { sort, keyStingFromDate } from "@colab/common";
import calendar from "@colab/calendar";
import { FileRecord } from "./workspace";

const createAtAsc = sort("created_at", "asc");

const positionAsc = sort("index", "asc");

export class RecordFileValueRecord extends Record({
    id: "",
    file: new FileRecord(),
    record_id: "",
    field_id: "",
    created_at: "",
}) {
    constructor(params: any) {
        super(RecordFileValueRecord.objectFromJS(params));
    }

    static objectFromJS(data: any) {
        if (data.file) {
            let file = new FileRecord(data.file);
            data = { ...data, file };
        }

        return data;
    }
}

export class RecordTaskValueRecord extends Record({
    id: "",
    name: "",
    done: false,
    record_id: "",
    field_id: "",
    created_at: "",
}) { }

export class RecordTextValueRecord extends Record({
    id: "",
    value: "",
    field_id: "",
    created_at: "",
}) { }

export class RecordNumberValueRecord extends Record({
    id: "",
    value: 0,
    record_id: "",
    field_id: "",
    created_at: "",
}) { }

export class RecordLabelValueRecord extends Record({
    id: "",
    record_id: "",
    label_id: "",
    field_id: "",
    created_at: "",
}) { }

export class RecordUserValueRecord extends Record({
    id: "",
    user_id: "",
    record_id: "",
    field_id: "",
    created_at: "",
}) { }

export class RecordDatetimeValueRecord extends Record({
    id: "",
    value: "",
    record_id: "",
    field_id: "",
    created_at: "",
}) { }

export interface IRecordField<
    T =
    | RecordTextValueRecord
    | RecordFileValueRecord
    | RecordLabelValueRecord
    | RecordDatetimeValueRecord
    | RecordUserValueRecord
> {
    id: string;
    type: string;
    name: string;
    record_id: string;
    index: number;
    values: List<T>;
    metadata: Map<string, string | number>;
    users: List<string>;
    created_at: string;
}

export class RecordFieldRecord extends Record<IRecordField>({
    id: "",
    type: "",
    name: "",
    record_id: "",
    users: List(),
    index: 0,
    metadata: Map(),
    values: List(),
    created_at: "",
}) {
    constructor(data: any) {
        super(RecordFieldRecord.objectFromJS(data) as any);
    }

    with(data: { [key: string]: any }) {
        return this.merge(RecordFieldRecord.objectFromJS(data));
    }

    assign(user_id: string) {
        if (this.users.includes(user_id)) return this;
        return this.update("users", (users) => users.push(user_id));
    }

    unassign(user_id: string) {
        if (this.users.includes(user_id)) {
            return this.update("users", (users) =>
                users.filter((id) => id !== user_id)
            );
        }
        return this;
    }

    addValue(vdata: any) {
        if (this.values.find((value) => value.id == vdata.id)) {
            return this;
        }
        return this.update("values", (values: any) => {
            if (Record.isRecord(vdata)) {
                return values.concat([vdata]).sort(createAtAsc);
            } else {
                return values
                    .concat([
                        RecordFieldRecord.createFieldValue(vdata, this.type),
                    ])
                    .sort(createAtAsc);
            }
        });
    }

    updateValue(vdata: any) {
        const found = this.values.findIndex((value) => value.id == vdata.id);
        if (found > -1) {
            return this.updateIn(["values", found], (value: any) => {
                return value.merge(vdata);
            });
        }
        return this;
    }

    removeValue(id: string) {
        const found = this.values.findIndex((value) => value.id == id);
        if (found > -1) {
            return this.update("values", (values) => {
                return values.delete(found);
            });
        }
        return this;
    }

    static make(param: any) {
        return new RecordFieldRecord(param);
    }

    static createFieldValue(value: any, type: string) {
        switch (type) {
            case "user":
                return new RecordUserValueRecord(value);

            case "datetime":
                return new RecordDatetimeValueRecord(value);

            case "label":
                return new RecordLabelValueRecord(value);

            case "text":
                return new RecordTextValueRecord(value);

            case "file":
                return new RecordFileValueRecord(value);

            case "checklist":
                return new RecordTaskValueRecord(value);

            case "number":
                return new RecordNumberValueRecord(value);

            default:
                let anon = Record(value);
                return new anon();
        }
    }

    static objectFromJS(data: any) {
        if (Array.isArray(data.values)) {
            let values = List(
                data.values.map((value: any) =>
                    RecordFieldRecord.createFieldValue(value, data.type)
                )
            ).sort(createAtAsc);
            data = { ...data, values };
        }
        if (Array.isArray(data.users)) {
            let users = List(data.users);
            data = { ...data, users };
        }
        return data;
    }
}

export class RecordRecord
    extends Record({
        id: "",
        name: "",
        checked: false,
        fields: List<RecordFieldRecord>(),
        user_id: "",
        index: 0,
        archived: false,
        thread_id: "",
        collection_id: "",
        created_at: "",
        catalog_id: "",
        dates: List<string>(),
        users: List<string>(),
        labels: List<string>(),
        assigned: List<string>(),
        archived_at: null as string | null,
    })
    implements Unique, Positioned, BelongsToCatalog {
    constructor(data: any) {
        super(RecordRecord.objectFromJS(data));
    }

    patch(data: any) {
        return this.merge(RecordRecord.objectFromJS(data));
    }

    withIndices() {
        return this.indexDates().indexLabels().indexUsers();
    }

    indexDates() {
        const ftypes = ["date", "datetime"];
        const dates = this.fields
            .filter((field) => ftypes.includes(field.type))
            .map((field) =>
                field.values.map((val) => {
                    const date = calendar.fromISOString(val.get("value", ""));
                    return keyStingFromDate(date);
                })
            )
            .reduce((acc, labids) => {
                return acc.concat(labids);
            }, List<string>())
            .toMap()
            .mapKeys((_index, val) => val)
            .toList()
            .filter(Boolean);
        return this.set("dates", dates);
    }

    indexLabels() {
        const labels = this.fields
            .filter((field) => field.type == "label")
            .map((field) => field.values.map((val) => val.get("label_id", "")))
            .reduce((acc, labids) => {
                return acc.concat(labids);
            }, List<string>())
            .toMap()
            .mapKeys((_index, val) => val)
            .toList()
            .filter(Boolean);
        return this.set("labels", labels);
    }

    indexUsers() {
        const users = this.fields
            .filter((field) => field.type == "user")
            .map((field) => field.values.map((val) => val.get("user_id", "")))
            .reduce((acc, uids) => acc.concat(uids), List<string>());

        const assinged = this.fields
            .filter((field) => field.type == "checklist")
            .map((field) => field.users)
            .reduce((acc, uids) => acc.concat(uids), List<string>())
            .toMap()
            .mapKeys((_index, val) => val)
            .toList()
            .filter(Boolean);

        const indexed = users
            .concat(assinged)
            .toMap()
            .mapKeys((_index, val) => val)
            .toList()
            .filter(Boolean);

        return this.set("users", indexed).set("assigned", assinged);
    }

    getField(id: string) {
        return this.fields.find((field) => field.id == id);
    }

    locateField(id: string): [RecordFieldRecord | undefined, number] {
        let index = this.fields.findIndex((field) => field.id == id);
        if (index < 0) {
            return [undefined, index];
        } else {
            let field = this.fields.get(index);
            return [field, index];
        }
    }

    addField(params: any) {
        let [field] = this.locateField(params.id);
        if (field) return this;
        const fields = this.fields
            .push(RecordFieldRecord.make(params))
            .sort(sort("index", "desc"));
        return this.setIn(["fields"], fields);
    }

    removeField(id: string) {
        let [field, index] = this.locateField(id);
        if (field) {
            return this.deleteIn(["fields", index]);
        }
        return this;
    }

    updateField(value: any) {
        let [field, index] = this.locateField(value.id);
        if (field) {
            const updated = field.with(value);
            if (field.index !== updated.index) {
                return this.update("fields", (fields) => {
                    return fields
                        .delete(index)
                        .insert(updated.index, updated)
                        .map((field, index) => {
                            return field.merge({ index: index });
                        });
                });
            } else {
                return this.setIn(["fields", index], updated);
            }
        }
        return this;
    }

    addFieldValue(value: any) {
        let [field, index] = this.locateField(value.field_id);
        if (field) {
            return this.setIn(["fields", index], field.addValue(value));
        }
        return this;
    }
    updateFieldValue(value: any) {
        let [field, index] = this.locateField(value.field_id);
        if (field) {
            return this.setIn(["fields", index], field.updateValue(value));
        }
        return this;
    }

    removeFieldValue(field_id: string, value_id: string) {
        let [field, index] = this.locateField(field_id);
        if (field) {
            return this.setIn(["fields", index], field.removeValue(value_id));
        }
        return this;
    }

    assignField(id: string, user_id: string) {
        let [field, index] = this.locateField(id);
        if (field) {
            return this.setIn(["fields", index], field.assign(user_id));
        }
        return this;
    }

    unassingField(id: string, user_id: string) {
        let [field, index] = this.locateField(id);
        if (field) {
            return this.setIn(["fields", index], field.unassign(user_id));
        }
        return this;
    }

    get is_archived() {
        return Boolean(this.archived_at);
    }

    static objectFromJS(data: any) {
        if (data.fields) {
            let fields = List(
                data.fields
                    .sort(positionAsc)
                    .map((field: any) => new RecordFieldRecord(field))
            );
            data = { ...data, fields };
        }

        if (data.archived || Boolean(data.archived_at)) {
            data.collection_id = data.catalog_id;
        } else if (data.archived === false || data.archived_at == null) {
            data.archived_at = null;
        }
        return data;
    }

    static mapFromJS(data: any) {
        return fromJS(RecordRecord.objectFromJS(data));
    }

    static make(param: any) {
        return new RecordRecord(param);
    }
}
