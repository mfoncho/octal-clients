import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import PostInput from "./Post";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: "UI/Input/Post",
    component: PostInput,
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof PostInput>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof PostInput> = (args) => (
    <PostInput {...args} />
);

const text = "";

export const Post = Template.bind({});
Post.args = {
    value: text,
};
