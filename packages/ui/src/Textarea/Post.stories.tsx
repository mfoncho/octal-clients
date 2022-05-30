import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Input from "./Post";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: "UI/Input/Post",
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
            onSubmit={console.log}
            onChange={(e) => setValue(e.target.value)}
        />
    );
};

const text = "";

export const Post = Template.bind({});
Post.args = {
    value: text,
    files: [new File(["sample"], "hello.txt")],
};
