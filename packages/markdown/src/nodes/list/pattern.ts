const preblock = "((^)|(?<=\n))";
export const task = "^\\[([x\\s])\\] (.*)";
export const unordered = "([*+-] .*\n?)+";
export const ordered = "([1-9][.)] .*\n?)+";
export const pattern = `(${preblock}${ordered})|(${preblock}${unordered})`;
export default pattern;
