import { Record } from "immutable";
import { io } from "@colab/client";

export class SiteRecord extends Record<io.Site>({
    name: "colab",
    icon: "",
    title: "Colaborations",
    about: "Colaborations",
}) {}
