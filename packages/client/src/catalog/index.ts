import { mixin } from "@colab/common";
import BaseClient from "../base";
import CatalogClient from "./catalog";
import RecordClient from "./record";
import LabelClient from "./label";
import CollectionClient from "./collection";
import RecordFieldClient from "./recordfield";

class Client extends BaseClient { }

interface Client
    extends CatalogClient,
    CollectionClient,
    LabelClient,
    RecordClient,
    RecordFieldClient { }

mixin(Client, [
    CatalogClient,
    LabelClient,
    RecordClient,
    CollectionClient,
    RecordFieldClient,
]);

export default Client;
