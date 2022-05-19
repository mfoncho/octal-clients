const spaces = "/spaces";
const chat = `/chat/:space_id`;
const space = `${spaces}/:space_id`;
const board = `${space}/boards/:board_id`;
const card = `${board}/:card_id`;
const topic = `${space}/topics/:topic_id`;
const thread = `${space}/topics/:topic_id`;

const paths = {
    chat,
    spaces,
    space,
    board,
    card,
    thread,
    topic,
};

export type Path = keyof typeof paths;

export default Object.freeze(paths);
