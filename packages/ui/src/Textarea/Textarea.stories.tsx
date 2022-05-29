import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Input from "./Textarea";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: "UI/Input/Textarea",
    component: Input,
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof Input>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Input> = (args) => {
    const [value, setValue] = React.useState(args.value);
    return (
        <Input
            {...args}
            value={value}
            onChange={(e) => setValue(e.target.value)}
        />
    );
};

const text = `Markdown is a lightweight markup language based on the formatting conventions
that people naturally use in email [Link text Here](https://link-url-here.org).
As [John Gruber] writes on the _link http://sample.com_`;

export const Textarea = Template.bind({});
Textarea.args = {
    value: text,
};
