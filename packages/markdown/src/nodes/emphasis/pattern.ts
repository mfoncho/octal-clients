//\b_(?![_\s])(.*?[^_\s])_\b
//\b_(?![_\s])(.*?[^_\s])_(?!\S)
export const star = "(\\*)((\\S.*?\\S)|(\\S))\\*";
export const underscore = "(_)((\\S.*?\\S)|(\\S))_";
export const umarker = "(_{1,})";
export const smarker = "(\\*{1,})";
export const markers = { _: umarker, "*": smarker };
export default `(${star})|(${underscore})`;
