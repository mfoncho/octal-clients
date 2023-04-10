const admin = "/admin";
const users = `${admin}/users`;
const records = `${admin}/records`;
const record = `${records}/:record_id`;
const collections = `${admin}/collections`;
const spaces = `${admin}/spaces`;
const checklists = `${admin}/checklists`;
const workspaces = `${admin}/workspaces`;
const space = `${spaces}/:space_id`;
const invitations = `${admin}/invitations`;
const checklist = `${checklists}/:checklist_id`;
const workspace = `${workspaces}/:workspace_id`;

const paths = {
    record,
    users,
    admin,
    records,
    collections,
    space,
    spaces,
    checklist,
    workspace,
    workspaces,
    checklists,
    invitations,
};

export type Path = keyof typeof paths;

export default Object.freeze(paths);
