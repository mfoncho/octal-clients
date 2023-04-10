import { io } from "@colab/client";
import { Relation, Schema } from "./normalizer";

const records: Relation<undefined> = Schema.hasMany("record", "records");

const catalogs: Relation<undefined> = Schema.hasMany("catalog", "catalogs");

const topics: Relation<undefined> = Schema.hasMany("topic", "topics");

const user: Relation<"user_id", string> = Schema.belongsTo(
    "user",
    "user",
    "user_id"
);

const label: Relation<"label_id", string> = Schema.belongsTo(
    "label",
    "label",
    "label_id"
);

const author: Relation<"user_id", string> = Schema.belongsTo(
    "user",
    "author",
    "user_id"
);

const reply: Relation<"reply_id", string> = Schema.belongsTo(
    "message",
    "reply",
    "reply_id"
);

const reactions: Relation<"reactions", string> = Schema.mapMany(
    "reactions",
    "reactions",
    "reactions"
);

const record_fields: Relation<"fields", string> = Schema.mapMany(
    "field",
    "fields",
    "fields"
);

const record_field_values: Relation<"values", string> = Schema.mapMany(
    "value",
    "values",
    "values"
);

const users: Relation<"users", string> = Schema.belongsToMany(
    "user",
    "users",
    "users"
);

const CatalogStruct = {};

const TopicStruct = {};

const LabelStruct = {};

const SpaceStruct = {
    users: users
};

const UsersReactionStruct = {
    users: users,
};

const ReactionStruct = {
    user: user,
};

const UserStruct = {};

const RecordFieldValueStruct = {
    user: user,
    label: label,
};

const ThreadStruct = {};

const MessageStruct = {
    reply: reply,
    author: author,
    reactions: reactions,
};

const StatusStruct = {};

const CollectionStruct = {
    records: records,
};

const RecordStruct = {
    user: user,
    fields: record_fields,
    //checklists: checklists,
};

const ChecklistStruct = {
    user: user,
};

const MemberStruct = {
    user: user,
};

const RecordFieldStruct = {
    users: users,
    values: record_field_values,
};

export const RecordFieldValueSchema = Schema.create<
    any,
    typeof RecordFieldValueStruct,
    "values"
>(RecordFieldValueStruct, "value", "values");

export const RecordFieldValuesSchema = Schema.create<
    any,
    typeof RecordFieldValueStruct,
    "values"
>(RecordFieldValueStruct, "values", "values");

export const RecordFieldSchema = Schema.create<
    io.RecordField,
    typeof RecordFieldStruct,
    "fields"
>(RecordFieldStruct, "field", "fields");

export const SpaceSchema = Schema.create<
    io.Space,
    typeof SpaceStruct,
    "spaces"
>(SpaceStruct, "space", "spaces");

export const ReactionSchema = Schema.create<
    io.Reaction,
    typeof ReactionStruct,
    "reaction"
>(ReactionStruct, "reaction", "reaction");

export const UsersReactionSchema = Schema.create<
    io.UsersReaction,
    typeof UsersReactionStruct,
    "reactions"
>(UsersReactionStruct, "reactions", "reactions");

export const TopicSchema = Schema.create<
    io.Topic,
    typeof TopicStruct,
    "topics"
>(TopicStruct, "topic", "topics");

export const CatalogSchema = Schema.create<
    io.Catalog,
    typeof CatalogStruct,
    "catalogs"
>(CatalogStruct, "catalog", "catalogs");

export const LabelSchema = Schema.create<io.User, typeof LabelStruct, "labels">(
    LabelStruct,
    "label",
    "labels"
);
export const UserSchema = Schema.create<io.User, typeof UserStruct, "users">(
    UserStruct,
    "user",
    "users"
);

export const ThreadSchema = Schema.create<
    io.Thread,
    typeof ThreadStruct,
    "threads"
>(ThreadStruct, "thread", "threads");

export const RecordSchema = Schema.create<io.Record, typeof RecordStruct, "records">(
    RecordStruct,
    "record",
    "records"
);

export const StatusSchema = Schema.create<any, typeof StatusStruct, "statuses">(
    StatusStruct,
    "status",
    "statuses"
);

export const ChecklistSchema = Schema.create<
    io.Checklist,
    typeof ChecklistStruct,
    "checklists"
>(ChecklistStruct, "checklist", "checklists");

export const CollectionSchema = Schema.create<
    io.Collection,
    typeof CollectionStruct,
    "collections"
>(CollectionStruct, "collection", "collections");

export const MessageSchema = Schema.create<
    io.Message,
    typeof MessageStruct,
    "messages"
>(MessageStruct, "message", "messages");

export const MemberSchema = Schema.create<
    io.Member,
    typeof MemberStruct,
    "members"
>(MemberStruct, "member", "members");

export type NormalizedReaction = ReturnType<
    typeof ReactionSchema["normalizeOne"]
>[0];

export type NormalizedCatalog = ReturnType<typeof CatalogSchema["normalizeOne"]>[0];

export type NormalizedTopic = ReturnType<typeof TopicSchema["normalizeOne"]>[0];

export type NormalizedThread = ReturnType<
    typeof ThreadSchema["normalizeOne"]
>[0];

export type NormalizedUser = ReturnType<typeof UserSchema["normalizeOne"]>[0];

export type NormalizedRecord = ReturnType<typeof RecordSchema["normalizeOne"]>[0];

export type NormalizedChecklist = ReturnType<
    typeof ChecklistSchema["normalizeOne"]
>[0];

export type NormalizedSpace = ReturnType<typeof SpaceSchema["normalizeOne"]>[0];

export type NormalizedMember = ReturnType<
    typeof MemberSchema["normalizeOne"]
>[0];

export type NormalizedCollection = ReturnType<
    typeof CollectionSchema["normalizeOne"]
>[0];

export type NormalizedMessage = ReturnType<
    typeof MessageSchema["normalizeOne"]
>[0];

export type NormalizedRecordFieldValue = ReturnType<
    typeof RecordFieldValueSchema["normalizeOne"]
>[0];

export type RelatedRecord<T> = Record<string, T>;

export type NormalizedRelated = {
    [UserSchema.collect]?: RelatedRecord<NormalizedUser>;
    [RecordSchema.collect]?: RelatedRecord<NormalizedRecord>;
    [CollectionSchema.collect]?: RelatedRecord<NormalizedCollection>;
    [ThreadSchema.collect]?: RelatedRecord<NormalizedThread>;
    [MessageSchema.collect]?: RelatedRecord<NormalizedMessage>;
    [ChecklistSchema.collect]?: RelatedRecord<NormalizedChecklist>;
    [MemberSchema.collect]?: RelatedRecord<NormalizedMember>;
    [SpaceSchema.collect]?: RelatedRecord<NormalizedSpace>;
    [CatalogSchema.collect]?: RelatedRecord<NormalizedCatalog>;
    [TopicSchema.collect]?: RelatedRecord<NormalizedTopic>;
    [RecordFieldValueSchema.collect]?: RelatedRecord<NormalizedRecordFieldValue>;
};
