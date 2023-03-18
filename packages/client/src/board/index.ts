import { mixin } from "@colab/common";
import BaseClient from "../base";
import CardClient from "./card";
import LabelClient from "./label";
import CollectionClient from "./collection";
import CardFieldClient from "./cardfield";

class Client extends BaseClient { }

interface Client
    extends CollectionClient,
    LabelClient,
    CardClient,
    CardFieldClient { }

mixin(Client, [
    LabelClient,
    CardClient,
    CollectionClient,
    CardFieldClient,
]);

export default Client;
