import {
    ThreadSchema, SpaceSchema, RecordSchema, ChecklistSchema, UserSchema,
    CollectionSchema, MessageSchema, CatalogSchema, MemberSchema
} from './schemas'

export type NormalizedThread = ReturnType<
    typeof ThreadSchema["normalizeOne"]
>[0];

export type NormalizedUser = ReturnType<
    typeof UserSchema["normalizeOne"]
>[0];

export type NormalizedRecord = ReturnType<
    typeof RecordSchema["normalizeOne"]
>[0];

export type NormalizedMember = ReturnType<
    typeof MemberSchema["normalizeOne"]
>[0]

export type NormalizedCatalog = ReturnType<
    typeof CatalogSchema["normalizeOne"]
>[0]

export type NormalizedChecklist = ReturnType<
    typeof ChecklistSchema["normalizeOne"]
>[0];

export type NormalizedSpace = ReturnType<
    typeof SpaceSchema["normalizeOne"]
>[0];

export type NormalizedCollection = ReturnType<
    typeof CollectionSchema["normalizeOne"]
>[0];

export type NormalizedMessage = ReturnType<
    typeof MessageSchema["normalizeOne"]
>[0];

export type NormalizedRelated =
    | typeof UserSchema
    | typeof SpaceSchema
    | typeof ThreadSchema

