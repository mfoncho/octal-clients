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
    const [data, setData] = React.useState<any>([]);
    React.useEffect(() => {
        setValue(args.value ?? "");
    }, [args.value?.trim()]);
    React.useEffect(() => {}, [value, data]);
    return (
        <Input
            {...args}
            value={value}
            onSubmit={(_e) => setValue("")}
            onChange={(e) => {
                setData(e.target.data);
                setValue(e.target.value);
            }}
        />
    );
};

const text = `> hello
> we are one`;

export const Post = Template.bind({});
Post.args = {
    value: text,
    files: [new File(["sample"], "attachment.txt")],
};
