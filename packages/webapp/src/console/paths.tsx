const admin = "/console";
const dashboard = `${admin}/dashboard`;
const users = `${admin}/users`;
const roles = `${admin}/roles`;
const role = `${roles}/:role_id`;
const user = `${users}/:user_id`;
const spaces = `${admin}/spaces`;
const space = `${spaces}/:space_id`;
const settings = `${admin}/settings`;
const workspace = `${admin}/workspace`;
const invitations = `${admin}/invitations`;

const paths = {
    user,
    role,
    roles,
    users,
    admin,
    space,
    spaces,
    settings,
    dashboard,
    workspace,
    invitations,
};

export type Path = keyof typeof paths;

export default Object.freeze(paths);
