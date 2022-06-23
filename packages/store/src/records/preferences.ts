import { Record } from "immutable";
export const preferences = {
    ["language"]: "purple",

    ["time.zone"]: "",
    ["time.format"]: "ll",

    ["webapp.theme.mode"]: "light",
    ["webapp.theme.color"]: "purple",
    ["webapp.message.view"]: "compact",

    ["notification"]: true,
};

export type Preference = keyof typeof preferences;

export class PreferencesRecord extends Record(preferences) {}
