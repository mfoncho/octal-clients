import { io } from "@colab/client";

interface IPreference {
    key: keyof io.Preference;
    name: string;
    description: string;
}

interface ISelectable extends IPreference {
    type: "select" | "colors";
    options: { name: string; value: string; description?: string }[];
}

interface IBoolean extends IPreference {
    type: "boolean";
}

interface INumber extends IPreference {
    type: "number";
}

const preferences: (ISelectable | IBoolean | INumber)[] = [];
export default preferences;
