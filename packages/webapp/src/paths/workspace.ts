const spaces = "/spaces";
const chat = `/chat/:space_id`;
const space = `${spaces}/:space_id`;
const catalog = `${space}/catalogs/:catalog_id`;
const record = `${catalog}/:record_id`;
const topic = `${space}/topics/:topic_id`;
const thread = `${space}/topics/:topic_id`;

const paths = {
    chat,
    spaces,
    space,
    catalog,
    record,
    thread,
    topic,
};

export type Path = keyof typeof paths;

export default Object.freeze(paths);
