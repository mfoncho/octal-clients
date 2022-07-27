import { Record } from "immutable";
import { io } from "@octal/client";

export class TrackerRecord extends Record({
    id: "",
    event: "",
    target: "",
    entity_id: "",
}) {}

export class NameRecord extends Record({
    type: "",
    name: "",
    metadata: {} as object,
    entity_id: "",
}) {}

export class ConfigRecord extends Record<io.Config>({
    locale: "en_US",
    lpack: {},
    user_invitation: false,
    user_registration: false,
    admin_api_version: "",
    client_api_version: "",
    socket_api_version: "",
    admin_api_endpoint: "",
    client_api_endpoint: "",
    socket_api_endpoint: "",
    socket_api_protocol: "",
    auth_providers: [["email", "password"]],
}) {}
