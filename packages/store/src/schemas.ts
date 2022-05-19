import { io } from "@octal/client";
import { Relation, Schema } from "./normalizer";

const cards: Relation<undefined> = Schema.hasMany("card", "cards");

const boards: Relation<undefined> = Schema.hasMany("board", "boards");

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

const card_fields: Relation<"fields", string> = Schema.mapMany(
    "field",
    "fields",
    "fields"
);

const card_field_values: Relation<"values", string> = Schema.mapMany(
    "value",
    "values",
    "values"
);

const users: Relation<"users", string> = Schema.belongsToMany(
    "user",
    "users",
    "users"
);

const BoardStruct = {};

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

const CardFieldValueStruct = {
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

const ColumnStruct = {
    cards: cards,
};

const CardStruct = {
    user: user,
    fields: card_fields,
    //checklists: checklists,
};

const ChecklistStruct = {
    user: user,
};

const MemberStruct = {
    user: user,
};

const CardFieldStruct = {
    users: users,
    values: card_field_values,
};

export const CardFieldValueSchema = Schema.create<
    any,
    typeof CardFieldValueStruct,
    "values"
>(CardFieldValueStruct, "value", "values");

export const CardFieldValuesSchema = Schema.create<
    any,
    typeof CardFieldValueStruct,
    "values"
>(CardFieldValueStruct, "values", "values");

export const CardFieldSchema = Schema.create<
    io.CardField,
    typeof CardFieldStruct,
    "fields"
>(CardFieldStruct, "field", "fields");

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

export const BoardSchema = Schema.create<
    io.Board,
    typeof BoardStruct,
    "boards"
>(BoardStruct, "board", "boards");

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

export const CardSchema = Schema.create<io.Card, typeof CardStruct, "cards">(
    CardStruct,
    "card",
    "cards"
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

export const ColumnSchema = Schema.create<
    io.Column,
    typeof ColumnStruct,
    "columns"
>(ColumnStruct, "column", "columns");

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

export type NormalizedBoard = ReturnType<typeof BoardSchema["normalizeOne"]>[0];

export type NormalizedTopic = ReturnType<typeof TopicSchema["normalizeOne"]>[0];

export type NormalizedThread = ReturnType<
    typeof ThreadSchema["normalizeOne"]
>[0];

export type NormalizedUser = ReturnType<typeof UserSchema["normalizeOne"]>[0];

export type NormalizedCard = ReturnType<typeof CardSchema["normalizeOne"]>[0];

export type NormalizedChecklist = ReturnType<
    typeof ChecklistSchema["normalizeOne"]
>[0];

export type NormalizedSpace = ReturnType<typeof SpaceSchema["normalizeOne"]>[0];

export type NormalizedMember = ReturnType<
    typeof MemberSchema["normalizeOne"]
>[0];

export type NormalizedColumn = ReturnType<
    typeof ColumnSchema["normalizeOne"]
>[0];

export type NormalizedMessage = ReturnType<
    typeof MessageSchema["normalizeOne"]
>[0];

export type NormalizedCardFieldValue = ReturnType<
    typeof CardFieldValueSchema["normalizeOne"]
>[0];

export type RelatedRecord<T> = Record<string, T>;

export type NormalizedRelated = {
    [UserSchema.collect]?: RelatedRecord<NormalizedUser>;
    [CardSchema.collect]?: RelatedRecord<NormalizedCard>;
    [ColumnSchema.collect]?: RelatedRecord<NormalizedColumn>;
    [ThreadSchema.collect]?: RelatedRecord<NormalizedThread>;
    [MessageSchema.collect]?: RelatedRecord<NormalizedMessage>;
    [ChecklistSchema.collect]?: RelatedRecord<NormalizedChecklist>;
    [MemberSchema.collect]?: RelatedRecord<NormalizedMember>;
    [SpaceSchema.collect]?: RelatedRecord<NormalizedSpace>;
    [BoardSchema.collect]?: RelatedRecord<NormalizedBoard>;
    [TopicSchema.collect]?: RelatedRecord<NormalizedTopic>;
    [CardFieldValueSchema.collect]?: RelatedRecord<NormalizedCardFieldValue>;
};
