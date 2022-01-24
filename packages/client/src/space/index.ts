import { mixin } from "@octal/common";
import BaseClient from "../base";
import SpaceClient from "./space";
import MemberClient from "./member";
import InvitationClient from "./invitation";
import RoleClient from "./role";

class Client extends BaseClient {}

interface Client
    extends SpaceClient,
        InvitationClient,
        MemberClient,
        RoleClient {}

mixin(Client, [SpaceClient, MemberClient, RoleClient, InvitationClient]);

export default Client;
