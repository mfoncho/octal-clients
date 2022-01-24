import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import SearchInput, { ISearchInput} from "./Main";

export default {
    title: "IconInput",
    component: SearchInput,
} as Meta;

const Template: Story<ISearchInput> = (args) => <SearchInput {...args} />;

export const index = Template.bind({});

index.args = {
    value: "",
    placeholder: "placeholder"
};
