const preblock = "((^)|(?<=\\n))";
export const task = "^\\[([x\\s])\\] (.*)";
export const unordered = "([*+-] .*\\n?)+";
export const ordered = "([0-9]{1,}[\\.\\)] .*\\n?)+";
export const pattern = `(${preblock}${ordered})|(${preblock}${unordered})`;
export default pattern;
