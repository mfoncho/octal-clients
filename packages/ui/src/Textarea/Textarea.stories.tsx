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

const text = `## Features

- Import a HTML file and watch it magically convert to Markdown
- Drag and drop images (requires your Dropbox account be linked)
- Drag and drop markdown and HTML files into Dillinger
- Export documents as Markdown, HTML and PDF

Markdown is a lightweight markup language based on the formatting conventions
that people naturally use in email.
As [John Gruber] writes on the _link http://sample.com_`;

export const Textarea = Template.bind({});
Textarea.args = {
    value: text,
};
