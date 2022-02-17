export const star =
    "(?<!\\*)\\*\\*([^\\s]([\\w\\s](?!\\*))+?[^\\s])\\*\\*(?!\\*)";
export const underscore = "(?<!_)__([^\\s_]([\\w\\s](?!_))+?[^\\s])__(?!_)";
export default `(${star})|(${underscore})`;
