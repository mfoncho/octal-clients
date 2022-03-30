import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import TextareaInput from "./Textarea";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: "UI/Input/Textarea",
    component: TextareaInput,
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof TextareaInput>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof TextareaInput> = (args) => (
    <TextareaInput {...args} />
);

const text = "";

export const Textarea = Template.bind({});
Textarea.args = {
    value: text,
};
