import "../tailwind.css";
import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Button } from "./Button";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: "Example/Button",
    component: Button,
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof Button>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
    color: "primary",
    children: "Button",
};

export const Regular = Template.bind({});
Regular.args = {
    color: "regular",
    children: "Button",
};

export const Danger = Template.bind({});
Danger.args = {
    color: "danger",
    children: "Button",
};

export const Clear = Template.bind({});
Clear.args = {
    color: "clear",
    children: "Button",
};
