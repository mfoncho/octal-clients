import { Record, List, fromJS, Map } from "immutable";
import { Unique, Positioned, BelongsToBoard } from "@octal/client";
import { sort, keyStingFromDate } from "@octal/common";
import calendar from "@octal/calendar";

const createAtAsc = sort("created_at", "asc");

const positionAsc = sort("position", "asc");

export class CardTaskValueRecord extends Record({
    id: "",
    name: "",
    done: false,
    created_at: "",
}) {}

export class CardTextValueRecord extends Record({
    id: "",
    value: "",
    created_at: "",
}) {}

export class CardNumberValueRecord extends Record({
    id: "",
    value: 0,
    created_at: "",
}) {}

export class CardLabelValueRecord extends Record({
    id: "",
    label_id: "",
    created_at: "",
}) {}

export class CardUserValueRecord extends Record({
    id: "",
    user_id: "",
    created_at: "",
}) {}

export class CardDatetimeValueRecord extends Record({
    id: "",
    value: "",
    created_at: "",
}) {}

export interface ICardField<
    T =
        | CardTextValueRecord
        | CardLabelValueRecord
        | CardDatetimeValueRecord
        | CardUserValueRecord
> {
    id: string;
    type: string;
    name: string;
    card_id: string;
    position: number;
    values: List<T>;
    metadata: Map<string, string | number>;
    users: List<string>;
    created_at: string;
}

export class CardFieldRecord extends Record<ICardField>({
    id: "",
    type: "",
    name: "",
    card_id: "",
    users: List(),
    position: 0,
    metadata: Map(),
    values: List(),
    created_at: "",
}) {
    constructor(data: any) {
        super(CardFieldRecord.objectFromJS(data) as any);
    }

    with(data: { [key: string]: any }) {
        return this.merge(CardFieldRecord.objectFromJS(data));
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
                        CardFieldRecord.createFieldValue(vdata, this.type),
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
        return new CardFieldRecord(param);
    }

    static createFieldValue(value: any, type: string) {
        switch (type) {
            case "user":
                return new CardUserValueRecord(value);

            case "date":
            case "datetime":
                return new CardDatetimeValueRecord(value);

            case "label":
                return new CardLabelValueRecord(value);

            case "text":
                return new CardTextValueRecord(value);

            case "checklist":
                return new CardTaskValueRecord(value);

            case "number":
                return new CardNumberValueRecord(value);

            default:
                let anon = Record(value);
                return new anon();
        }
    }

    static objectFromJS(data: any) {
        if (Array.isArray(data.values)) {
            let values = List(
                data.values.map((value: any) =>
                    CardFieldRecord.createFieldValue(value, data.type)
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

export class CardRecord
    extends Record({
        id: "",
        name: "",
        icon: null as string | null,
        complete: false,
        fields: List<CardFieldRecord>(),
        user_id: "",
        position: 0,
        archived: false,
        thread_id: "",
        column_id: "",
        created_at: "",
        board_id: "",
        dates: List<string>(),
        users: List<string>(),
        labels: List<string>(),
        assigned: List<string>(),
        archived_at: null as string | null,
    })
    implements Unique, Positioned, BelongsToBoard
{
    constructor(data: any) {
        super(CardRecord.objectFromJS(data));
    }

    patch(data: any) {
        return this.merge(CardRecord.objectFromJS(data));
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

    locateField(id: string): [CardFieldRecord | undefined, number] {
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
            .push(CardFieldRecord.make(params))
            .sort(sort("position", "desc"));
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
            if (field.position !== updated.position) {
                return this.update("fields", (fields) => {
                    return fields
                        .delete(index)
                        .insert(updated.position, updated)
                        .map((field, index) => {
                            return field.merge({ position: index });
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
                    .map((field: any) => new CardFieldRecord(field))
            );
            data = { ...data, fields };
        }

        if (data.archived) {
            data.column_id = data.board_id;
        } else if (data.archived === false) {
            data.archived_at = null;
        }
        return data;
    }

    static mapFromJS(data: any) {
        return fromJS(CardRecord.objectFromJS(data));
    }

    static make(param: any) {
        return new CardRecord(param);
    }
}
