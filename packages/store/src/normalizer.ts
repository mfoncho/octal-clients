import merge from "lodash/merge";
import { Unique } from "@colab/client";
import { NormalizedRelated } from "./schemas";

interface Data {
    [key: string]: Data | Data[] | string | number | null;
}

class Schemas {
    readonly cache: { [key: string]: Schema<any, any, string> };

    constructor() {
        this.cache = {};
    }

    public define<T extends string = never>(
        name: T,
        schema: Schema<any, any, string>
    ) {
        this.cache[name] = schema;
        return schema;
    }

    public get<T extends string>(name: T) {
        return this.cache[name];
    }
}

export interface Relation<T = undefined, Ts = never> {
    ts?: Ts;
    as?: T;
    field: string;
    by: "belongsto" | "hasone" | "hasmany" | "mapmany" | "belongstomany";
    type: string;
}

export interface Structure {
    [key: string]: Relation<any, any>;
}

type NormalizedExtra<R extends Structure> = {
    [T in R[keyof R]["field"]]: T extends string ? R[keyof R]["ts"] : never;
};

export type Normalized<T, S extends Structure> = Partial<
    Omit<T, keyof S> & NormalizedExtra<S>
>;

export const schemas: Schemas = new Schemas();

export type Identifier = string | (<T extends Object>(data: T) => string);

export interface SchemaConfig {
    collect: string;
    identifier: string | ((data: Data) => string);
}

export class Schema<
    T extends Object,
    S extends Structure,
    P extends string,
    R = Normalized<T, S>,
    N = { [K in P]?: R }
> {
    readonly name: string;

    readonly struct: Structure;

    readonly collect: P;

    readonly relations: (keyof S)[];

    readonly identifier: Identifier;

    constructor(
        name: string,
        collect: P,
        struct: S,
        identifier: Identifier = "id"
    ) {
        this.name = name;
        this.struct = struct;
        this.collect = collect!;
        this.identifier = identifier!;
        this.relations = Object.keys(this.struct);
    }

    static create<T extends Object, Struct extends Structure, R extends string>(
        struct: Struct,
        name: string,
        collect: R,
        identifier: Identifier = "id"
    ) {
        let schema = new Schema<T, Struct, R>(
            name,
            collect,
            struct,
            identifier
        );
        schemas.define(name as any as string, schema);
        return schema;
    }

    public getCollection(related: N): R[] {
        const collection: { [key: string]: R } = (related as any)[this.collect];
        return collection ? Object.values(collection) : [];
    }

    public identify(data: T) {
        let { identifier } = this;
        if (typeof identifier == "function") {
            return identifier(data as any as Data);
        } else {
            return (data as any as Data)[identifier] as string;
        }
    }

    public normalize(data: T | T[]) {
        if (Array.isArray(data)) {
            return this.normalizeMany(data);
        } else {
            return this.normalizeOne(data);
        }
    }

    static hasOne<T>(type: string, field: string, as?: T): Relation<T> {
        return { as, type, field, by: "hasone" };
    }

    static hasMany<T>(type: string, field: string, as?: T): Relation<T> {
        return { as, type, field, by: "hasmany" };
    }

    static belongsTo<T>(type: string, field: string, as?: T): Relation<T> {
        return { as, type, field, by: "belongsto" };
    }

    static belongsToMany<T>(type: string, field: string, as?: T): Relation<T> {
        return { as, type, field, by: "belongstomany" };
    }

    static mapMany<T>(type: string, field: string, as?: T): Relation<T> {
        return { as, type, field, by: "mapmany" };
    }

    static of(name: string) {
        return schemas.get(name);
    }

    public normalizeOne(data: T): [R, NormalizedRelated] {
        let { struct, relations } = this;

        type RelatedKey = keyof typeof struct;

        let normalized = { ...data } as any;

        const relation = (relations as any as RelatedKey[]).reduce(
            (acc, key) => {
                let related = struct[key];
                let schema = schemas.get(related.type);

                let relation = {} as Data;
                let object = (data as any)[related.field];

                if (Boolean(object)) {
                    switch (related.by) {
                        case "mapmany":
                            {
                                let ref = related.as ? related.as : key;

                                let [subnormalized, subrelations] =
                                    schema.normalize(object) as [any, any];

                                normalized[ref] = subnormalized;
                                acc = merge(acc, subrelations);
                            }
                            break;

                        case "belongstomany":
                            {
                                object = Array.isArray(object)
                                    ? object
                                    : Object.values(object);

                                let [subnormalized, subrelations] =
                                    schema.normalizeMany(object) as [
                                        [any],
                                        any
                                    ];

                                let keys = subnormalized.map((subnorm) => {
                                    const id = schema.identify(subnorm);
                                    relation = merge(relation, {
                                        [id]: subnorm,
                                    });
                                    return id;
                                });
                                normalized[key] = keys;
                                acc = merge(acc, subrelations);
                            }
                            break;

                        case "belongsto":
                            {
                                let ref = related.as
                                    ? related.as
                                    : schema.name + "_id";

                                let [subnormalized, subrelations] =
                                    schema.normalize(object) as [any, any];

                                let identity = schema.identify(object);
                                normalized[ref] = identity;
                                relation[identity] = subnormalized;
                                delete normalized[key];

                                acc = merge(acc, subrelations);
                            }
                            break;

                        case "hasone":
                        case "hasmany":
                            {
                                if (!Array.isArray(object)) {
                                    object = Array.of(object) as Data[];
                                }

                                for (const subobj of object as Array<any>) {
                                    let [subnormalized, subrelations] =
                                        schema.normalize(subobj) as any as [
                                            Data,
                                            any
                                        ];
                                    if (related.as) {
                                        subnormalized[related.as] = (
                                            data as any as Unique
                                        ).id;
                                    }
                                    acc = merge(acc, subrelations);
                                    relation[schema.identify(subobj)] =
                                        subnormalized;
                                }
                                delete normalized[key];
                            }
                            break;

                        default:
                            break;
                    }
                }

                acc[schema.collect] = relation;
                return acc;
            },
            {} as { [key: string]: any }
        );

        return [normalized as any as R, relation];
    }

    public normalizeMany(data: T[]) {
        return data.reduce(
            (acc, data) => {
                let [normalized, relation] = this.normalizeOne(data);
                acc[0].push(normalized);
                acc[1] = merge(acc[1], relation);
                return acc;
            },
            [[], {}] as [R[], NormalizedRelated]
        );
    }
}

Schema.create<any, { [key: string]: any }, "objects">({}, "object", "objects");
