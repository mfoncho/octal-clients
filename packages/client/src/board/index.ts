import { mixin } from "@octal/common";
import BaseClient from "../base";
import BoardClient from "./board";
import CardClient from "./card";
import LabelClient from "./label";
import ColumnClient from "./column";
import CardFieldClient from "./cardfield";

class Client extends BaseClient {}

interface Client
    extends BoardClient,
        ColumnClient,
        LabelClient,
        CardClient,
        CardFieldClient {}

mixin(Client, [
    BoardClient,
    LabelClient,
    CardClient,
    ColumnClient,
    CardFieldClient,
]);

export default Client;
