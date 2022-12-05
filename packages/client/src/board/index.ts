import { mixin } from "@colab/common";
import BaseClient from "../base";
import BoardClient from "./board";
import CardClient from "./card";
import LabelClient from "./label";
import CollectionClient from "./collection";
import CardFieldClient from "./cardfield";

class Client extends BaseClient { }

interface Client
    extends BoardClient,
    CollectionClient,
    LabelClient,
    CardClient,
    CardFieldClient { }

mixin(Client, [
    BoardClient,
    LabelClient,
    CardClient,
    CollectionClient,
    CardFieldClient,
]);

export default Client;
