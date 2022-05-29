import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import TextInput from "./Input";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: "UI/Input/Input",
    component: TextInput,
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof TextInput>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof TextInput> = (args) => {
    const [value, setValue] = React.useState(args.value);
    return (
        <TextInput
            {...args}
            value={value}
            onChange={(e) => setValue(e.target.value)}
        />
    );
};

const text = ``;

export const Input = Template.bind({});
Input.args = {
    placeholder: "Input text",
    value: text,
};
