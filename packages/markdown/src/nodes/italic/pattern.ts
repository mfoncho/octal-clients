export const star = "\\*(?!\\*)([^\\s]([\\w\\s](?!\\*))+?[^\\s])\\*(?!\\*)";
export const underscore = "_(?!_)([^\\s]([\\w\\s](?!_))+?[^\\s])_(?!_)";
export default `(${star})|(${underscore})`;
